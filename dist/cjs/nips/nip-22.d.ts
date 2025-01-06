/**
 * @file NIP-22: Event Created At Limits
 * @module nips/nip-22
 * @see https://github.com/nostr-protocol/nips/blob/master/22.md
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
/**
 * Default time limits in seconds
 */
export declare const DEFAULT_TIME_LIMITS: {
    FUTURE_LIMIT: number;
    PAST_LIMIT: number;
};
/**
 * Time validation result
 */
export interface TimeValidationResult {
    valid: boolean;
    reason?: string;
}
/**
 * Time validator interface
 */
export interface TimeValidator {
    /**
     * Validates event timestamp
     * @param timestamp - Event timestamp
     * @returns {TimeValidationResult} Validation result
     */
    validateTime(timestamp: number): TimeValidationResult;
    /**
     * Updates server time offset
     * @param serverTime - Server timestamp
     */
    updateTimeOffset(serverTime: number): void;
    /**
     * Gets current adjusted timestamp
     * @returns {number} Adjusted timestamp
     */
    getCurrentTime(): number;
}
/**
 * Creates a time validator
 * @param logger - Logger instance
 * @param futureLimitSeconds - Future time limit in seconds
 * @param pastLimitSeconds - Past time limit in seconds
 * @returns {TimeValidator} Time validator
 */
export declare function createTimeValidator(logger: Logger, futureLimitSeconds?: number, pastLimitSeconds?: number): TimeValidator;
/**
 * Validates event timestamp
 * @param message - Message to validate
 * @param validator - Time validator
 * @param logger - Logger instance
 * @returns {TimeValidationResult} Validation result
 */
export declare function validateEventTime(message: NostrWSMessage, validator: TimeValidator, logger: Logger): TimeValidationResult;
/**
 * Time synchronization manager interface
 */
export interface TimeSyncManager {
    /**
     * Starts time synchronization
     * @param wsUrl - WebSocket URL for time sync
     */
    startSync(wsUrl: string): void;
    /**
     * Stops time synchronization
     */
    stopSync(): void;
    /**
     * Gets current synchronized time
     * @returns {number} Current timestamp
     */
    getCurrentTime(): number;
    /**
     * Validates event timing
     * @param event - Event to validate
     * @returns {TimeValidationResult} Validation result
     */
    validateEvent(event: NostrWSMessage): TimeValidationResult;
}
/**
 * Creates a time synchronization manager
 * @param logger - Logger instance
 * @returns {TimeSyncManager} Time sync manager
 */
export declare function createTimeSyncManager(logger: Logger): TimeSyncManager;
//# sourceMappingURL=nip-22.d.ts.map