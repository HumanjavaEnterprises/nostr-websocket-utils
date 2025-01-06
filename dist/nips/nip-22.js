/**
 * @file NIP-22: Event Created At Limits
 * @module nips/nip-22
 * @see https://github.com/nostr-protocol/nips/blob/master/22.md
 */
/**
 * Default time limits in seconds
 */
export const DEFAULT_TIME_LIMITS = {
    FUTURE_LIMIT: 900, // 15 minutes
    PAST_LIMIT: 31536000 // 1 year
};
/**
 * Creates a time validator
 * @param logger - Logger instance
 * @param futureLimitSeconds - Future time limit in seconds
 * @param pastLimitSeconds - Past time limit in seconds
 * @returns {TimeValidator} Time validator
 */
export function createTimeValidator(logger, futureLimitSeconds = DEFAULT_TIME_LIMITS.FUTURE_LIMIT, pastLimitSeconds = DEFAULT_TIME_LIMITS.PAST_LIMIT) {
    let timeOffset = 0; // Offset between local and server time
    return {
        validateTime(timestamp) {
            const now = Date.now() / 1000 + timeOffset;
            // Check future limit
            if (timestamp > now + futureLimitSeconds) {
                return {
                    valid: false,
                    reason: 'Event timestamp too far in the future'
                };
            }
            // Check past limit
            if (timestamp < now - pastLimitSeconds) {
                return {
                    valid: false,
                    reason: 'Event timestamp too far in the past'
                };
            }
            return { valid: true };
        },
        updateTimeOffset(serverTime) {
            const localTime = Date.now() / 1000;
            timeOffset = serverTime - localTime;
            logger.debug(`Updated time offset to ${timeOffset} seconds`);
        },
        getCurrentTime() {
            return Math.floor(Date.now() / 1000 + timeOffset);
        }
    };
}
/**
 * Validates event timestamp
 * @param message - Message to validate
 * @param validator - Time validator
 * @param logger - Logger instance
 * @returns {TimeValidationResult} Validation result
 */
export function validateEventTime(message, validator, logger) {
    try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') {
            return { valid: true }; // Not an event message
        }
        const event = message[1];
        const { created_at: timestamp } = event;
        if (typeof timestamp !== 'number') {
            return {
                valid: false,
                reason: 'Missing or invalid timestamp'
            };
        }
        return validator.validateTime(timestamp);
    }
    catch (error) {
        logger.error('Error validating event time:', error);
        return {
            valid: false,
            reason: 'Error validating timestamp'
        };
    }
}
/**
 * Creates a time synchronization manager
 * @param logger - Logger instance
 * @returns {TimeSyncManager} Time sync manager
 */
export function createTimeSyncManager(logger) {
    const validator = createTimeValidator(logger);
    let syncInterval = null;
    async function syncTime(wsUrl) {
        try {
            const ws = new WebSocket(wsUrl);
            await new Promise((resolve, reject) => {
                ws.onopen = () => {
                    // Send time request
                    ws.send(JSON.stringify({
                        type: 'TIME',
                        data: { client_time: Math.floor(Date.now() / 1000) }
                    }));
                };
                ws.onmessage = (event) => {
                    try {
                        const response = JSON.parse(event.data);
                        if (response.type === 'TIME') {
                            validator.updateTimeOffset(response.data.server_time);
                            resolve();
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                    ws.close();
                };
                ws.onerror = reject;
                // Timeout after 5 seconds
                setTimeout(() => reject(new Error('Time sync timeout')), 5000);
            });
        }
        catch (error) {
            logger.error('Time sync failed:', error);
        }
    }
    return {
        startSync(wsUrl) {
            // Initial sync
            syncTime(wsUrl);
            // Periodic sync every 15 minutes
            syncInterval = setInterval(() => syncTime(wsUrl), 900000);
        },
        stopSync() {
            if (syncInterval) {
                clearInterval(syncInterval);
                syncInterval = null;
            }
        },
        getCurrentTime() {
            return validator.getCurrentTime();
        },
        validateEvent(event) {
            return validateEventTime(event, validator, logger);
        }
    };
}
//# sourceMappingURL=nip-22.js.map