import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { getLogger } from './utils/logger.js';
import type {
  NostrWSOptions,
  NostrWSMessage,
  NostrWSConnectionState,
  NostrWSValidationResult,
  Logger
} from './types/index.js';

export class NostrWSClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string;
  private options: Required<NostrWSOptions>;
  private messageQueue: NostrWSMessage[] = [];
  private reconnectAttempts = 0;
  private pingInterval: NodeJS.Timeout | null = null;
  private logger: Logger;

  constructor(url: string, options: NostrWSOptions = {}) {
    super();
    this.url = url;
    this.options = {
      heartbeatInterval: options.heartbeatInterval || 30000,
      reconnectInterval: options.reconnectInterval || 5000,
      maxReconnectAttempts: options.maxReconnectAttempts || 5,
      logger: options.logger || getLogger()
    };
    this.logger = this.options.logger;
  }

  public connect(): NostrWSValidationResult {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return {
        isValid: false,
        error: 'WebSocket connection already exists'
      };
    }

    try {
      this.ws = new WebSocket(this.url);
      this.setupWebSocket();
      return { isValid: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        isValid: false,
        error: `Failed to create WebSocket connection: ${errorMessage}`
      };
    }
  }

  public getConnectionState(): NostrWSConnectionState {
    return {
      isConnected: this.ws?.readyState === WebSocket.OPEN,
      reconnectAttempts: this.reconnectAttempts,
      lastError: undefined // Set this when handling errors
    };
  }

  public send(message: NostrWSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
      this.logger.debug('Message queued:', message);
    }
  }

  public subscribe(channel: string, filter?: any): void {
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

  public close(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private setupWebSocket(): void {
    if (!this.ws) return;

    this.ws.on('open', () => {
      this.logger.info('WebSocket connected');
      this.emit('connect');
      this.reconnectAttempts = 0;
      this.setupHeartbeat();
      this.flushMessageQueue();
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString()) as NostrWSMessage;
        this.emit('message', message);
      } catch (error) {
        this.logger.error('Failed to parse message:', error);
        this.emit('error', new Error('Failed to parse WebSocket message'));
      }
    });

    this.ws.on('close', () => {
      this.logger.info('WebSocket disconnected');
      this.emit('disconnect');
      this.handleReconnect();
    });

    this.ws.on('error', (error: Error) => {
      this.logger.error('WebSocket error:', error);
      this.emit('error', error);
    });
  }

  private setupHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, this.options.heartbeatInterval);
    this.pingInterval.unref();
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.logger.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`);
    
    const timer = setTimeout(() => {
      this.emit('reconnect');
      this.connect();
    }, this.options.reconnectInterval);
    timer.unref();
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }
}
