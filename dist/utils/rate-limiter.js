/**
 * @file WebSocket Rate Limiter
 * @module utils/rate-limiter
 */
/**
 * Rate limit rules for different event types
 */
export const DEFAULT_RATE_LIMITS = {
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
export function createRateLimiter(config = DEFAULT_RATE_LIMITS, _logger) {
    return new RateLimiterImpl(config.EVENT || {
        windowMs: 60000,
        maxRequests: 100,
        blockDurationMs: 300000
    });
}
/**
 * Creates a connection rate limiter
 * @param config - Connection limit configuration
 * @param logger - Logger instance
 * @returns {ConnectionRateLimiter} Connection rate limiter
 */
export function createConnectionRateLimiter(config, logger) {
    const clients = new Map();
    function cleanOldAttempts(attempts) {
        const now = Date.now();
        return attempts.filter(attempt => now - attempt.timestamp < 60000);
    }
    return {
        async allowConnection(clientId) {
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
        recordConnection(clientId, successful) {
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
export class RateLimiterImpl {
    constructor(config) {
        this.clients = new Map();
        this.config = {
            windowMs: config.windowMs || 60000,
            maxRequests: config.maxRequests || 100,
            blockDurationMs: config.blockDurationMs || 300000
        };
    }
    getClientState(clientId) {
        let state = this.clients.get(clientId);
        if (!state) {
            state = { requests: new Map() };
            this.clients.set(clientId, state);
        }
        return state;
    }
    async shouldLimit(clientId, message) {
        const now = Date.now();
        const state = this.getClientState(clientId);
        // Check if client is blocked
        if (state.blockedUntil && state.blockedUntil > now) {
            return true;
        }
        // Get requests for message type
        const requests = state.requests.get(message[0]) || [];
        const validRequests = requests.filter(time => time > now - this.config.windowMs);
        // Update requests
        state.requests.set(message[0], validRequests);
        // Check if limit exceeded
        if (validRequests.length >= this.config.maxRequests) {
            state.blockedUntil = now + this.config.blockDurationMs;
            return true;
        }
        // Add new request
        validRequests.push(now);
        state.requests.set(message[0], validRequests);
        return false;
    }
    recordRequest(clientId, message) {
        const state = this.getClientState(clientId);
        const requests = state.requests.get(message[0]) || [];
        requests.push(Date.now());
        state.requests.set(message[0], requests);
    }
    getRemainingRequests(clientId, messageType) {
        const state = this.getClientState(clientId);
        const now = Date.now();
        const requests = state.requests.get(messageType) || [];
        const validRequests = requests.filter(time => time > now - this.config.windowMs);
        return Math.max(0, this.config.maxRequests - validRequests.length);
    }
    isBlocked(clientId) {
        const state = this.getClientState(clientId);
        return !!state.blockedUntil && state.blockedUntil > Date.now();
    }
}
//# sourceMappingURL=rate-limiter.js.map