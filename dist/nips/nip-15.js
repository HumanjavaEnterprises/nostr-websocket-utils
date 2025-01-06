/**
 * @file NIP-15: End of Stored Events Notice
 * @module nips/nip-15
 * @see https://github.com/nostr-protocol/nips/blob/master/15.md
 */
/**
 * Creates an EOSE (End of Stored Events) message
 * @param subscriptionId - Subscription ID
 * @returns {NostrWSMessage} EOSE message
 */
export function createEOSEMessage(subscriptionId) {
    return ['EOSE', subscriptionId];
}
/**
 * Creates a subscription state manager
 * @param logger - Logger instance
 * @returns {SubscriptionStateManager} Subscription state manager
 */
export function createSubscriptionStateManager(logger) {
    const subscriptions = new Map();
    return {
        registerSubscription(subscriptionId, filter) {
            subscriptions.set(subscriptionId, {
                filter,
                complete: false,
                timestamp: Date.now()
            });
        },
        markComplete(subscriptionId) {
            const state = subscriptions.get(subscriptionId);
            if (state) {
                state.complete = true;
            }
            else {
                logger.debug(`Attempting to mark unknown subscription ${subscriptionId} as complete`);
            }
        },
        isComplete(subscriptionId) {
            return subscriptions.get(subscriptionId)?.complete || false;
        },
        getFilter(subscriptionId) {
            return subscriptions.get(subscriptionId)?.filter;
        },
        removeSubscription(subscriptionId) {
            subscriptions.delete(subscriptionId);
        }
    };
}
/**
 * Creates a pagination handler
 * @param stateManager - Subscription state manager
 * @param logger - Logger instance
 * @returns {PaginationHandler} Pagination handler
 */
export function createPaginationHandler(stateManager, logger) {
    const paginationStates = new Map();
    return {
        async getNextPage(subscriptionId, pageSize) {
            const state = paginationStates.get(subscriptionId);
            if (!state) {
                logger.debug(`No pagination state for subscription ${subscriptionId}`);
                return [];
            }
            const start = state.currentIndex;
            const end = Math.min(start + pageSize, state.events.length);
            state.currentIndex = end;
            state.hasMore = end < state.events.length;
            // If this is the last page, send EOSE
            if (!state.hasMore && !stateManager.isComplete(subscriptionId)) {
                stateManager.markComplete(subscriptionId);
                return [
                    ...state.events.slice(start, end),
                    createEOSEMessage(subscriptionId)
                ];
            }
            return state.events.slice(start, end);
        },
        hasMoreEvents(subscriptionId) {
            return paginationStates.get(subscriptionId)?.hasMore || false;
        },
        updateState(subscriptionId, events) {
            const existing = paginationStates.get(subscriptionId);
            if (existing) {
                existing.events.push(...events);
                existing.hasMore = true;
            }
            else {
                paginationStates.set(subscriptionId, {
                    events,
                    currentIndex: 0,
                    hasMore: true
                });
            }
        }
    };
}
//# sourceMappingURL=nip-15.js.map