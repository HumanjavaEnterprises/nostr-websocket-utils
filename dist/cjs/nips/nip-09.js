"use strict";
/**
 * @file NIP-09: Event Deletion
 * @module nips/nip-09
 * @see https://github.com/nostr-protocol/nips/blob/master/09.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_DELETION_KIND = void 0;
exports.createDeletionEvent = createDeletionEvent;
exports.validateDeletionEvent = validateDeletionEvent;
exports.processDeletionEvent = processDeletionEvent;
exports.createEventDeletionManager = createEventDeletionManager;
exports.createDeletionSubscriptionManager = createDeletionSubscriptionManager;
/**
 * Event deletion kind
 */
exports.EVENT_DELETION_KIND = 5;
/**
 * Creates a deletion event
 */
function createDeletionEvent(eventIds, reason) {
    return {
        kind: exports.EVENT_DELETION_KIND,
        created_at: Math.floor(Date.now() / 1000),
        tags: eventIds.map(id => ['e', id]),
        content: reason || '',
        pubkey: '', // To be filled by the caller
    };
}
/**
 * Validates a deletion event
 */
async function validateDeletionEvent(event, _logger) {
    try {
        // Must be kind 5
        if (event.kind !== exports.EVENT_DELETION_KIND) {
            return false;
        }
        // Must have at least one e tag
        const eventIds = event.tags
            .filter((tag) => Array.isArray(tag) && tag[0] === 'e' && typeof tag[1] === 'string')
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
    }
    catch (_error) {
        return false;
    }
}
/**
 * Processes a deletion event
 */
async function processDeletionEvent(event, _logger, deleteEvent) {
    try {
        if (!validateDeletionEvent(event, _logger)) {
            return {
                success: false,
                error: 'Invalid deletion event'
            };
        }
        const eventIds = event.tags
            .filter((tag) => tag[0] === 'e')
            .map(tag => tag[1]);
        const deletedIds = [];
        const failedIds = [];
        for (const eventId of eventIds) {
            try {
                const success = await deleteEvent(eventId);
                if (success) {
                    deletedIds.push(eventId);
                }
                else {
                    failedIds.push(eventId);
                }
            }
            catch (_error) {
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
    }
    catch (_error) {
        return {
            success: false,
            error: 'Unknown error'
        };
    }
}
/**
 * Creates an event deletion manager
 * @param _logger - Logger instance
 * @returns {EventDeletionManager} Deletion manager
 */
function createEventDeletionManager(_logger) {
    // Map of deleted event IDs to deletion reasons
    const deletedEvents = new Map();
    // Map of deleted event IDs to deletion event IDs
    const deletionEvents = new Map();
    return {
        async processDeletion(message) {
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
            }
            catch (_error) {
                return [];
            }
        },
        isDeleted(eventId) {
            return deletedEvents.has(eventId);
        },
        getDeletionReason(eventId) {
            return deletedEvents.get(eventId);
        },
        getDeletedEvents() {
            return new Map(deletedEvents);
        }
    };
}
/**
 * Creates a deletion subscription manager
 * @param _logger - Logger instance
 * @returns {DeletionSubscriptionManager} Subscription manager
 */
function createDeletionSubscriptionManager(_logger) {
    return {
        subscribeToDeletions(eventIds) {
            return {
                subscriptionId: `deletion_${eventIds.join('_')}`,
                filters: [{
                        kinds: [exports.EVENT_DELETION_KIND],
                        '#e': eventIds
                    }]
            };
        },
        subscribeToUserDeletions(pubkey) {
            return {
                subscriptionId: `user_deletion_${pubkey}`,
                filters: [{
                        kinds: [exports.EVENT_DELETION_KIND],
                        authors: [pubkey]
                    }]
            };
        }
    };
}
//# sourceMappingURL=nip-09.js.map