/**
 * @file WebSocket Rate Limiter
 * @module utils/rate-limiter
 */

import type { NostrWSMessage } from '../types/messages';
import type { Logger } from '../types/logger';

/**
 * Rate limit configuration for different message types
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDurationMs?: number;
}

/**
 * Client state for rate limiting
 */
interface ClientState {
  requests: Map<string, number[]>;
  blockedUntil?: number;
}

/**
 * Rate limiter interface
 */
export interface RateLimiter {
  shouldLimit(clientId: string, message: NostrWSMessage): Promise<boolean>;
  recordRequest(clientId: string, message: NostrWSMessage): void;
  getRemainingRequests(clientId: string, messageType: string): number;
  isBlocked(clientId: string): boolean;
  getClientState(clientId: string): ClientState;
}

/**
 * Rate limit rules for different event types
 */
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  EVENT: {
    windowMs: 60000, // 1 minute
    maxRequests: 60,
    blockDurationMs: 300000 // 5 minutes
  },
  REQ: {
    windowMs: 60000,
    maxRequests: 30,
    blockDurationMs: 300000
  },
  CLOSE: {
    windowMs: 60000,
    maxRequests: 50
  },
  AUTH: {
    windowMs: 300000, // 5 minutes
    maxRequests: 10,
    blockDurationMs: 900000 // 15 minutes
  }
};

/**
 * Creates a rate limiter
 * @param config - Rate limit configuration
 * @param _logger - Logger instance
 * @returns {RateLimiter} Rate limiter
 */
export function createRateLimiter(
  config: Record<string, RateLimitConfig> = DEFAULT_RATE_LIMITS,
  _logger: Logger
): RateLimiter {
  return new RateLimiterImpl(config.EVENT || {
    windowMs: 60000,
    maxRequests: 100,
    blockDurationMs: 300000
  });
}

/**
 * WebSocket connection rate limiter interface
 */
export interface ConnectionRateLimiter {
  /**
   * Checks if a new connection should be allowed
   * @param clientId - Client identifier
   * @returns {Promise<boolean>} True if connection is allowed
   */
  allowConnection(clientId: string): Promise<boolean>;

  /**
   * Records a connection attempt
   * @param clientId - Client identifier
   * @param successful - Whether connection was successful
   */
  recordConnection(clientId: string, successful: boolean): void;
}

/**
 * Creates a connection rate limiter
 * @param config - Connection limit configuration
 * @param logger - Logger instance
 * @returns {ConnectionRateLimiter} Connection rate limiter
 */
export function createConnectionRateLimiter(
  config: {
    maxConnectionsPerMinute: number;
    maxConcurrentConnections: number;
    blockAfterFailures: number;
    blockDurationMs: number;
  },
  logger: Logger
): ConnectionRateLimiter {
  interface ConnectionState {
    attempts: Array<{ timestamp: number; successful: boolean }>;
    blockedUntil?: number;
    currentConnections: number;
  }

  const clients = new Map<string, ConnectionState>();

  function cleanOldAttempts(attempts: Array<{ timestamp: number; successful: boolean }>): Array<{ timestamp: number; successful: boolean }> {
    const now = Date.now();
    return attempts.filter(attempt => now - attempt.timestamp < 60000);
  }

  return {
    async allowConnection(clientId: string): Promise<boolean> {
      const now = Date.now();
      const state = clients.get(clientId) || {
        attempts: [],
        currentConnections: 0
      };

      // Check if blocked
      if (state.blockedUntil && now < state.blockedUntil) {
        logger.debug('Connection blocked', {
          clientId,
          until: new Date(state.blockedUntil)
        });
        return false;
      }

      // Clean old attempts
      state.attempts = cleanOldAttempts(state.attempts);

      // Check rate limits
      if (state.attempts.length >= config.maxConnectionsPerMinute) {
        logger.debug('Too many connection attempts', {
          clientId,
          attempts: state.attempts.length
        });
        return false;
      }

      // Check concurrent connections
      if (state.currentConnections >= config.maxConcurrentConnections) {
        logger.debug('Too many concurrent connections', {
          clientId,
          connections: state.currentConnections
        });
        return false;
      }

      // Check failure rate
      const recentFailures = state.attempts.filter(a => !a.successful).length;
      if (recentFailures >= config.blockAfterFailures) {
        state.blockedUntil = now + config.blockDurationMs;
        clients.set(clientId, state);
        logger.debug('Client blocked due to failures', {
          clientId,
          failures: recentFailures,
          until: new Date(state.blockedUntil)
        });
        return false;
      }

      return true;
    },

    recordConnection(clientId: string, successful: boolean): void {
      const state = clients.get(clientId) || {
        attempts: [],
        currentConnections: 0
      };

      state.attempts.push({
        timestamp: Date.now(),
        successful
      });

      if (successful) {
        state.currentConnections++;
      }

      clients.set(clientId, state);
    }
  };
}

/**
 * Rate limiter implementation
 */
export class RateLimiterImpl implements RateLimiter {
  private clients: Map<string, ClientState> = new Map();
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs || 60000,
      maxRequests: config.maxRequests || 100,
      blockDurationMs: config.blockDurationMs || 300000
    };
  }

  public getClientState(clientId: string): ClientState {
    let state = this.clients.get(clientId);
    if (!state) {
      state = { requests: new Map() };
      this.clients.set(clientId, state);
    }
    return state;
  }

  public async shouldLimit(clientId: string, message: NostrWSMessage): Promise<boolean> {
    const now = Date.now();
    const state = this.getClientState(clientId);

    // Check if client is blocked
    if (state.blockedUntil && state.blockedUntil > now) {
      return true;
    }

    // Get requests for message type
    const requests = state.requests.get(message.type) || [];
    const validRequests = requests.filter(time => time > now - this.config.windowMs);

    // Update requests
    state.requests.set(message.type, validRequests);

    // Check if limit exceeded
    if (validRequests.length >= this.config.maxRequests) {
      state.blockedUntil = now + this.config.blockDurationMs;
      return true;
    }

    // Add new request
    validRequests.push(now);
    return false;
  }

  public recordRequest(clientId: string, message: NostrWSMessage): void {
    const state = this.getClientState(clientId);
    const requests = state.requests.get(message.type) || [];
    requests.push(Date.now());
    state.requests.set(message.type, requests);
  }

  public getRemainingRequests(clientId: string, messageType: string): number {
    const state = this.getClientState(clientId);
    const now = Date.now();
    const requests = state.requests.get(messageType) || [];
    const validRequests = requests.filter(time => time > now - this.config.windowMs);
    return Math.max(0, this.config.maxRequests - validRequests.length);
  }

  public isBlocked(clientId: string): boolean {
    const state = this.getClientState(clientId);
    return !!state.blockedUntil && state.blockedUntil > Date.now();
  }
}
