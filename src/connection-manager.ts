import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import type { EnhancedWebSocket } from './types/enhanced-websocket.js';
import type { Logger } from './types/index.js';

export class ConnectionManager extends EventEmitter {
  private connections: Map<string, EnhancedWebSocket> = new Map();
  private logger: Logger;

  constructor(logger: Logger) {
    super();
    this.logger = logger;
  }

  /**
   * Register a new WebSocket connection
   */
  registerConnection(client: EnhancedWebSocket): void {
    if (!client.id) {
      client.id = randomUUID();
    }
    if (!client.connectedAt) {
      client.connectedAt = new Date();
    }
    client.authenticated = false;
    client.isAlive = true;
    client.subscriptions = new Set();

    this.connections.set(client.id, client);
    this.logger.debug('Client connected:', { id: client.id });
    this.emit('connect', client);
  }

  /**
   * Remove a WebSocket connection
   */
  removeConnection(client: EnhancedWebSocket): void {
    if (client.id) {
      this.connections.delete(client.id);
      this.logger.debug('Client disconnected:', { id: client.id });
      this.emit('disconnect', client);
    }
  }

  /**
   * Get a specific connection by ID
   */
  getConnection(id: string): EnhancedWebSocket | undefined {
    return this.connections.get(id);
  }

  /**
   * Get all active connections
   */
  getAllConnections(): Map<string, EnhancedWebSocket> {
    return this.connections;
  }

  /**
   * Get connection stats
   */
  getStats(): { total: number; authenticated: number } {
    const total = this.connections.size;
    const authenticated = Array.from(this.connections.values()).filter(
      client => client.authenticated
    ).length;

    return { total, authenticated };
  }

  /**
   * Handle client authentication
   */
  async handleAuth(client: EnhancedWebSocket, message: any): Promise<void> {
    try {
      const [_, event] = message;
      if (await this.verifyAuth(event)) {
        client.authenticated = true;
        client.pubkey = event.pubkey;
        this.logger.debug('Client authenticated:', { id: client.id, pubkey: client.pubkey });
        this.emit('auth', client);
      }
    } catch (error) {
      this.logger.error('Error handling auth:', error);
    }
  }

  /**
   * Verify authentication event
   */
  private async verifyAuth(auth: any): Promise<boolean> {
    // TODO: Implement proper auth verification
    // For now, just check if required fields are present
    return !!(auth?.id && auth?.pubkey && auth?.sig);
  }

  /**
   * Broadcast a message to all connected clients
   */
  broadcast(message: any, filter?: (client: EnhancedWebSocket) => boolean): void {
    const clients = Array.from(this.connections.values());
    const targetClients = filter ? clients.filter(filter) : clients;

    for (const client of targetClients) {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  }

  /**
   * Broadcast a message to authenticated clients only
   */
  broadcastAuthenticated(message: any): void {
    this.broadcast(message, client => client.authenticated);
  }

  /**
   * Broadcast a message to clients subscribed to a specific channel
   */
  broadcastToChannel(channel: string, message: any): void {
    this.broadcast(message, client => client.subscriptions?.has(channel));
  }
}
