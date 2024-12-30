/**
 * @file Filter type definitions
 * @module types/filters
 */

import { NostrEventFilter } from './events';

/**
 * Subscription request filter
 */
export interface NostrSubscriptionFilter extends NostrEventFilter {
  subscriptionId?: string;
  limit?: number;
}

/**
 * Filter validation result
 */
export interface NostrFilterValidationResult {
  valid: boolean;
  error?: string;
}
