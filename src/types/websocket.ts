/**
 * @file WebSocket type definitions
 * @module types/websocket
 */

import { WebSocket } from 'ws';
import { MessageType, NostrWSMessage } from './messages.js';
import { MessagePriority } from './priority.js';
import { RateLimitConfig } from '../utils/rate-limiter.js';
import { Logger } from 'pino';

/**
 * Extended WebSocket interface with additional properties
 * @interface ExtendedWebSocket
 */
export interface ExtendedWebSocket extends WebSocket {
  /**
   * Whether the WebSocket connection is alive
   */
  isAlive?: boolean;
  
  /**
   * Set of subscription channels
   */
  subscriptions?: Set<string>;
  
  /**
   * Unique client identifier
   */
  clientId?: string;
  
  /**
   * Queue of messages to be sent
   */
  messageQueue?: NostrWSMessage[];
  
  /**
   * Timestamp of the last ping message
   */
  lastPing?: number;
  
  /**
   * Timestamp of the last pong message
   */
  lastPong?: number;
}

/**
 * WebSocket client configuration options
 */
export interface NostrWSClientOptions {
  /**
   * Logger instance
   */
  logger?: Logger;
  
  /**
   * Connection timeout in milliseconds
   */
  connectionTimeout?: number;
  
  /**
   * Number of retry attempts for reconnection
   */
  retryAttempts?: number;
  
  /**
   * Delay between retry attempts in milliseconds
   */
  retryDelay?: number;
  
  /**
   * Maximum queue size
   */
  queueSize?: number;

  /**
   * Maximum number of retries for sending messages
   */
  maxRetries?: number;

  /**
   * Message handler callback
   */
  onMessage?: (message: string) => void;
  
  /**
   * Error handler callback
   */
  onError?: (error: Error) => void;
}

/**
 * WebSocket client event handlers
 */
export interface NostrWSEventHandlers {
  /**
   * Message handler callback
   */
  onMessage?: (message: string) => void;
  
  /**
   * Error handler callback
   */
  onError?: (error: Error) => void;
}

/**
 * Queue configuration options
 */
export interface QueueOptions {
  /**
   * Maximum size of the queue
   */
  maxSize?: number;
  
  /**
   * Maximum number of retries for failed messages
   */
  maxRetries?: number;
  
  /**
   * Delay between retries in milliseconds
   */
  retryDelay?: number;
  
  /**
   * Timeout for stale messages in milliseconds
   */
  staleTimeout?: number;
}

/**
 * Message queue item
 */
export interface QueueItem {
  /**
   * Message to be sent
   */
  message: NostrWSMessage;
  
  /**
   * Message priority
   */
  priority: MessagePriority;
  
  /**
   * Timestamp when the message was queued
   */
  queuedAt: number;
  
  /**
   * Number of retries for the message
   */
  retryCount?: number;
}

/**
 * State of the NostrWSClient connection
 * @interface NostrWSConnectionState
 */
export interface NostrWSConnectionState {
  /**
   * Whether the client is currently connected
   */
  isConnected: boolean;
  
  /**
   * Number of reconnection attempts made
   */
  reconnectAttempts: number;
  
  /**
   * Last error encountered
   */
  lastError?: string;
}

/**
 * Server configuration options
 * @interface NostrWSServerOptions
 */
export interface NostrWSServerOptions {
  /**
   * Port to listen on
   */
  port: number;
  
  /**
   * Host to bind to
   */
  host?: string;
  
  /**
   * Path for the WebSocket endpoint
   */
  path?: string;
  
  /**
   * Maximum payload size in bytes
   */
  maxPayload?: number;
  
  /**
   * Maximum number of concurrent connections
   */
  maxConnections?: number;
  
  /**
   * Ping interval in milliseconds
   */
  pingInterval?: number;
  
  /**
   * Rate limiting configuration
   */
  rateLimits?: RateLimitConfig;
  
  /**
   * Logger instance
   */
  logger?: Logger;
  
  /**
   * Message handler callback
   */
  onMessage?: (message: NostrWSMessage, socket: NostrWSServerSocket) => void;
  
  /**
   * Error handler callback
   */
  onError?: (error: Error, socket: NostrWSServerSocket) => void;
  
  /**
   * Close handler
   */
  onClose?: (socket: NostrWSServerSocket) => void;
  
  /**
   * Connection handler
   */
  onConnection?: (socket: NostrWSServerSocket) => Promise<void>;
}

/**
 * Server message structure
 * @interface NostrWSServerMessage
 */
export type NostrWSServerMessage = NostrWSMessage & {
  /**
   * Unique client identifier
   */
  clientId?: string;
}

/**
 * Extended WebSocket interface for Nostr server
 * @interface NostrWSServerSocket
 */
export interface NostrWSServerSocket extends WebSocket {
  /**
   * Unique client identifier
   */
  clientId: string;
  
  /**
   * Set of subscription channels
   */
  subscriptions: Set<string>;
  
  /**
   * Timestamp of the last ping message
   */
  lastPing?: number;
  
  /**
   * Whether the WebSocket connection is alive
   */
  isAlive: boolean;
}

/**
 * Nostr WebSocket server message with client info
 * @interface NostrWSServerClientMessage
 */
export type NostrWSServerClientMessage = [MessageType, ...unknown[]] & {
  /**
   * Unique client identifier
   */
  clientId?: string;
  
  /**
   * Timestamp of the message
   */
  timestamp?: number;
}
