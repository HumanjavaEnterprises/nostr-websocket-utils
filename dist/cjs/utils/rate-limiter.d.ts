/**
 * @file WebSocket Rate Limiter
 * @module utils/rate-limiter
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
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
export declare const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig>;
/**
 * Creates a rate limiter
 * @param config - Rate limit configuration
 * @param _logger - Logger instance
 * @returns {RateLimiter} Rate limiter
 */
export declare function createRateLimiter(config: Record<string, RateLimitConfig> | undefined, _logger: Logger): RateLimiter;
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
export declare function createConnectionRateLimiter(config: {
    maxConnectionsPerMinute: number;
    maxConcurrentConnections: number;
    blockAfterFailures: number;
    blockDurationMs: number;
}, logger: Logger): ConnectionRateLimiter;
/**
 * Rate limiter implementation
 */
export declare class RateLimiterImpl implements RateLimiter {
    private clients;
    private config;
    constructor(config: RateLimitConfig);
    getClientState(clientId: string): ClientState;
    shouldLimit(clientId: string, message: NostrWSMessage): Promise<boolean>;
    recordRequest(clientId: string, message: NostrWSMessage): void;
    getRemainingRequests(clientId: string, messageType: string): number;
    isBlocked(clientId: string): boolean;
}
export {};
//# sourceMappingURL=rate-limiter.d.ts.map