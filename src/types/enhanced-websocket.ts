import { WebSocket } from 'ws';

export interface EnhancedWebSocket extends WebSocket {
  /**
   * Unique identifier for the WebSocket connection
   */
  id: string;

  /**
   * Optional public key of the authenticated client
   */
  pubkey?: string;

  /**
   * Whether the client has been authenticated
   */
  authenticated: boolean;

  /**
   * Whether the client is still alive (used for heartbeat)
   */
  isAlive: boolean;

  /**
   * Set of subscriptions for this client
   */
  subscriptions: Set<string>;

  /**
   * Timestamp when the connection was established
   */
  connectedAt: Date;
}
