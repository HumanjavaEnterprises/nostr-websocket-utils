import WebSocket from 'ws';
import { EventEmitter } from 'events';
import type {
  NostrWSOptions,
  NostrWSMessage
} from './types/index.js';

export class NostrWSClient extends EventEmitter {
  private ws: WebSocket | null = null;
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
      this.ws = new WebSocket(this.url);
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
      this.startHeartbeat();
      this.emit('connect');
      this.flushMessageQueue();
    });

    this.ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString()) as NostrWSMessage;
        this.emit('message', message);
        await this.options.handlers.message(this.ws!, message);
      } catch (error) {
        this.emit('error', error);
        if (this.options.handlers.error) {
          this.options.handlers.error(this.ws!, error as Error);
        }
      }
    });

    this.ws.on('close', () => {
      this.options.logger.info('WebSocket connection closed');
      this.stopHeartbeat();
      this.handleReconnect();
      this.emit('disconnect');
      if (this.options.handlers.close) {
        this.options.handlers.close(this.ws!);
      }
    });

    this.ws.on('error', (error: Error) => {
      this.options.logger.error('WebSocket error:', error);
      this.emit('error', error);
      if (this.options.handlers.error) {
        this.options.handlers.error(this.ws!, error);
      }
    });
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, this.options.heartbeatInterval || 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectTimeout) return;

    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
      this.emit('reconnect');
    }, 5000);
  }

  public subscribe(channel: string, filter?: unknown): void {
    this.send({
      type: 'subscribe',
      data: { channel, filter }
    });
  }

  public unsubscribe(channel: string): void {
    this.send({
      type: 'unsubscribe',
      data: { channel }
    });
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  public async send(message: NostrWSMessage): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.messageQueue.push(message);
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error: unknown) {
      this.options.logger.error('Failed to send message:', error);
      this.handleReconnect();
    }
  }

  public close(): void {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
