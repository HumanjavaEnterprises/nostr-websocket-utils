/**
 * @file Message type definitions
 * @module types/messages
 */

import { MessagePriority } from './priority.js';

/**
 * Message types that can be sent through the WebSocket connection
 * Following NIP-01 and other NIPs message types
 */
export const MESSAGE_TYPES = {
  EVENT: 'EVENT',    // NIP-01: Basic protocol flow events
  REQ: 'REQ',       // NIP-01: Request events
  CLOSE: 'CLOSE',   // NIP-01: Close subscription
  CLOSED: 'CLOSED', // NIP-01: Relay-initiated subscription close
  NOTICE: 'NOTICE', // NIP-01: Human-readable messages
  EOSE: 'EOSE',     // NIP-15: End of stored events notice
  OK: 'OK',         // NIP-20: Command result
  AUTH: 'AUTH',     // NIP-42: Authentication
  COUNT: 'COUNT',   // NIP-45: Event counts
  PING: 'PING',     // Internal heartbeat ping
  PONG: 'PONG',     // Internal heartbeat pong
  ERROR: 'error'    // Internal error type (lowercase to differentiate)
} as const;

export type MessageType = keyof typeof MESSAGE_TYPES;

/**
 * Base Nostr WebSocket message interface
 */
export interface NostrWSMessageBase {
  type: MessageType;
  data?: unknown;
  priority?: MessagePriority;
  queuedAt?: number;
  retryCount?: number;
}

/**
 * Nostr WebSocket message type
 * Array format: [<message_type>, ...data]
 */
export type NostrWSMessage = [MessageType, ...unknown[]];

/**
 * Queue item interface for message queue
 */
export interface QueueItem extends NostrWSMessageBase {
  /**
   * The original, verbatim wire tuple. This is what gets sent — the queue must
   * never destructure/rebuild the message, or valid >2-element NIP-01 tuples
   * (e.g. ["REQ", subId, filter]) are corrupted.
   */
  message: NostrWSMessage;
  priority: MessagePriority;
  queuedAt: number;
  retryCount: number;
}

/**
 * Nostr event message
 */
export interface NostrEvent {
  id: string;
  kind: number;
  content: string;
  tags: string[][];
  created_at?: number;
  pubkey?: string;
  sig?: string;
}

/**
 * Server-side Nostr WebSocket message
 * Extends the base NostrWSMessage tuple type with additional server-specific metadata
 */
export type NostrWSServerMessage = NostrWSMessage & {
  clientId?: string;
  timestamp?: number;
};

/**
 * Helper function to create server messages
 */
export function createServerMessage(type: MessageType, data: unknown[], clientId?: string): NostrWSServerMessage {
  const message = [type, ...data] as NostrWSServerMessage;
  message.clientId = clientId;
  message.timestamp = Date.now();
  return message;
}

/**
 * Structure of a Nostr WebSocket filter
 */
export interface NostrWSFilter {
  /** Array of event IDs */
  ids?: string[];
  /** Array of pubkeys */
  authors?: string[];
  /** Array of event kinds */
  kinds?: number[];
  /** Unix timestamp range */
  since?: number;
  until?: number;
  /** Maximum number of events to return */
  limit?: number;
  /**
   * NIP-01 tag filters use '#<single-letter>' keys, e.g. '#e', '#p', '#a'.
   * Each value is an array of tag values to match.
   */
  [key: `#${string}`]: string[] | undefined;
}

/**
 * Represents a subscription to a Nostr relay
 */
export interface NostrWSSubscription {
  /**
   * Unique identifier for the subscription
   */
  subscription_id: string;

  /**
   * Filters for the subscription
   */
  filters: Array<Record<string, unknown>>;

  /**
   * Active state of the subscription
   */
  active?: boolean;

  /**
   * Timestamp when the subscription was created
   */
  createdAt?: number;
}

/**
 * Result of validating a NostrWSMessage
 */
export interface NostrWSValidationResult {
  /**
   * Whether the message is valid
   */
  isValid: boolean;

  /**
   * Error message if validation failed
   */
  error?: string;
}

/**
 * Connection states for WebSocket client
 */
export enum ConnectionState {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECTING = 'RECONNECTING',
  FAILED = 'FAILED'
}
