/**
 * @file NIP-33: Parameterized Replaceable Events
 * @module nips/nip-33
 * @see https://github.com/nostr-protocol/nips/blob/master/33.md
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
/**
 * Parameterized replaceable event kinds (30000-39999)
 */
export declare const PARAMETERIZED_REPLACEABLE_KINDS: {
    CATEGORIZED_BOOKMARK: number;
    CATEGORIZED_HIGHLIGHT: number;
    CATEGORIZED_PEOPLE_LIST: number;
    PROFILE_BADGES: number;
    BADGE_DEFINITION: number;
    CUSTOM_START: number;
    CUSTOM_END: number;
};
/**
 * Creates a parameterized replaceable event
 * @param kind - Event kind
 * @param content - Event content
 * @param identifier - Unique identifier for the parameter
 * @param additionalTags - Additional tags
 * @returns {NostrWSMessage} Parameterized replaceable event
 */
export declare function createParameterizedEvent(kind: number, content: string, identifier: string, additionalTags?: string[][]): NostrWSMessage;
/**
 * Validates a parameterized replaceable event
 * @param message - Message to validate
 * @param _logger - Logger instance
 * @returns {boolean} True if valid
 */
export declare function validateParameterizedEvent(message: NostrWSMessage, _logger: Logger): boolean;
/**
 * Parameterized event manager interface
 */
export interface ParameterizedEventManager {
    /**
     * Creates a new parameterized event
     * @param kind - Event kind
     * @param content - Event content
     * @param identifier - Parameter identifier
     * @param tags - Additional tags
     * @returns {NostrWSMessage} Created event
     */
    createEvent(kind: number, content: string, identifier: string, tags?: string[][]): NostrWSMessage;
    /**
     * Updates an existing parameterized event
     * @param kind - Event kind
     * @param identifier - Parameter identifier
     * @param content - New content
     * @returns {NostrWSMessage} Update event
     */
    updateEvent(kind: number, identifier: string, content: string): NostrWSMessage;
    /**
     * Subscribes to parameterized events
     * @param kinds - Event kinds to subscribe to
     * @param identifiers - Parameter identifiers
     * @returns {NostrWSMessage} Subscription message
     */
    subscribe(kinds: number[], identifiers: string[]): NostrWSMessage;
}
/**
 * Creates a parameterized event manager
 * @param _logger - Logger instance
 * @returns {ParameterizedEventManager} Event manager
 */
export declare function createParameterizedEventManager(_logger: Logger): ParameterizedEventManager;
/**
 * Event replacement handler interface
 */
export interface EventReplacementHandler {
    /**
     * Checks if an event should replace another
     * @param newEvent - New event
     * @param existingEvent - Existing event
     * @returns {boolean} True if should replace
     */
    shouldReplace(newEvent: Record<string, unknown>, existingEvent: Record<string, unknown>): boolean;
    /**
     * Gets replacement key for an event
     * @param event - Event to get key for
     * @returns {string} Replacement key
     */
    getReplacementKey(event: Record<string, unknown>): string;
}
/**
 * Creates an event replacement handler
 * @param _logger - Logger instance
 * @returns {EventReplacementHandler} Replacement handler
 */
export declare function createEventReplacementHandler(_logger: Logger): EventReplacementHandler;
//# sourceMappingURL=nip-33.d.ts.map