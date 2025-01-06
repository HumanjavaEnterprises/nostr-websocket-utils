/**
 * @file NIP-16: Event Treatment
 * @module nips/nip-16
 * @see https://github.com/nostr-protocol/nips/blob/master/16.md
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
/**
 * Event treatment types
 */
export declare const EventTreatment: {
    readonly EPHEMERAL: "ephemeral";
    readonly REPLACEABLE: "replaceable";
    readonly PERSISTENT: "persistent";
};
export type EventTreatmentType = typeof EventTreatment[keyof typeof EventTreatment];
/**
 * Replaceable event kinds (10000-19999)
 */
export declare const REPLACEABLE_EVENT_KINDS: {
    METADATA: number;
    CONTACT_LIST: number;
    CHANNEL_METADATA: number;
    CHANNEL_MESSAGE: number;
    USER_STATUS: number;
    USER_PROFILE: number;
    RELAY_LIST: number;
    BOOKMARKS: number;
    MUTE_LIST: number;
    PIN_LIST: number;
    RELAY_METADATA: number;
    CLIENT_PREFERENCES: number;
    CUSTOM_START: number;
    CUSTOM_END: number;
};
/**
 * Ephemeral event kinds (20000-29999)
 */
export declare const EPHEMERAL_EVENT_KINDS: {
    TYPING_INDICATOR: number;
    ONLINE_STATUS: number;
    USER_PRESENCE: number;
    CUSTOM_START: number;
    CUSTOM_END: number;
};
/**
 * Determines event treatment type
 * @param eventKind - Event kind number
 * @returns {EventTreatmentType} Event treatment type
 */
export declare function getEventTreatment(eventKind: number): EventTreatmentType;
/**
 * Validates event treatment rules
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns {boolean} True if event follows treatment rules
 */
export declare function validateEventTreatment(message: NostrWSMessage, logger: Logger): boolean;
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
export declare function createEventStorageManager(logger: Logger): EventStorageManager;
//# sourceMappingURL=nip-16.d.ts.map