/**
 * @file Core type definitions
 * @module types
 */

import type { WebSocket } from 'ws';
import type { Logger } from './logger';
import type { NostrWSMessage, NostrEvent as MessageNostrEvent } from './messages';

// Re-export specific types to avoid ambiguity
export { NostrWSMessage } from './messages';
export { QueueItem } from './messages';
export * from './filters';
export * from './relays';
export * from './logger';
export * from './priority';

// Export the NostrEvent from messages.ts as our canonical version
export type NostrEvent = MessageNostrEvent;

/**
 * Extended WebSocket interface with client ID
 */
export interface ExtendedWebSocket extends WebSocket {
  clientId?: string;
  isAlive?: boolean;
  subscriptions?: Set<string>;
  lastPing?: number;
  reconnectAttempts?: number;
  messageQueue?: NostrWSMessage[];
}

/**
 * WebSocket connection states
 */
export enum ConnectionState {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECTING = 'RECONNECTING',
  FAILED = 'FAILED'
}

/**
 * Retry configuration options
 */
export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

/**
 * Queue configuration options
 */
export interface QueueConfig {
  maxSize: number;
  maxRetries: number;
  retryDelay: number;
  staleTimeout: number;
}

/**
 * Heartbeat configuration options
 */
export interface HeartbeatConfig {
  interval: number;
  timeout: number;
  maxMissed: number;
}

/**
 * WebSocket client options
 */
export interface NostrWSOptions {
  WebSocketImpl?: typeof WebSocket;
  connectionTimeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  onMessage?: (message: string) => void;
  onError?: (error: Error) => void;
  retry?: Partial<RetryConfig>;
  queue?: Partial<QueueConfig>;
  heartbeat?: Partial<HeartbeatConfig>;
  autoReconnect?: boolean;
  bufferMessages?: boolean;
  cleanStaleMessages?: boolean;
  logger?: Logger;
}

/**
 * Represents a subscription to a Nostr relay
 */
export interface NostrWSSubscription {
  /**
   * Channel identifier for the subscription
   */
  channel: string;
  
  /**
   * Filter criteria for the subscription
   */
  filter?: Record<string, unknown>;
}

/**
 * Events emitted by the NostrWSClient
 */
export interface NostrWSClientEvents {
  /**
   * Emitted when the client connects to the relay
   */
  connect: () => void;
  
  /**
   * Emitted when the client disconnects from the relay
   */
  disconnect: () => void;
  
  /**
   * Emitted when the client reconnects to the relay
   */
  reconnect: () => void;
  
  /**
   * Emitted when a message is received from the relay
   * @param message - The received message
   */
  message: (message: NostrWSMessage) => Promise<void>;
  
  /**
   * Emitted when an error occurs
   * @param error - The error that occurred
   */
  error: (error: Error) => void;
  close: () => void;
  stateChange?: (state: ConnectionState) => void;
  heartbeat?: () => void;
}

/**
 * Events emitted by the NostrWSServer
 */
export interface NostrWSServerEvents {
  /**
   * Emitted when a client connects
   * @param client - The connected client
   */
  connection: (client: ExtendedWebSocket) => void;

  /**
   * Emitted when a message is received from a client
   * @param message - The received message
   * @param client - The client that sent the message
   */
  message: (message: NostrWSMessage, client: ExtendedWebSocket) => void;

  /**
   * Emitted when an error occurs
   * @param error - The error that occurred
   */
  error: (error: Error) => void;
}
