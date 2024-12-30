/**
 * @file Message type definitions for WebSocket communication
 * @module types/messages
 */

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

/**
 * Type of message that can be sent through the WebSocket connection
 * Following NIP-01 and other NIPs message types
 */
export type MessageType = 
  | 'EVENT'    // NIP-01: Basic protocol flow events
  | 'REQ'      // NIP-01: Request events
  | 'CLOSE'    // NIP-01: Close subscription
  | 'NOTICE'   // NIP-01: Human-readable messages
  | 'EOSE'     // NIP-15: End of stored events notice
  | 'OK'       // NIP-20: Command result
  | 'AUTH'     // NIP-42: Authentication
  | 'COUNT'    // NIP-45: Event counts
  | 'PING'     // Internal heartbeat ping
  | 'PONG'     // Internal heartbeat pong
  | 'error';   // Internal error type (lowercase to differentiate)

/**
 * Message priority levels for queue management
 */
export enum MessagePriority {
  HIGH = 0,    // Critical messages (AUTH, etc.)
  MEDIUM = 1,  // Normal messages (EVENT, REQ)
  LOW = 2      // Non-critical messages (PING)
}

/**
 * Structure of messages sent through the WebSocket connection
 */
export interface NostrWSMessage {
  /**
   * Type of the message following NIP specifications
   */
  type: MessageType;
  
  /**
   * Message data payload
   */
  data?: unknown;

  /**
   * Message priority for queue management
   */
  priority?: MessagePriority;

  /**
   * Timestamp when the message was queued
   */
  queuedAt?: number;

  /**
   * Number of retry attempts for this message
   */
  retryCount?: number;
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
 * Message types as defined in NIP-01 and other NIPs
 */
export const MESSAGE_TYPES = {
  EVENT: 'EVENT',
  REQ: 'REQ',
  CLOSE: 'CLOSE',
  NOTICE: 'NOTICE',
  EOSE: 'EOSE',
  OK: 'OK',
  AUTH: 'AUTH',
  COUNT: 'COUNT',
  PING: 'PING',
  PONG: 'PONG',
  ERROR: 'error'
} as const;
