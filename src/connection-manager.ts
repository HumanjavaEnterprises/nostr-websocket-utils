import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';
import type { EnhancedWebSocket, NostrWSMessage, NostrEvent, Logger } from './types/index.js';

export class ConnectionManager extends EventEmitter {
  private connections: Map<string, EnhancedWebSocket> = new Map();

  constructor(private logger: Logger) {
    super();
  }

  public addConnection(ws: WebSocket): EnhancedWebSocket {
    const extWs = ws as EnhancedWebSocket;
    extWs.id = randomUUID();
    extWs.authenticated = false;
    extWs.isAlive = true;
    extWs.subscriptions = new Set();
    extWs.connectedAt = new Date();
    
    this.connections.set(extWs.id, extWs);
    return extWs;
  }

  public removeConnection(ws: EnhancedWebSocket): void {
    this.connections.delete(ws.id);
  }

  public async handleMessage(ws: EnhancedWebSocket, message: NostrWSMessage): Promise<void> {
    if (!ws.authenticated && message[0] !== 'AUTH') {
      this.logger.warn(`Unauthenticated client ${ws.id} tried to send message`);
      return;
    }

    switch (message[0]) {
      case 'EVENT':
        await this.handleEvent(ws, message[1]);
        break;
      case 'SUB':
        await this.handleSubscription(ws, message[1]);
        break;
      case 'UNSUB':
        await this.handleUnsubscription(ws, message[1]);
        break;
      case 'AUTH':
        await this.handleAuth(ws, message);
        break;
      default:
        this.logger.warn(`Unknown message type: ${message[0]}`);
    }
  }

  private async handleEvent(ws: EnhancedWebSocket, event: NostrEvent): Promise<void> {
    try {
      // Handle event based on kind
      switch (event.kind) {
        case 1: // Text Note
          break;
        case 4: // Encrypted Direct Message
          break;
        default:
          this.logger.warn(`Unhandled event kind: ${event.kind}`);
      }
    } catch (error) {
      this.logger.error(`Error handling event: ${(error as Error).message}`);
    }
  }

  private async handleSubscription(ws: EnhancedWebSocket, channel: string): Promise<void> {
    if (!ws.authenticated) {
      this.logger.warn(`Unauthenticated client ${ws.id} tried to subscribe`);
      return;
    }
    this.logger.info(`Client ${ws.id} subscribed to: ${channel}`);
    ws.subscriptions.add(channel);
  }

  private async handleUnsubscription(ws: EnhancedWebSocket, channel: string): Promise<void> {
    this.logger.info(`Client ${ws.id} unsubscribed from: ${channel}`);
    ws.subscriptions.delete(channel);
  }

  public async handleAuth(ws: EnhancedWebSocket, message: NostrWSMessage): Promise<void> {
    if (message[0] !== 'AUTH' || !message[1]) {
      this.logger.warn('Invalid AUTH message format');
      return;
    }

    const authData = message[1];
    if (!authData.pubkey) {
      this.logger.warn('Missing pubkey in AUTH message');
      return;
    }

    // In a real implementation, verify the auth token/signature here
    ws.authenticated = true;
    ws.pubkey = authData.pubkey;
    this.logger.info(`Client ${ws.id} authenticated with pubkey ${ws.pubkey}`);
  }

  public async broadcast(message: NostrWSMessage): Promise<void> {
    const messageStr = JSON.stringify(message);
    for (const ws of this.connections.values()) {
      if (ws.readyState === 1) { // WebSocket.OPEN
        try {
          ws.send(messageStr);
        } catch (error) {
          this.logger.error('Error broadcasting to client:', error);
        }
      }
    }
  }

  public async broadcastToAuthenticated(message: NostrWSMessage): Promise<void> {
    const messageStr = JSON.stringify(message);
    for (const ws of this.connections.values()) {
      if (ws.readyState === 1 && ws.authenticated) { // WebSocket.OPEN and authenticated
        try {
          ws.send(messageStr);
        } catch (error) {
          this.logger.error('Error broadcasting to authenticated client:', error);
        }
      }
    }
  }

  public async broadcastToSubscription(channel: string, message: NostrWSMessage): Promise<void> {
    const messageStr = JSON.stringify(message);
    for (const ws of this.connections.values()) {
      if (ws.readyState === 1 && ws.authenticated && ws.subscriptions.has(channel)) {
        try {
          ws.send(messageStr);
        } catch (error) {
          this.logger.error('Error broadcasting to subscribed client:', error);
        }
      }
    }
  }

  public getConnection(id: string): EnhancedWebSocket | undefined {
    return this.connections.get(id);
  }

  public getConnections(): Map<string, EnhancedWebSocket> {
    return this.connections;
  }

  public getAuthenticatedConnections(): EnhancedWebSocket[] {
    return Array.from(this.connections.values()).filter(ws => ws.authenticated);
  }

  public getStats(): {
    totalConnections: number;
    authenticatedConnections: number;
    totalSubscriptions: number;
    uptime: number;
  } {
    return {
      totalConnections: this.connections.size,
      authenticatedConnections: this.getAuthenticatedConnections().length,
      totalSubscriptions: Array.from(this.connections.values())
        .reduce((total, ws) => total + ws.subscriptions.size, 0),
      uptime: process.uptime()
    };
  }
}
