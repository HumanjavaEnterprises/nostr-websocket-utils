import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import type {
  NostrWSOptions,
  NostrWSMessage,
  ExtendedWebSocket
} from './types/index.js';

/**
 * WebSocket server implementation for Nostr protocol
 * Extends EventEmitter to provide event-based message handling
 */
export class NostrWSServer extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private options: NostrWSOptions;
  private clients: Map<string, ExtendedWebSocket> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(wss: WebSocketServer, options: Partial<NostrWSOptions> = {}) {
    super();
    if (!options.logger) {
      throw new Error('Logger is required');
    }

    this.wss = wss;
    this.options = {
      heartbeatInterval: 30000,
      logger: options.logger,
      WebSocketImpl: WebSocket,
      ...options,
      handlers: {
        message: async (_ws: ExtendedWebSocket, _message: NostrWSMessage) => {},
        ...options.handlers,
      },
    };

    this.setupServer();
  }

  private setupServer(): void {
    if (!this.wss) return;

    this.wss.on('connection', (ws: WebSocket) => {
      const extWs = ws as ExtendedWebSocket;
      this.handleConnection(extWs);
    });

    if (this.options.heartbeatInterval) {
      this.startHeartbeat();
    }
  }

  private handleConnection(ws: ExtendedWebSocket): void {
    ws.isAlive = true;
    ws.subscriptions = new Set();
    ws.clientId = uuidv4();
    ws.messageQueue = [];

    this.clients.set(ws.clientId, ws);

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString()) as NostrWSMessage;
        if (this.options.handlers?.message) {
          await this.options.handlers.message(ws, message);
        }
      } catch (error) {
        this.options.logger.error('Error handling message:', error);
        if (this.options.handlers?.error) {
          this.options.handlers.error(ws, error as Error);
        }
      }
    });

    ws.on('close', () => {
      if (ws.clientId) {
        this.clients.delete(ws.clientId);
      }
      if (this.options.handlers?.close) {
        this.options.handlers.close(ws);
      }
    });

    ws.on('error', (error: Error) => {
      this.options.logger.error('WebSocket error:', error);
      if (this.options.handlers?.error) {
        this.options.handlers.error(ws, error);
      }
    });
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      if (!this.wss) return;

      this.wss.clients.forEach((client: WebSocket) => {
        const extClient = client as ExtendedWebSocket;
        if (extClient.isAlive === false) {
          if (extClient.clientId) {
            this.clients.delete(extClient.clientId);
          }
          return extClient.terminate();
        }

        extClient.isAlive = false;
        extClient.ping();
      });
    }, this.options.heartbeatInterval);
  }

  public broadcast(message: NostrWSMessage): void {
    if (!this.wss) return;

    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  public broadcastToChannel(channel: string, message: NostrWSMessage): void {
    if (!this.wss) return;

    this.wss.clients.forEach((ws: WebSocket) => {
      const extWs = ws as ExtendedWebSocket;
      if (extWs.readyState === WebSocket.OPEN && extWs.subscriptions?.has(channel)) {
        extWs.send(JSON.stringify(message));
      }
    });
  }

  public close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
  }

  /**
   * Check if a client with the given ID exists
   * @param clientId - The ID of the client to check
   * @returns boolean indicating if the client exists
   */
  public hasClient(clientId: string): boolean {
    return this.clients.has(clientId);
  }
}
