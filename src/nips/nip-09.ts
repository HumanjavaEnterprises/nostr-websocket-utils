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
export const EVENT_DELETION_KIND = 5;

/**
 * Creates a deletion event
 */
export function createDeletionEvent(
  eventIds: string[],
  reason?: string
): Omit<NostrEvent, 'id' | 'sig'> {
  return {
    kind: EVENT_DELETION_KIND,
    created_at: Math.floor(Date.now() / 1000),
    tags: eventIds.map(id => ['e', id]),
    content: reason || '',
    pubkey: '', // To be filled by the caller
  };
}

/**
 * Validates a deletion event
 */
export async function validateDeletionEvent(
  event: NostrEvent,
  _logger: any
): Promise<boolean> {
  try {
    // Must be kind 5
    if (event.kind !== EVENT_DELETION_KIND) {
      return false;
    }

    // Must have at least one e tag
    const eventIds = event.tags
      .filter((tag: string[]): tag is [string, string] => 
        Array.isArray(tag) && tag[0] === 'e' && typeof tag[1] === 'string')
      .map(tag => tag[1]);

    if (eventIds.length === 0) {
      return false;
    }

    // Validate each event ID format
    const validHexString = /^[0-9a-f]{64}$/;
    const invalidIds = eventIds.filter(id => !validHexString.test(id));
    
    if (invalidIds.length > 0) {
      return false;
    }

    return true;
  } catch (error: unknown) {
    return false;
  }
}

/**
 * Processes a deletion event
 */
export async function processDeletionEvent(
  event: NostrEvent,
  _logger: any,
  deleteEvent: (id: string) => Promise<boolean>
): Promise<DeletionResult> {
  try {
    if (!validateDeletionEvent(event, _logger)) {
      return {
        success: false,
        error: 'Invalid deletion event'
      };
    }

    const eventIds = event.tags
      .filter((tag): tag is [string, string] => tag[0] === 'e')
      .map(tag => tag[1]);

    const deletedIds: string[] = [];
    const failedIds: string[] = [];

    for (const eventId of eventIds) {
      try {
        const success = await deleteEvent(eventId);
        if (success) {
          deletedIds.push(eventId);
        } else {
          failedIds.push(eventId);
        }
      } catch (error: unknown) {
        failedIds.push(eventId);
      }
    }

    if (failedIds.length > 0) {
      return {
        success: false,
        error: `Failed to delete events: ${failedIds.join(', ')}`,
        deletedIds
      };
    }

    return {
      success: true,
      deletedIds
    };

  } catch (error: unknown) {
    return {
      success: false,
      error: 'Unknown error'
    };
  }
}

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
export function createEventDeletionManager(
  _logger: any
): EventDeletionManager {
  // Map of deleted event IDs to deletion reasons
  const deletedEvents = new Map<string, string>();

  // Map of deleted event IDs to deletion event IDs
  const deletionEvents = new Map<string, string>();

  return {
    async processDeletion(message: NostrEvent): Promise<string[]> {
      try {
        if (!validateDeletionEvent(message, _logger)) {
          throw new Error('Invalid deletion event');
        }

        const eventIds = message.tags
          .filter(tag => tag[0] === 'e')
          .map(tag => tag[1]);

        const { content: reason, id: deletionId } = message;

        // Process each event ID
        eventIds.forEach(eventId => {
          // Only delete if not already deleted or if this deletion is newer
          const existingDeletionId = deletionEvents.get(eventId);
          if (!existingDeletionId || deletionId > existingDeletionId) {
            deletedEvents.set(eventId, reason);
            deletionEvents.set(eventId, deletionId);
          }
        });

        return eventIds;
      } catch (error) {
        return [];
      }
    },

    isDeleted(eventId: string): boolean {
      return deletedEvents.has(eventId);
    },

    getDeletionReason(eventId: string): string | undefined {
      return deletedEvents.get(eventId);
    },

    getDeletedEvents(): Map<string, string> {
      return new Map(deletedEvents);
    }
  };
}

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
export function createDeletionSubscriptionManager(
  _logger: any
): DeletionSubscriptionManager {
  return {
    subscribeToDeletions(eventIds: string[]): NostrSubscriptionEvent {
      return {
        subscriptionId: `deletion_${eventIds.join('_')}`,
        filters: [{
          kinds: [EVENT_DELETION_KIND],
          '#e': eventIds
        }]
      };
    },

    subscribeToUserDeletions(pubkey: string): NostrSubscriptionEvent {
      return {
        subscriptionId: `user_deletion_${pubkey}`,
        filters: [{
          kinds: [EVENT_DELETION_KIND],
          authors: [pubkey]
        }]
      };
    }
  };
}
