import { EventEmitter } from 'events';
import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import type {
  NostrWSOptions,
  NostrWSMessage,
  ExtendedWebSocket
} from './types/index.js';

export class NostrWSServer extends EventEmitter {
  private wss: WebSocketServer;
  private options: NostrWSOptions;
  private heartbeatInterval: NodeJS.Timeout | null = null;

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

    this.wss = new WebSocketServer({ server });
    this.setupServer();
  }

  private setupServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const extWs = ws as ExtendedWebSocket;
      extWs.subscriptions = new Set();
      extWs.isAlive = true;

      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as NostrWSMessage;
          await this.options.handlers.message(extWs, message);
        } catch (error) {
          if (this.options.handlers.error) {
            this.options.handlers.error(ws, error as Error);
          }
        }
      });

      ws.on('close', () => {
        extWs.isAlive = false;
        if (this.options.handlers.close) {
          this.options.handlers.close(ws);
        }
      });

      ws.on('error', (error: Error) => {
        if (this.options.handlers.error) {
          this.options.handlers.error(ws, error);
        }
      });
    });

    if (this.options.heartbeatInterval && this.options.heartbeatInterval > 0) {
      this.startHeartbeat();
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          const extWs = ws as ExtendedWebSocket;
          if (!extWs.isAlive) {
            return ws.terminate();
          }
          ws.ping();
          extWs.isAlive = false;
        }
      });
    }, this.options.heartbeatInterval || 30000);
  }

  public broadcast(message: NostrWSMessage): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  public broadcastToChannel(channel: string, message: NostrWSMessage): void {
    this.wss.clients.forEach((client) => {
      const extClient = client as ExtendedWebSocket;
      if (client.readyState === WebSocket.OPEN && extClient.subscriptions?.has(channel)) {
        client.send(JSON.stringify(message));
      }
    });
  }

  public close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.wss.close();
  }
}
