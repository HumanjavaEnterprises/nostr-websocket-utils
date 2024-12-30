/**
 * @file NIP-16: Event Treatment
 * @module nips/nip-16
 * @see https://github.com/nostr-protocol/nips/blob/master/16.md
 */

import type { NostrWSMessage } from '../types/messages';
import type { Logger } from '../types/logger';

/**
 * Event treatment types
 */
export const EventTreatment = {
  EPHEMERAL: 'ephemeral',
  REPLACEABLE: 'replaceable',
  PERSISTENT: 'persistent'
} as const;

export type EventTreatmentType = typeof EventTreatment[keyof typeof EventTreatment];

/**
 * Replaceable event kinds (10000-19999)
 */
export const REPLACEABLE_EVENT_KINDS = {
  METADATA: 0,
  CONTACT_LIST: 3,
  CHANNEL_METADATA: 41,
  CHANNEL_MESSAGE: 42,
  USER_STATUS: 10000,
  USER_PROFILE: 10001,
  RELAY_LIST: 10002,
  BOOKMARKS: 10003,
  MUTE_LIST: 10004,
  PIN_LIST: 10005,
  RELAY_METADATA: 10010,
  CLIENT_PREFERENCES: 10015,
  CUSTOM_START: 11000,
  CUSTOM_END: 19999
};

/**
 * Ephemeral event kinds (20000-29999)
 */
export const EPHEMERAL_EVENT_KINDS = {
  TYPING_INDICATOR: 20001,
  ONLINE_STATUS: 20002,
  USER_PRESENCE: 20003,
  CUSTOM_START: 21000,
  CUSTOM_END: 29999
};

/**
 * Determines event treatment type
 * @param eventKind - Event kind number
 * @returns {EventTreatmentType} Event treatment type
 */
export function getEventTreatment(eventKind: number): EventTreatmentType {
  if (eventKind >= 20000 && eventKind < 30000) {
    return EventTreatment.EPHEMERAL;
  }
  if (eventKind >= 10000 && eventKind < 20000 || [0, 3, 41, 42].includes(eventKind)) {
    return EventTreatment.REPLACEABLE;
  }
  return EventTreatment.PERSISTENT;
}

/**
 * Validates event treatment rules
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns {boolean} True if event follows treatment rules
 */
export function validateEventTreatment(
  message: NostrWSMessage,
  logger: Logger
): boolean {
  try {
    if (message.type !== 'EVENT' || !message.data) {
      return true; // Not an event message
    }

    const event = message.data as Record<string, unknown>;
    const kind = event.kind as number;
    const treatment = getEventTreatment(kind);

    // Validate based on treatment type
    switch (treatment) {
      case EventTreatment.EPHEMERAL:
        // Ephemeral events shouldn't have large content
        if (typeof event.content === 'string' && event.content.length > 1000) {
          logger.debug('Ephemeral event content too large');
          return false;
        }
        break;

      case EventTreatment.REPLACEABLE:
        // Replaceable events must have proper 'd' tag for uniqueness
        if (Array.isArray(event.tags)) {
          const dTags = event.tags.filter(tag => 
            Array.isArray(tag) && tag[0] === 'd'
          );
          if (dTags.length > 1) {
            logger.debug('Multiple d tags in replaceable event');
            return false;
          }
        }
        break;
    }

    return true;
  } catch (error) {
    logger.error('Error validating event treatment:', error);
    return false;
  }
}

/**
 * Storage management interface for different event types
 */
export interface EventStorageManager {
  /**
   * Determines if an event should be stored
   * @param event - Event to check
   * @returns {boolean} True if event should be stored
   */
  shouldStore(event: Record<string, unknown>): boolean;

  /**
   * Gets storage duration for an event
   * @param event - Event to check
   * @returns {number} Storage duration in seconds (0 for permanent)
   */
  getStorageDuration(event: Record<string, unknown>): number;

  /**
   * Checks if an event should replace another
   * @param newEvent - New event
   * @param existingEvent - Existing event
   * @returns {boolean} True if new event should replace existing
   */
  shouldReplace(newEvent: Record<string, unknown>, existingEvent: Record<string, unknown>): boolean;
}

/**
 * Creates default event storage manager
 * @param logger - Logger instance
 * @returns {EventStorageManager} Storage manager
 */
export function createEventStorageManager(logger: Logger): EventStorageManager {
  return {
    shouldStore(event: Record<string, unknown>): boolean {
      const kind = event.kind as number;
      const treatment = getEventTreatment(kind);
      
      // Don't store ephemeral events by default
      if (treatment === EventTreatment.EPHEMERAL) {
        return false;
      }
      
      return true;
    },

    getStorageDuration(event: Record<string, unknown>): number {
      const kind = event.kind as number;
      const treatment = getEventTreatment(kind);
      
      switch (treatment) {
        case EventTreatment.EPHEMERAL:
          return 300; // 5 minutes
        case EventTreatment.REPLACEABLE:
          return 0; // Permanent until replaced
        default:
          return 0; // Permanent
      }
    },

    shouldReplace(newEvent: Record<string, unknown>, existingEvent: Record<string, unknown>): boolean {
      try {
        const kind = newEvent.kind as number;
        if (kind !== existingEvent.kind) return false;
        
        const treatment = getEventTreatment(kind);
        if (treatment !== EventTreatment.REPLACEABLE) return false;

        // Check 'd' tag for parameterized replaceable events
        if (Array.isArray(newEvent.tags) && Array.isArray(existingEvent.tags)) {
          const newDTag = newEvent.tags.find(tag => 
            Array.isArray(tag) && tag[0] === 'd'
          )?.[1];
          const existingDTag = existingEvent.tags.find(tag => 
            Array.isArray(tag) && tag[0] === 'd'
          )?.[1];
          
          if (newDTag !== existingDTag) return false;
        }

        // Replace if new event is newer
        return (newEvent.created_at as number) > (existingEvent.created_at as number);
      } catch (error) {
        logger.error('Error checking event replacement:', error);
        return false;
      }
    }
  };
}
