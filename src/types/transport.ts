/**
 * @file Transport type definitions
 * @module types/transport
 */

import { NostrEvent } from './events';
import { NostrWSMessage } from './messages';

/**
 * Base transport interface
 */
export interface Transport {
  /**
   * Connect to the transport
   */
  connect(): Promise<void>;

  /**
   * Disconnect from the transport
   */
  disconnect(): Promise<void>;

  /**
   * Send a message through the transport
   */
  send(message: NostrWSMessage): Promise<void>;

  /**
   * Subscribe to events
   */
  subscribe(filter: NostrEvent): Promise<void>;

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): Promise<void>;

  /**
   * Check if transport is connected
   */
  isConnected(): boolean;

  /**
   * Get transport metrics
   */
  getMetrics(): TransportMetrics;
}

/**
 * Transport metrics
 */
export interface TransportMetrics {
  /**
   * Total number of messages sent
   */
  messagesSent: number;

  /**
   * Total number of messages received
   */
  messagesReceived: number;

  /**
   * Total number of bytes sent
   */
  bytesSent: number;

  /**
   * Total number of bytes received
   */
  bytesReceived: number;

  /**
   * Average message latency in milliseconds
   */
  averageLatency: number;

  /**
   * Number of active subscriptions
   */
  activeSubscriptions: number;

  /**
   * Connection uptime in milliseconds
   */
  uptime: number;

  /**
   * Number of connection attempts
   */
  connectionAttempts: number;

  /**
   * Number of successful connections
   */
  successfulConnections: number;

  /**
   * Number of failed connections
   */
  failedConnections: number;

  /**
   * Transport-specific metrics
   */
  [key: string]: number | string | boolean | undefined;
}

/**
 * Transport factory interface
 */
export interface TransportFactory {
  /**
   * Create a new transport instance
   */
  create(options: unknown): Transport;
}
