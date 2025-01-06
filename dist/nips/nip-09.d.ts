/**
 * @file NIP-09: Event Deletion
 * @module nips/nip-09
 * @see https://github.com/nostr-protocol/nips/blob/master/09.md
 */
import type { NostrEvent, NostrSubscriptionEvent } from '../types/events.js';
/**
 * Represents the result of a deletion operation
 * @interface DeletionResult
 * @property {boolean} success - Whether the deletion operation was successful
 * @property {string} [error] - Error message if the operation failed
 * @property {string[]} [deletedIds] - Array of successfully deleted event IDs
 */
interface DeletionResult {
    success: boolean;
    error?: string;
    deletedIds?: string[];
}
/**
 * Event deletion kind
 */
export declare const EVENT_DELETION_KIND = 5;
/**
 * Creates a deletion event
 */
export declare function createDeletionEvent(eventIds: string[], reason?: string): Omit<NostrEvent, 'id' | 'sig'>;
/**
 * Validates a deletion event
 */
export declare function validateDeletionEvent(event: NostrEvent, _logger: any): Promise<boolean>;
/**
 * Processes a deletion event
 */
export declare function processDeletionEvent(event: NostrEvent, _logger: any, deleteEvent: (id: string) => Promise<boolean>): Promise<DeletionResult>;
/**
 * Event deletion manager interface
 */
export interface EventDeletionManager {
    /**
     * Processes a deletion event
     * @param message - Deletion message
     * @returns {Promise<string[]>} Deleted event IDs
     */
    processDeletion(message: NostrEvent): Promise<string[]>;
    /**
     * Checks if an event has been deleted
     * @param eventId - Event ID to check
     * @returns {boolean} True if event is deleted
     */
    isDeleted(eventId: string): boolean;
    /**
     * Gets deletion reason for an event
     * @param eventId - Event ID
     * @returns {string | undefined} Deletion reason if available
     */
    getDeletionReason(eventId: string): string | undefined;
    /**
     * Gets all deleted events
     * @returns {Map<string, string>} Map of event IDs to deletion reasons
     */
    getDeletedEvents(): Map<string, string>;
}
/**
 * Creates an event deletion manager
 * @param _logger - Logger instance
 * @returns {EventDeletionManager} Deletion manager
 */
export declare function createEventDeletionManager(_logger: any): EventDeletionManager;
/**
 * Event deletion subscription manager interface
 */
export interface DeletionSubscriptionManager {
    /**
     * Creates a subscription for deletion events
     * @param eventIds - Event IDs to monitor
     * @returns {NostrSubscriptionEvent} Subscription message
     */
    subscribeToDeletions(eventIds: string[]): NostrSubscriptionEvent;
    /**
     * Creates a subscription for all deletions by a user
     * @param pubkey - Public key of user
     * @returns {NostrSubscriptionEvent} Subscription message
     */
    subscribeToUserDeletions(pubkey: string): NostrSubscriptionEvent;
}
/**
 * Creates a deletion subscription manager
 * @param _logger - Logger instance
 * @returns {DeletionSubscriptionManager} Subscription manager
 */
export declare function createDeletionSubscriptionManager(_logger: any): DeletionSubscriptionManager;
export {};
//# sourceMappingURL=nip-09.d.ts.map