/**
 * @file Nostr event type definitions
 * @module types/events
 */

/**
 * Base Nostr event interface following NIP-01 specification
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export interface NostrEvent {
  /** Event ID in hex format */
  id: string;
  
  /** Public key of the event creator in hex format */
  pubkey: string;
  
  /** Unix timestamp in seconds */
  created_at: number;
  
  /** Event kind number */
  kind: number;
  
  /** Array of tags */
  tags: string[][];
  
  /** Event content */
  content: string;
  
  /** Signature of the event data in hex format */
  sig: string;
}

/**
 * Signed Nostr event with id and signature
 * @extends NostrEvent
 */
export interface SignedNostrEvent extends NostrEvent {
  /** Event ID in hex format */
  id: string;
  /** Signature of the event data in hex format */
  sig: string;
}

/**
 * Event validation result
 */
export interface NostrEventValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Event subscription filter
 */
export interface NostrEventFilter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  since?: number;
  until?: number;
  limit?: number;
  [key: string]: unknown;
}

/**
 * Nostr subscription event interface
 * Used for creating subscription messages to relays
 */
export interface NostrSubscriptionEvent {
  /** Subscription ID */
  subscriptionId: string;
  /** Array of filters */
  filters: NostrEventFilter[];
}

/**
 * Event handler interface for WebSocket client
 */
export interface NostrWSEventHandlers {
  onMessage?: (message: string) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onReconnect?: () => void;
}
