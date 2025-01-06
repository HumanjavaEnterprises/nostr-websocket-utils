/**
 * @file NIP-15: End of Stored Events Notice
 * @module nips/nip-15
 * @see https://github.com/nostr-protocol/nips/blob/master/15.md
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
/**
 * Creates an EOSE (End of Stored Events) message
 * @param subscriptionId - Subscription ID
 * @returns {NostrWSMessage} EOSE message
 */
export declare function createEOSEMessage(subscriptionId: string): NostrWSMessage;
/**
 * Subscription state manager interface
 */
export interface SubscriptionStateManager {
    /**
     * Registers a new subscription
     * @param subscriptionId - Subscription ID
     * @param filter - Subscription filter
     */
    registerSubscription(subscriptionId: string, filter: Record<string, unknown>): void;
    /**
     * Marks a subscription as complete (EOSE sent)
     * @param subscriptionId - Subscription ID
     */
    markComplete(subscriptionId: string): void;
    /**
     * Checks if a subscription is complete
     * @param subscriptionId - Subscription ID
     * @returns {boolean} True if EOSE has been sent
     */
    isComplete(subscriptionId: string): boolean;
    /**
     * Gets subscription filter
     * @param subscriptionId - Subscription ID
     * @returns {Record<string, unknown> | undefined} Subscription filter
     */
    getFilter(subscriptionId: string): Record<string, unknown> | undefined;
    /**
     * Removes a subscription
     * @param subscriptionId - Subscription ID
     */
    removeSubscription(subscriptionId: string): void;
}
/**
 * Creates a subscription state manager
 * @param logger - Logger instance
 * @returns {SubscriptionStateManager} Subscription state manager
 */
export declare function createSubscriptionStateManager(logger: Logger): SubscriptionStateManager;
/**
 * Pagination handler interface
 */
export interface PaginationHandler {
    /**
     * Gets next page of events
     * @param subscriptionId - Subscription ID
     * @param pageSize - Number of events per page
     * @returns {Promise<NostrWSMessage[]>} Next page of events
     */
    getNextPage(subscriptionId: string, pageSize: number): Promise<NostrWSMessage[]>;
    /**
     * Checks if more events are available
     * @param subscriptionId - Subscription ID
     * @returns {boolean} True if more events exist
     */
    hasMoreEvents(subscriptionId: string): boolean;
    /**
     * Updates pagination state with new events
     * @param subscriptionId - Subscription ID
     * @param events - New events
     */
    updateState(subscriptionId: string, events: NostrWSMessage[]): void;
}
/**
 * Creates a pagination handler
 * @param stateManager - Subscription state manager
 * @param logger - Logger instance
 * @returns {PaginationHandler} Pagination handler
 */
export declare function createPaginationHandler(stateManager: SubscriptionStateManager, logger: Logger): PaginationHandler;
//# sourceMappingURL=nip-15.d.ts.map