import { EventEmitter } from 'events';
import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { ConnectionManager } from './connection-manager.js';
import type {
  NostrWSOptions,
  NostrWSMessage,
  EnhancedWebSocket
} from './types/index.js';

export class NostrWSServer extends EventEmitter {
  private wss: WebSocketServer;
  private options: NostrWSOptions;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private connectionManager: ConnectionManager;

  constructor(server: HttpServer, options: Partial<NostrWSOptions> = {}) {
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
      handlers: {
        message: options.handlers.message,
        error: options.handlers.error || (() => {}),
        close: options.handlers.close || (() => {})
      }
    };

    this.connectionManager = new ConnectionManager(this.options.logger);
    this.setupConnectionManager();
    
    this.wss = new WebSocketServer({ server });
    this.setupServer();
  }

  private setupConnectionManager(): void {
    // Forward connection manager events to server events
    this.connectionManager.on('connect', (client: EnhancedWebSocket) => {
      this.emit('connect', client);
    });

    this.connectionManager.on('disconnect', (client: EnhancedWebSocket) => {
      this.emit('disconnect', client);
    });

    this.connectionManager.on('auth', (client: EnhancedWebSocket) => {
      this.emit('auth', client);
    });
  }

  private setupServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const extWs = ws as EnhancedWebSocket;
      this.connectionManager.registerConnection(extWs);

      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as NostrWSMessage;
          
          // Handle AUTH messages
          if (Array.isArray(message) && message[0] === 'AUTH') {
            await this.connectionManager.handleAuth(extWs, message);
            return;
          }
          
          await this.options.handlers.message(extWs, message);
        } catch (error) {
          if (this.options.handlers.error) {
            this.options.handlers.error(ws, error as Error);
          }
        }
      });

      ws.on('close', () => {
        this.connectionManager.removeConnection(extWs);
        if (this.options.handlers.close) {
          this.options.handlers.close(ws);
        }
      });

      ws.on('error', (error: Error) => {
        if (this.options.handlers.error) {
          this.options.handlers.error(ws, error);
        }
        this.emit('error', error);
      });
    });

    if (this.options.heartbeatInterval && this.options.heartbeatInterval > 0) {
      this.startHeartbeat();
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const connections = this.connectionManager.getAllConnections();
      connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          if (!ws.isAlive) {
            return ws.terminate();
          }
          ws.ping();
          ws.isAlive = false;
        }
      });
    }, this.options.heartbeatInterval || 30000);
  }

  /**
   * Broadcast a message to all connected clients
   */
  public broadcast(message: NostrWSMessage): void {
    this.connectionManager.broadcast(message);
  }

  /**
   * Broadcast a message to authenticated clients only
   */
  public broadcastAuthenticated(message: NostrWSMessage): void {
    this.connectionManager.broadcastAuthenticated(message);
  }

  /**
   * Broadcast a message to clients subscribed to a specific channel
   */
  public broadcastToChannel(channel: string, message: NostrWSMessage): void {
    this.connectionManager.broadcastToChannel(channel, message);
  }

  /**
   * Get server statistics
   */
  public getStats(): { total: number; authenticated: number } {
    return this.connectionManager.getStats();
  }

  /**
   * Close the WebSocket server and clean up resources
   */
  public close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.wss.close();
  }
}
