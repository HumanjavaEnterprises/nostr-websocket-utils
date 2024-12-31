/**
 * @file NIP-15: End of Stored Events Notice
 * @module nips/nip-15
 * @see https://github.com/nostr-protocol/nips/blob/master/15.md
 */

import type { NostrWSMessage } from '../types/messages';
import type { Logger } from '../types/logger';

/**
 * Creates an EOSE (End of Stored Events) message
 * @param subscriptionId - Subscription ID
 * @returns {NostrWSMessage} EOSE message
 */
export function createEOSEMessage(subscriptionId: string): NostrWSMessage {
  return ['EOSE', subscriptionId];
}

/**
 * Subscription state manager interface
 */
export interface SubscriptionStateManager {
  /**
   * Registers a new subscription
   * @param subscriptionId - Subscription ID
   * @param filter - Subscription filter
   */
  registerSubscription(
    subscriptionId: string,
    filter: Record<string, unknown>
  ): void;

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
export function createSubscriptionStateManager(
  logger: Logger
): SubscriptionStateManager {
  interface SubscriptionState {
    filter: Record<string, unknown>;
    complete: boolean;
    timestamp: number;
  }

  const subscriptions = new Map<string, SubscriptionState>();

  return {
    registerSubscription(
      subscriptionId: string,
      filter: Record<string, unknown>
    ): void {
      subscriptions.set(subscriptionId, {
        filter,
        complete: false,
        timestamp: Date.now()
      });
    },

    markComplete(subscriptionId: string): void {
      const state = subscriptions.get(subscriptionId);
      if (state) {
        state.complete = true;
      } else {
        logger.debug(`Attempting to mark unknown subscription ${subscriptionId} as complete`);
      }
    },

    isComplete(subscriptionId: string): boolean {
      return subscriptions.get(subscriptionId)?.complete || false;
    },

    getFilter(subscriptionId: string): Record<string, unknown> | undefined {
      return subscriptions.get(subscriptionId)?.filter;
    },

    removeSubscription(subscriptionId: string): void {
      subscriptions.delete(subscriptionId);
    }
  };
}

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
  getNextPage(
    subscriptionId: string,
    pageSize: number
  ): Promise<NostrWSMessage[]>;

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
export function createPaginationHandler(
  stateManager: SubscriptionStateManager,
  logger: Logger
): PaginationHandler {
  interface PaginationState {
    events: NostrWSMessage[];
    currentIndex: number;
    hasMore: boolean;
  }

  const paginationStates = new Map<string, PaginationState>();

  return {
    async getNextPage(
      subscriptionId: string,
      pageSize: number
    ): Promise<NostrWSMessage[]> {
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

    hasMoreEvents(subscriptionId: string): boolean {
      return paginationStates.get(subscriptionId)?.hasMore || false;
    },

    updateState(subscriptionId: string, events: NostrWSMessage[]): void {
      const existing = paginationStates.get(subscriptionId);
      if (existing) {
        existing.events.push(...events);
        existing.hasMore = true;
      } else {
        paginationStates.set(subscriptionId, {
          events,
          currentIndex: 0,
          hasMore: true
        });
      }
    }
  };
}
