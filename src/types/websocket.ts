/**
 * @file WebSocket type definitions and extensions
 * @module types/websocket
 */

import type { WebSocket } from 'ws';
import type { NostrWSMessage } from './messages';
import { MessageType } from './messages';
import { RateLimitConfig } from '../utils/rate-limiter';
import type { Logger } from './logger';

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
 * Configuration options for the NostrWSClient
 * @interface NostrWSOptions
 */
export interface NostrWSOptions {
  /**
   * Interval in milliseconds between heartbeat messages
   * @default 30000
   */
  heartbeatInterval?: number;

  /**
   * Interval in milliseconds between reconnect attempts
   * @default 5000
   */
  reconnectInterval?: number;

  /**
   * Maximum number of reconnect attempts
   * @default 10
   */
  maxReconnectAttempts?: number;

  /**
   * Logger instance for handling log messages
   */
  logger: Logger;

  /**
   * WebSocket implementation to use
   */
  WebSocketImpl: typeof WebSocket;
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
   * Message handler
   */
  onMessage?: (message: NostrWSMessage, socket: NostrWSServerSocket) => Promise<void>;

  /**
   * Error handler
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
export interface NostrWSServerMessage {
  /**
   * Message type
   */
  type: MessageType;
  /**
   * Message data
   */
  data?: unknown;

  /**
   * Error message if applicable
   */
  error?: string;
}

/**
 * Extended WebSocket interface for Nostr server
 * @interface NostrWSServerSocket
 */
export interface NostrWSServerSocket extends WebSocket {
  clientId: string;
  subscriptions: Set<string>;
  lastPing?: number;
  isAlive: boolean;
}

/**
 * Nostr WebSocket server message with client info
 * @interface NostrWSServerClientMessage
 */
export interface NostrWSServerClientMessage extends NostrWSMessage {
  clientId?: string;
  timestamp?: number;
}
