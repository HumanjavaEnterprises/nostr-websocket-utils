import { WebSocketServer } from 'ws';
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
 * 
 * @extends EventEmitter
 * @example
 * ```typescript
 * const server = new NostrWSServer({
 *   port: 8080,
 *   logger: console,
 *   handlers: {
 *     message: async (ws, msg) => console.log('Received:', msg),
 *     error: (ws, err) => console.error('Error:', err),
 *     close: (ws) => console.log('Client disconnected')
 *   }
 * });
 * 
 * server.start();
 * ```
 */
export class NostrWSServer extends EventEmitter {
  private wss: WebSocketServer;
  private options: NostrWSOptions;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  public clients: Map<string, ExtendedWebSocket> = new Map();

  /**
   * Creates a new NostrWSServer instance
   * 
   * @param {Partial<NostrWSOptions>} options - Configuration options
   * @param {number} [options.heartbeatInterval=30000] - Interval for checking client connections
   * @param {object} options.logger - Logger instance (required)
   * @param {object} [options.handlers] - Event handlers
   * @param {Function} [options.handlers.message] - Message handler function
   * @param {Function} [options.handlers.error] - Error handler function
   * @param {Function} [options.handlers.close] - Connection close handler function
   * @throws {Error} If logger is not provided
   */
  constructor(wss: WebSocketServer, options: Partial<NostrWSOptions> = {}) {
    super();
    if (!options.logger) {
      throw new Error('Logger is required');
    }
    if (!options.handlers?.message) {
      throw new Error('Message handler is required');
    }
    this.options = {
      heartbeatInterval: options.heartbeatInterval || 30000,
      logger: options.logger,
      WebSocketImpl: options.WebSocketImpl || WebSocket,
      handlers: {
        message: options.handlers.message,
        error: options.handlers.error || (() => {}),
        close: options.handlers.close || (() => {})
      }
    };

    this.wss = wss;
    this.setupServer();
  }

  /**
   * Sets up the WebSocket server
   * 
   * @private
   */
  private setupServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      this.handleConnection(ws as ExtendedWebSocket);
    });

    if (this.options.heartbeatInterval && this.options.heartbeatInterval > 0) {
      this.startHeartbeat();
    }
  }

  /**
   * Handles a new client connection
   * 
   * @param {ExtendedWebSocket} ws - WebSocket client instance
   * @private
   */
  private handleConnection(ws: ExtendedWebSocket): void {
    ws.isAlive = true;
    ws.subscriptions = new Set();
    ws.clientId = ws.clientId || uuidv4();

    this.clients.set(ws.clientId, ws);

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString()) as NostrWSMessage;
        await this.options.handlers.message(ws, message);
      } catch (error) {
        if (this.options.handlers.error) {
          this.options.handlers.error(ws, error as Error);
        }
      }
    });

    ws.on('close', () => {
      if (ws.clientId) {
        this.clients.delete(ws.clientId);
      }
      if (this.options.handlers.close) {
        this.options.handlers.close(ws);
      }
    });

    ws.on('error', (error: Error) => {
      if (ws.clientId) {
        this.clients.delete(ws.clientId);
      }
      if (this.options.handlers.error) {
        this.options.handlers.error(ws, error);
      }
    });
  }

  /**
   * Starts the heartbeat mechanism to check client connections
   * 
   * @private
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        const extWs = ws as ExtendedWebSocket;
        if (!extWs.isAlive) {
          extWs.terminate();
          return;
        }
        extWs.isAlive = false;
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        }
      });
    }, this.options.heartbeatInterval);
  }

  /**
   * Broadcasts a message to all connected clients
   * 
   * @param {NostrWSMessage} message - Message to broadcast
   * @example
   * ```typescript
   * server.broadcast({
   *   type: 'EVENT',
   *   data: { content: 'Hello everyone!' }
   * });
   * ```
   */
  public broadcast(message: NostrWSMessage): void {
    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  /**
   * Broadcasts a message to all connected clients subscribed to a specific channel
   * 
   * @param {string} channel - Channel to broadcast to
   * @param {NostrWSMessage} message - Message to broadcast
   * @example
   * ```typescript
   * server.broadcastToChannel('my-channel', {
   *   type: 'EVENT',
   *   data: { content: 'Hello channel!' }
   * });
   * ```
   */
  public broadcastToChannel(channel: string, message: NostrWSMessage): void {
    this.wss.clients.forEach((ws: WebSocket) => {
      const extWs = ws as ExtendedWebSocket;
      if (extWs.readyState === WebSocket.OPEN && extWs.subscriptions?.has(channel)) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  /**
   * Stops the WebSocket server
   * 
   * @returns {Promise<void>}
   * @example
   * ```typescript
   * await server.close();
   * ```
   */
  public close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.wss.close();
  }
}
