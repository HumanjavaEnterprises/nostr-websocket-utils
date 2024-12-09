import WebSocket from 'ws';
import { EventEmitter } from 'events';
import type {
  NostrWSOptions,
  NostrWSMessage,
  EnhancedWebSocket
} from './types/index.js';

export class NostrWSClient extends EventEmitter {
  private ws: EnhancedWebSocket | null = null;
  private options: NostrWSOptions;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private messageQueue: NostrWSMessage[] = [];

  constructor(private url: string, options: Partial<NostrWSOptions> = {}) {
    super();
    if (!options.logger) {
      throw new Error('Logger is required');
    }
    this.options = {
      heartbeatInterval: options.heartbeatInterval || 30000,
      logger: options.logger,
      handlers: {
        message: options.handlers?.message || (async () => {}),
        error: options.handlers?.error || (() => {}),
        close: options.handlers?.close || (() => {})
      }
    };
  }

  public connect(): void {
    if (this.ws) {
      this.options.logger.info('WebSocket connection already exists');
      return;
    }

    try {
      const ws = new WebSocket(this.url) as EnhancedWebSocket;
      ws.connectedAt = new Date();
      ws.isAlive = true;
      ws.authenticated = false;
      ws.subscriptions = new Set();
      this.ws = ws;
      this.setupEventHandlers();
    } catch (error) {
      this.options.logger.error('Failed to create WebSocket connection:', error);
      this.handleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.on('open', () => {
      this.options.logger.info('WebSocket connection established');
      this.reconnectAttempts = 0;
      this.emit('open');

      // Process any queued messages
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message) {
          this.send(message);
        }
      }

      // Start heartbeat
      if (this.options.heartbeatInterval && this.options.heartbeatInterval > 0) {
        this.startHeartbeat();
      }
    });

    this.ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString()) as NostrWSMessage;
        await this.options.handlers.message(this.ws!, message);
        this.emit('message', message);
      } catch (error) {
        this.options.logger.error('Failed to process message:', error);
        if (this.options.handlers.error) {
          this.options.handlers.error(this.ws!, error as Error);
        }
      }
    });

    this.ws.on('close', () => {
      this.options.logger.info('WebSocket connection closed');
      this.cleanup();
      if (this.options.handlers.close) {
        this.options.handlers.close(this.ws!);
      }
      this.emit('close');
      this.handleReconnect();
    });

    this.ws.on('error', (error: Error) => {
      this.options.logger.error('WebSocket error:', error);
      if (this.options.handlers.error) {
        this.options.handlers.error(this.ws!, error);
      }
      this.emit('error', error);
    });

    this.ws.on('pong', () => {
      if (this.ws) {
        this.ws.isAlive = true;
      }
    });
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        if (!this.ws.isAlive) {
          this.cleanup();
          this.ws.terminate();
          return;
        }
        this.ws.ping();
        this.ws.isAlive = false;
      }
    }, this.options.heartbeatInterval || 30000);
  }

  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.ws) {
      this.ws.isAlive = false;
      this.ws.removeAllListeners();
      // Don't set ws to null here to avoid issues with terminate
    }
  }

  private handleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      if (this.reconnectAttempts < 5) {
        this.reconnectAttempts++;
        this.options.logger.info(`Attempting to reconnect (${this.reconnectAttempts}/5)...`);
        this.connect();
      } else {
        this.options.logger.error('Max reconnection attempts reached');
        this.emit('max_reconnects');
      }
    }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000));
  }

  public send(message: NostrWSMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.messageQueue.push(message);
      return;
    }
    this.ws.send(JSON.stringify(message));
  }

  public async authenticate(event: any): Promise<void> {
    this.send(['AUTH', event]);
  }

  public subscribe(channel: string): void {
    if (this.ws) {
      this.ws.subscriptions?.add(channel);
      // Send subscription message if needed
      // this.send(['SUB', channel]);
    }
  }

  public unsubscribe(channel: string): void {
    if (this.ws) {
      this.ws.subscriptions?.delete(channel);
      // Send unsubscription message if needed
      // this.send(['UNSUB', channel]);
    }
  }

  public isConnected(): boolean {
    return !!(this.ws && this.ws.readyState === WebSocket.OPEN);
  }

  public isAuthenticated(): boolean {
    return !!(this.ws && this.ws.authenticated);
  }

  public close(): void {
    this.cleanup();
    if (this.ws) {
      this.ws.close();
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}
