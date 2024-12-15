import type { WebSocket } from 'ws';

/**
 * Type of message that can be sent through the WebSocket connection
 * @type {('subscribe' | 'unsubscribe' | 'event' | 'request' | 'response' | 'error' | 'status')}
 */
export type MessageType = 
  | 'subscribe'
  | 'unsubscribe'
  | 'event'
  | 'request'
  | 'response'
  | 'error'
  | 'status';

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
   * Must implement debug, info, error, and warn methods
   */
  logger: Logger;

  /**
   * WebSocket implementation to use
   * Defaults to the native WebSocket implementation
   */
  WebSocketImpl: typeof WebSocket;

  /**
   * Event handlers for WebSocket events
   */
  handlers: {
    /**
     * Handler for incoming messages
     * @param ws - The WebSocket instance
     * @param message - The received message
     */
    message: (ws: ExtendedWebSocket, message: NostrWSMessage) => Promise<void> | void;
    
    /**
     * Handler for WebSocket errors
     * @param ws - The WebSocket instance
     * @param error - The error object
     */
    error?: (ws: WebSocket, error: Error) => void;
    
    /**
     * Handler for WebSocket connection close
     * @param ws - The WebSocket instance
     */
    close?: (ws: WebSocket) => void;
  };
}

/**
 * Structure of messages sent through the WebSocket connection
 * @interface NostrWSMessage
 */
export interface NostrWSMessage {
  /**
   * Type of the message (e.g., 'EVENT', 'subscribe', 'unsubscribe')
   */
  type: MessageType;
  
  /**
   * Unique identifier for the message
   */
  id?: string;
  
  /**
   * Data payload of the message
   */
  data: Record<string, unknown>;
}

/**
 * Represents a subscription to a Nostr relay
 * @interface NostrWSSubscription
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
 * @interface NostrWSClientEvents
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
  message: (message: NostrWSMessage) => void;
  
  /**
   * Emitted when an error occurs
   * @param error - The error object
   */
  error: (error: Error) => void;
}

/**
 * Events emitted by the NostrWSServer
 * @interface NostrWSServerEvents
 */
export interface NostrWSServerEvents {
  /**
   * Emitted when a client connects to the server
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
   * @param error - The error object
   */
  error: (error: Error) => void;
}

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
   * Number of reconnect attempts
   */
  reconnectAttempts?: number;
}

/**
 * Result of validating a NostrWSMessage
 * @interface NostrWSValidationResult
 */
export interface NostrWSValidationResult {
  /**
   * Whether the message is valid
   */
  isValid: boolean;
  
  /**
   * Error message if the message is invalid
   */
  error?: string;
}

/**
 * State of the NostrWSClient connection
 * @interface NostrWSConnectionState
 */
export interface NostrWSConnectionState {
  /**
   * Whether the client is connected to the relay
   */
  isConnected: boolean;
  
  /**
   * Number of reconnect attempts
   */
  reconnectAttempts: number;
  
  /**
   * Last error message
   */
  lastError?: string;
}

/**
 * Logger interface
 * @interface Logger
 */
export interface Logger {
  /**
   * Logs a debug message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  debug: (message: string, ...args: unknown[]) => void;
  
  /**
   * Logs an info message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  info: (message: string, ...args: unknown[]) => void;
  
  /**
   * Logs a warning message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  warn: (message: string, ...args: unknown[]) => void;
  
  /**
   * Logs an error message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  error: (message: string, ...args: unknown[]) => void;
}
