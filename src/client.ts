import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';
import { EventEmitter } from 'events';
import type {
  NostrWSOptions,
  NostrWSMessage
} from './types/index.js';

/**
 * WebSocket client implementation for Nostr protocol communication
 * Extends EventEmitter to provide event-based message handling
 * 
 * @extends EventEmitter
 * @example
 * ```typescript
 * const client = new NostrWSClient('wss://relay.example.com', {
 *   logger: console,
 *   heartbeatInterval: 30000,
 *   handlers: {
 *     message: async (msg) => console.log('Received:', msg),
 *     error: (err) => console.error('Error:', err),
 *     close: () => console.log('Connection closed')
 *   }
 * });
 * 
 * await client.connect();
 * client.send({ type: 'EVENT', data: { ... } });
 * ```
 */
export class NostrWSClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private options: NostrWSOptions;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private messageQueue: NostrWSMessage[] = [];
  private clientId: string;

  /**
   * Creates a new NostrWSClient instance
   * 
   * @param {string} url - The WebSocket server URL to connect to
   * @param {Partial<NostrWSOptions>} options - Configuration options
   * @param {number} [options.heartbeatInterval=30000] - Interval for sending heartbeat messages in milliseconds
   * @param {object} options.logger - Logger instance (required)
   * @param {Function} [options.WebSocketImpl=WebSocket] - WebSocket implementation to use
   * @param {object} [options.handlers] - Event handlers
   * @param {Function} [options.handlers.message] - Message handler function
   * @param {Function} [options.handlers.error] - Error handler function
   * @param {Function} [options.handlers.close] - Connection close handler function
   * @throws {Error} If logger is not provided
   */
  constructor(private url: string, options: Partial<NostrWSOptions> = {}) {
    super();
    if (!options.logger) {
      throw new Error('Logger is required');
    }
    this.clientId = uuidv4();
    this.options = {
      heartbeatInterval: options.heartbeatInterval || 30000,
      logger: options.logger,
      WebSocketImpl: options.WebSocketImpl || WebSocket,
      handlers: {
        message: options.handlers?.message || (async () => {}),
        error: options.handlers?.error || (() => {}),
        close: options.handlers?.close || (() => {})
      }
    };
  }

  /**
   * Establishes a connection to the WebSocket server
   * 
   * @example
   * ```typescript
   * client.connect();
   * ```
   */
  public connect(): void {
    if (this.ws) {
      this.options.logger.info('WebSocket connection already exists');
      return;
    }

    try {
      this.options.logger.debug('Creating new WebSocket connection');
      this.ws = new this.options.WebSocketImpl(this.url);
      this.options.logger.debug('WebSocket created successfully');
      this.setupEventHandlers();
    } catch (error) {
      this.options.logger.error('Failed to create WebSocket connection:', error);
      this.handleReconnect();
    }
  }

  /**
   * Sets up event handlers for the WebSocket connection
   * 
   * @private
   */
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

  /**
   * Starts sending heartbeat messages at the specified interval
   * 
   * @private
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, this.options.heartbeatInterval || 30000);
  }

  /**
   * Stops sending heartbeat messages
   * 
   * @private
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Handles reconnecting to the WebSocket server after a disconnection
   * 
   * @private
   */
  private handleReconnect(): void {
    if (this.reconnectTimeout) return;

    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
      this.emit('reconnect');
    }, 5000);
  }

  /**
   * Subscribes to a channel with optional filter
   * 
   * @param {string} channel - Channel name
   * @param {unknown} [filter] - Filter data
   * @example
   * ```typescript
   * client.subscribe('channel-name', { ...filterData });
   * ```
   */
  public subscribe(channel: string, filter?: unknown): void {
    this.send({
      type: 'subscribe',
      data: { channel, filter }
    });
  }

  /**
   * Unsubscribes from a channel
   * 
   * @param {string} channel - Channel name
   * @example
   * ```typescript
   * client.unsubscribe('channel-name');
   * ```
   */
  public unsubscribe(channel: string): void {
    this.send({
      type: 'unsubscribe',
      data: { channel }
    });
  }

  /**
   * Flushes the message queue by sending pending messages
   * 
   * @private
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  /**
   * Sends a message to the WebSocket server
   * 
   * @param {NostrWSMessage} message - Message to send
   * @returns {Promise<void>}
   * @example
   * ```typescript
   * client.send({ type: 'EVENT', data: { ... } });
   * ```
   */
  public async send(message: NostrWSMessage): Promise<void> {
    message.id = message.id || uuidv4();
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

  /**
   * Closes the WebSocket connection
   * 
   * @example
   * ```typescript
   * client.close();
   * ```
   */
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
