import { WebSocket } from 'ws';

export interface EnhancedWebSocket extends WebSocket {
  /**
   * Unique identifier for the WebSocket connection
   */
  id: string;

  /**
   * Whether the client has been authenticated
   */
  authenticated: boolean;

  /**
   * Optional challenge string for authentication
   */
  challenge?: string;

  /**
   * Timestamp when the connection was established
   */
  connectedAt: Date;

  /**
   * Optional public key of the authenticated client
   */
  pubkey?: string;

  /**
   * Set of subscriptions for this client
   */
  subscriptions?: Set<string>;

  /**
   * Whether the client is still alive (used for heartbeat)
   */
  isAlive: boolean;
}
