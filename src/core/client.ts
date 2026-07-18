import WebSocket from 'ws';
import { 
  NostrWSMessage, 
  ConnectionState
} from '../types/index.js';
import { NostrWSClientOptions } from '../types/websocket.js';
import { MessageQueue } from './queue.js';
import { createLogger } from '../utils/logger.js';
import { Logger } from 'pino';

/**
 * NostrWSClient handles WebSocket connections to Nostr relays
 */
export class NostrWSClient {
  private ws: WebSocket | null = null;
  private readonly queue: MessageQueue;
  private readonly logger: Logger;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(
    private readonly relayUrls: string[],
    private readonly options: NostrWSClientOptions = {}
  ) {
    this.logger = options.logger || createLogger('NostrWSClient');
    this.queue = new MessageQueue(
      async (message: NostrWSMessage) => {
        if (!this.ws || this.connectionState !== ConnectionState.CONNECTED) {
          throw new Error('Not connected to relay');
        }
        try {
          this.ws.send(JSON.stringify(message));
          this.logger.debug({ message }, 'Message sent');
        } catch (error) {
          this.logger.error({ error, message }, 'Failed to send message');
          throw error;
        }
      },
      {
        maxSize: options.queueSize,
        maxRetries: options.maxRetries,
        retryDelay: options.retryDelay
      }
    );
  }

  /**
   * Connect to the relay
   */
  async connect(): Promise<void> {
    if (this.connectionState === ConnectionState.CONNECTED) {
      this.logger.debug('Already connected');
      return;
    }

    if (this.connectionState === ConnectionState.CONNECTING) {
      this.logger.debug('Connection already in progress');
      return;
    }

    this.connectionState = ConnectionState.CONNECTING;

    // Failover: try each relay URL in turn (rotating the starting index on
    // reconnect attempts so a persistently-down first relay doesn't block B/C).
    const count = this.relayUrls.length;
    const start = count > 0 ? this.reconnectAttempts % count : 0;
    let lastError: unknown;

    for (let i = 0; i < count; i++) {
      const url = this.relayUrls[(start + i) % count];
      try {
        await this.connectTo(url);
        return; // connected successfully
      } catch (error) {
        lastError = error;
        this.logger.warn({ url, error }, 'Relay connection attempt failed, trying next');
      }
    }

    this.logger.error({ error: lastError }, 'Failed to connect to any relay');
    this.handleDisconnect();
    throw lastError instanceof Error ? lastError : new Error('Failed to connect to any relay');
  }

  /**
   * Attempt a connection to a single relay URL.
   */
  private async connectTo(url: string): Promise<void> {
    if (url.startsWith('ws://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
      console.warn('[nostr-websocket] WARNING: Connecting over plaintext ws:// — messages are not encrypted');
    }

    const ws = new WebSocket(url);
    this.ws = ws;

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, this.options.connectionTimeout || 5000);

      ws.on('open', () => {
        clearTimeout(timeout);
        this.connectionState = ConnectionState.CONNECTED;
        this.reconnectAttempts = 0;
        this.logger.info({ url }, 'Connected to relay');
        resolve();
      });

      ws.on('error', (error) => {
        clearTimeout(timeout);
        this.logger.error({ error, url }, 'WebSocket error');
        if (this.options.onError) {
          this.options.onError(error);
        }
        reject(error);
      });

      ws.on('close', () => {
        this.handleDisconnect();
      });

      ws.on('message', (data: WebSocket.Data) => {
        this.handleMessage(data);
      });
    });
  }

  /**
   * Disconnect from the relay
   */
  async disconnect(): Promise<void> {
    if (this.connectionState === ConnectionState.DISCONNECTED) {
      this.logger.debug('Already disconnected');
      return;
    }

    this.connectionState = ConnectionState.DISCONNECTED;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.logger.info('Disconnected from relay');
  }

  /**
   * Send a message to the relay
   */
  async sendMessage(message: NostrWSMessage): Promise<void> {
    // Allow buffering while CONNECTED/CONNECTING/RECONNECTING so the message
    // queue can hold messages across a disconnect (its sender-retry loop flushes
    // them once the socket is open again). Only reject when there is no path to
    // a connection.
    if (
      this.connectionState === ConnectionState.DISCONNECTED ||
      this.connectionState === ConnectionState.FAILED
    ) {
      throw new Error('Not connected to relay');
    }

    await this.queue.enqueue(message);
  }

  private handleMessage(data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString()) as NostrWSMessage;
      this.logger.debug({ message }, 'Received message');
      
      if (this.options.onMessage) {
        this.options.onMessage(data.toString());
      }
    } catch (error) {
      this.logger.error({ error, data }, 'Failed to parse message');
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }

  private handleDisconnect(): void {
    this.connectionState = ConnectionState.DISCONNECTED;
    this.ws = null;

    if (
      this.options.retryAttempts &&
      this.reconnectAttempts < this.options.retryAttempts
    ) {
      this.connectionState = ConnectionState.RECONNECTING;
      this.reconnectAttempts++;

      const baseDelay = this.options.retryDelay || 1000;
      const maxDelay = 30000; // 30 second cap
      const delay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts), maxDelay);
      const jitter = delay * 0.1 * Math.random(); // 10% jitter
      const totalDelay = delay + jitter;

      this.logger.info(
        { attempt: this.reconnectAttempts, maxAttempts: this.options.retryAttempts, delay: Math.round(totalDelay) },
        `Reconnecting in ${Math.round(totalDelay)}ms`
      );

      this.reconnectTimeout = setTimeout(() => {
        this.connect().catch(error => {
          this.logger.error({ error }, 'Reconnection failed');
        });
      }, totalDelay);
    } else {
      this.logger.warn('Max reconnection attempts reached');
      this.connectionState = ConnectionState.FAILED;
    }
  }

  /**
   * Get the current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }
}
