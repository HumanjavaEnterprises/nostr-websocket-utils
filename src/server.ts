import { EventEmitter } from 'events';
import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket, OPEN, Data as WSData } from 'ws';
import { getLogger } from './utils/logger.js';
import type {
  NostrWSOptions,
  NostrWSMessage,
  ExtendedWebSocket,
  NostrWSValidationResult,
  Logger
} from './types/index.js';

export class NostrWSServer extends EventEmitter {
  private wss: WebSocketServer;
  private options: Required<NostrWSOptions>;
  private logger: Logger;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(server: HttpServer, options: NostrWSOptions = {}) {
    super();
    this.options = {
      heartbeatInterval: options.heartbeatInterval || 30000,
      reconnectInterval: options.reconnectInterval || 5000,
      maxReconnectAttempts: options.maxReconnectAttempts || 5,
      logger: options.logger || getLogger()
    };
    this.logger = this.options.logger;

    this.wss = new WebSocketServer({ server });
    this.setupServer();
  }

  public broadcast(message: NostrWSMessage): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  public broadcastToChannel(channel: string, message: NostrWSMessage): void {
    this.wss.clients.forEach((client) => {
      const extClient = client as ExtendedWebSocket;
      if (
        extClient.readyState === OPEN &&
        extClient.subscriptions?.has(channel)
      ) {
        client.send(JSON.stringify(message));
      }
    });
  }

  public sendTo(client: ExtendedWebSocket, message: NostrWSMessage): NostrWSValidationResult {
    if (client.readyState !== OPEN) {
      return {
        isValid: false,
        error: 'Client connection is not open'
      };
    }

    try {
      client.send(JSON.stringify(message));
      return { isValid: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        isValid: false,
        error: `Failed to send message: ${errorMessage}`
      };
    }
  }

  public getClients(): Set<ExtendedWebSocket> {
    return this.wss.clients as Set<ExtendedWebSocket>;
  }

  public close(): void {
    // Clear the heartbeat interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Close all client connections
    this.wss.clients.forEach((client) => {
      client.terminate();
    });

    // Close the server
    this.wss.close();
  }

  private setupServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const client = ws as ExtendedWebSocket;
      client.isAlive = true;
      client.subscriptions = new Set();

      this.logger.info('New client connected');
      this.emit('connection', client);

      client.on('pong', () => {
        client.isAlive = true;
      });

      client.on('message', (data: WSData) => {
        try {
          const message = JSON.parse(data.toString()) as NostrWSMessage;
          this.handleMessage(message, client);
        } catch (error) {
          this.logger.error('Failed to parse message:', error);
          this.sendTo(client, {
            type: 'error',
            data: { message: 'Invalid message format' }
          });
        }
      });

      client.on('close', () => {
        this.logger.info('Client disconnected');
        client.isAlive = false;
      });

      client.on('error', (error: Error) => {
        this.logger.error('Client error:', error);
        this.emit('error', error);
      });
    });

    this.setupHeartbeat();
  }

  private handleMessage(message: NostrWSMessage, client: ExtendedWebSocket): void {
    this.emit('message', message, client);

    switch (message.type) {
      case 'subscribe':
        if (message.data?.channel) {
          client.subscriptions?.add(message.data.channel as string);
          this.logger.debug(`Client subscribed to channel: ${message.data.channel as string}`);
        }
        break;

      case 'unsubscribe':
        if (message.data?.channel) {
          client.subscriptions?.delete(message.data.channel as string);
          this.logger.debug(`Client unsubscribed from channel: ${message.data.channel as string}`);
        }
        break;

      default:
        break;
    }
  }

  private setupHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const client = ws as ExtendedWebSocket;
        if (client.isAlive === false) {
          this.logger.debug('Terminating inactive client');
          return client.terminate();
        }

        client.isAlive = false;
        client.ping();
      });
    }, this.options.heartbeatInterval);
    
    // Unref the timer so it doesn't keep the process alive
    this.heartbeatInterval.unref();
  }
}
