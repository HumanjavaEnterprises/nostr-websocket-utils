/**
 * @file NIP-22: Event Created At Limits
 * @module nips/nip-22
 * @see https://github.com/nostr-protocol/nips/blob/master/22.md
 */

import type { NostrWSMessage } from '../types/messages';
import type { Logger } from '../types/logger';

/**
 * Default time limits in seconds
 */
export const DEFAULT_TIME_LIMITS = {
  FUTURE_LIMIT: 900, // 15 minutes
  PAST_LIMIT: 31536000 // 1 year
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
export function createTimeValidator(
  logger: Logger,
  futureLimitSeconds: number = DEFAULT_TIME_LIMITS.FUTURE_LIMIT,
  pastLimitSeconds: number = DEFAULT_TIME_LIMITS.PAST_LIMIT
): TimeValidator {
  let timeOffset = 0; // Offset between local and server time

  return {
    validateTime(timestamp: number): TimeValidationResult {
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

    updateTimeOffset(serverTime: number): void {
      const localTime = Date.now() / 1000;
      timeOffset = serverTime - localTime;
      logger.debug(`Updated time offset to ${timeOffset} seconds`);
    },

    getCurrentTime(): number {
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
export function validateEventTime(
  message: NostrWSMessage,
  validator: TimeValidator,
  logger: Logger
): TimeValidationResult {
  try {
    if (message.type !== 'EVENT' || !message.data) {
      return { valid: true }; // Not an event message
    }

    const event = message.data as Record<string, unknown>;
    const timestamp = event.created_at as number;

    if (typeof timestamp !== 'number') {
      return {
        valid: false,
        reason: 'Missing or invalid timestamp'
      };
    }

    return validator.validateTime(timestamp);
  } catch (error) {
    logger.error('Error validating event time:', error);
    return {
      valid: false,
      reason: 'Error validating timestamp'
    };
  }
}

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
export function createTimeSyncManager(logger: Logger): TimeSyncManager {
  const validator = createTimeValidator(logger);
  let syncInterval: NodeJS.Timeout | null = null;

  async function syncTime(wsUrl: string): Promise<void> {
    try {
      const ws = new WebSocket(wsUrl);
      
      await new Promise<void>((resolve, reject) => {
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
          } catch (error) {
            reject(error);
          }
          ws.close();
        };

        ws.onerror = reject;
        
        // Timeout after 5 seconds
        setTimeout(() => reject(new Error('Time sync timeout')), 5000);
      });
    } catch (error) {
      logger.error('Time sync failed:', error);
    }
  }

  return {
    startSync(wsUrl: string): void {
      // Initial sync
      syncTime(wsUrl);
      
      // Periodic sync every 15 minutes
      syncInterval = setInterval(() => syncTime(wsUrl), 900000);
    },

    stopSync(): void {
      if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
      }
    },

    getCurrentTime(): number {
      return validator.getCurrentTime();
    },

    validateEvent(event: NostrWSMessage): TimeValidationResult {
      return validateEventTime(event, validator, logger);
    }
  };
}
