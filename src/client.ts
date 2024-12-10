import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { NostrWSErrorHandler, NostrWSError, ErrorCodes } from './error-handler.js';
import type { NostrEvent, NostrWSMessage, NostrWSClientEvents } from './types/index.js';

export class NostrWSClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string;
  private options: {
    autoReconnect: boolean;
    reconnectInterval: number;
    heartbeatInterval: number;
  };
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private errorHandler: NostrWSErrorHandler;

  constructor(url: string, options: Partial<{
    autoReconnect: boolean;
    reconnectInterval: number;
    heartbeatInterval: number;
  }> = {}) {
    super();
    this.url = url;
    this.options = {
      autoReconnect: options.autoReconnect ?? true,
      reconnectInterval: options.reconnectInterval ?? 5000,
      heartbeatInterval: options.heartbeatInterval ?? 30000
    };
    this.errorHandler = new NostrWSErrorHandler(console);
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.errorHandler.on('error', (error: Error) => {
      this.emit('error', error);
    });
  }

  public async connect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
          this.startHeartbeat();
          resolve();
        });

        this.ws.on('message', (data: string) => {
          try {
            const message = JSON.parse(data) as NostrWSMessage;
            this.emit('message', message);
          } catch (error) {
            const wsError = new NostrWSError(
              'Failed to parse message',
              ErrorCodes.MESSAGE_PARSE_ERROR,
              error as Error
            );
            this.emit('error', wsError);
          }
        });

        this.ws.on('error', (error: Error) => {
          const wsError = new NostrWSError(
            error.message,
            ErrorCodes.CONNECTION_ERROR,
            error
          );
          this.emit('error', wsError);
          reject(wsError);
          this.ws = null;
        });

        this.ws.on('close', () => {
          this.stopHeartbeat();
          this.scheduleReconnect();
          this.emit('close');
        });
      } catch (error) {
        const wsError = new NostrWSError(
          'Failed to establish connection',
          ErrorCodes.CONNECTION_ERROR,
          error as Error
        );
        reject(wsError);
        this.ws = null;
      }
    });
  }

  public async disconnect(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public send(message: NostrWSMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new NostrWSError(
        'WebSocket is not connected',
        ErrorCodes.CONNECTION_ERROR
      );
    }

    this.ws.send(JSON.stringify(message));
  }

  public subscribe(subscription: string): void {
    this.send(['SUB', subscription]);
  }

  public unsubscribe(subscription: string): void {
    this.send(['UNSUB', subscription]);
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.options.autoReconnect && !this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(() => {
        this.connect().catch(error => {
          this.errorHandler.handleConnectionError(error, 'Reconnection failed');
        });
      }, this.options.reconnectInterval);
    }
  }
}
