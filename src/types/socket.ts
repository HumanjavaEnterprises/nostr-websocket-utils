/**
 * @file Socket type definitions
 * @module types/socket
 */

import type { WebSocket } from 'ws';
import type { NostrWSMessage } from './messages';

/**
 * Extended WebSocket interface with Nostr-specific properties
 */
export interface NostrWSSocket extends WebSocket {
  /**
   * Unique client ID
   */
  clientId?: string;

  /**
   * Set of subscribed channels
   */
  subscriptions?: Set<string>;

  /**
   * Whether the socket is alive (for heartbeat)
   */
  isAlive?: boolean;

  /**
   * Send a message through the WebSocket
   */
  send(message: string | Buffer): void;
}

/**
 * WebSocket client options
 */
export interface NostrWSClientOptions {
  /**
   * WebSocket implementation to use
   */
  WebSocketImpl?: typeof WebSocket;

  /**
   * Heartbeat interval in milliseconds
   */
  heartbeatInterval?: number;

  /**
   * Reconnect interval in milliseconds
   */
  reconnectInterval?: number;

  /**
   * Maximum number of reconnect attempts
   */
  maxReconnectAttempts?: number;

  /**
   * Message handlers
   */
  handlers?: {
    message?: (message: NostrWSMessage) => Promise<void>;
    connect?: () => Promise<void>;
    disconnect?: () => Promise<void>;
    error?: (error: Error) => Promise<void>;
  };
}

/**
 * WebSocket server options
 */
export interface NostrWSServerOptions {
  /**
   * WebSocket server implementation to use
   */
  WebSocketImpl?: typeof WebSocket;

  /**
   * Heartbeat interval in milliseconds
   */
  heartbeatInterval?: number;

  /**
   * Message handlers
   */
  handlers?: {
    message?: (ws: NostrWSSocket, message: NostrWSMessage) => Promise<void>;
    connect?: (ws: NostrWSSocket) => Promise<void>;
    disconnect?: (ws: NostrWSSocket) => Promise<void>;
    error?: (ws: NostrWSSocket, error: Error) => Promise<void>;
  };
}

/**
 * Client event types
 */
export type NostrWSClientEvents = {
  message: (message: NostrWSMessage) => void;
  connect: () => void;
  disconnect: () => void;
  error: (error: Error) => void;
};

/**
 * Server event types
 */
export type NostrWSServerEvents = {
  message: (ws: NostrWSSocket, message: NostrWSMessage) => void;
  connect: (ws: NostrWSSocket) => void;
  disconnect: (ws: NostrWSSocket) => void;
  error: (ws: NostrWSSocket, error: Error) => void;
};
