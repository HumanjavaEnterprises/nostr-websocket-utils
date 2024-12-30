/**
 * @file WebSocket client implementation
 * @module core/client
 */

import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { 
  NostrWSMessage,
  NostrWSOptions,
  ExtendedWebSocket,
  MessageType,
  ConnectionState,
  MessagePriority,
  RetryConfig,
  QueueConfig,
  HeartbeatConfig
} from '../types';
import { MessageQueue } from './queue';
import { getLogger } from '../utils/logger';

const logger = getLogger('client');

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 10,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 1.5
};

const DEFAULT_QUEUE_CONFIG: QueueConfig = {
  maxSize: 1000,
  maxRetries: 3,
  retryDelay: 1000,
  staleTimeout: 300000 // 5 minutes
};

const DEFAULT_HEARTBEAT_CONFIG: HeartbeatConfig = {
  interval: 30000,
  timeout: 5000,
  maxMissed: 3
};

/**
 * WebSocket client implementation for Nostr protocol communication
 * Extends EventEmitter to provide event-based message handling
 */
export class NostrWSClient extends EventEmitter {
  private ws: ExtendedWebSocket | null = null;
  private state: ConnectionState = ConnectionState.DISCONNECTED;
  private messageQueue: MessageQueue;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private missedHeartbeats = 0;
  private reconnectAttempts = 0;
  private subscriptions = new Map<string, NostrWSMessage>();
  private readonly clientId: string;
  private readonly options: NostrWSOptions;

  constructor(private readonly url: string, options: Partial<NostrWSOptions> = {}) {
    super();
    this.clientId = uuidv4();
    
    // Initialize options with defaults
    this.options = {
      WebSocketImpl: options.WebSocketImpl || WebSocket,
      handlers: {
        message: options.handlers?.message || (async () => {}),
        error: options.handlers?.error || (() => {}),
        close: options.handlers?.close || (() => {}),
        stateChange: options.handlers?.stateChange,
        heartbeat: options.handlers?.heartbeat,
        connect: options.handlers?.connect || (() => {}),
        disconnect: options.handlers?.disconnect || (() => {}),
        reconnect: options.handlers?.reconnect || (() => {})
      },
      retry: { ...DEFAULT_RETRY_CONFIG, ...options.retry },
      queue: { ...DEFAULT_QUEUE_CONFIG, ...options.queue },
      heartbeat: { ...DEFAULT_HEARTBEAT_CONFIG, ...options.heartbeat },
      autoReconnect: options.autoReconnect !== false,
      bufferMessages: options.bufferMessages !== false,
      cleanStaleMessages: options.cleanStaleMessages !== false,
      logger: options.logger || logger
    };

    // Initialize message queue
    this.messageQueue = new MessageQueue(this.options.queue);
  }

  /**
   * Gets the current connection state
   */
  get connectionState(): ConnectionState {
    return this.state;
  }

  /**
   * Updates the connection state and notifies handlers
   */
  private setState(newState: ConnectionState): void {
    this.state = newState;
    logger.debug({ state: newState }, 'Connection state changed');
    this.options.handlers.stateChange?.(newState);
  }

  /**
   * Establishes a connection to the WebSocket server
   */
  async connect(): Promise<void> {
    if (this.ws) {
      logger.warn('Connection already exists');
      return;
    }

    try {
      this.setState(ConnectionState.CONNECTING);
      this.ws = new this.options.WebSocketImpl(this.url) as ExtendedWebSocket;
      this.setupEventHandlers();
      
      // Wait for connection to establish
      await new Promise<void>((resolve, reject) => {
        const onOpen = () => {
          this.ws?.removeEventListener('open', onOpen);
          this.ws?.removeEventListener('error', onError as any);
          resolve();
        };
        
        const onError = (error: any) => {
          this.ws?.removeEventListener('open', onOpen);
          this.ws?.removeEventListener('error', onError as any);
          reject(new Error(error?.message || 'Failed to connect'));
        };

        this.ws?.addEventListener('open', onOpen);
        this.ws?.addEventListener('error', onError as any);
      });

      this.setState(ConnectionState.CONNECTED);
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.flushMessageQueue();
      this.resubscribeAll();
      this.options.handlers.connect?.();
      
    } catch (error) {
      logger.error({ error }, 'Failed to establish connection');
      this.handleConnectionError(error as Error);
    }
  }

  /**
   * Sets up event handlers for the WebSocket connection
   */
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.addEventListener('message', async (event) => {
      try {
        const message = JSON.parse(event.data.toString()) as NostrWSMessage;
        
        // Handle heartbeat responses
        if (message.type === 'PONG' as MessageType) {
          this.handleHeartbeatResponse();
          return;
        }

        await this.options.handlers.message(message);
      } catch (error) {
        logger.error({ error }, 'Error handling message');
        this.options.handlers.error(error as Error);
      }
    });

    this.ws.addEventListener('error', (error: any) => {
      const wsError = error?.error || new Error('WebSocket error');
      logger.error({ error: wsError }, 'WebSocket error');
      this.options.handlers.error(wsError);
    });

    this.ws.addEventListener('close', () => {
      this.handleDisconnection();
    });
  }

  /**
   * Starts the heartbeat mechanism
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.state !== ConnectionState.CONNECTED) return;

      this.send({
        type: 'PING' as MessageType,
        priority: MessagePriority.LOW
      });

      this.heartbeatTimeout = setTimeout(() => {
        this.missedHeartbeats++;
        logger.warn({ missed: this.missedHeartbeats }, 'Missed heartbeat');

        if (this.missedHeartbeats >= (this.options.heartbeat?.maxMissed || DEFAULT_HEARTBEAT_CONFIG.maxMissed)) {
          logger.error('Too many missed heartbeats, reconnecting');
          this.reconnect();
        }
      }, this.options.heartbeat?.timeout || DEFAULT_HEARTBEAT_CONFIG.timeout);

    }, this.options.heartbeat?.interval || DEFAULT_HEARTBEAT_CONFIG.interval);
  }

  /**
   * Handles heartbeat responses
   */
  private handleHeartbeatResponse(): void {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
    this.missedHeartbeats = 0;
    this.options.handlers.heartbeat?.();
  }

  /**
   * Stops the heartbeat mechanism
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  /**
   * Handles connection errors
   */
  private handleConnectionError(error: Error): void {
    logger.error({ error }, 'Connection error');
    this.options.handlers.error(error);
    this.handleDisconnection();
  }

  /**
   * Handles disconnection and cleanup
   */
  private handleDisconnection(): void {
    this.stopHeartbeat();
    this.setState(ConnectionState.DISCONNECTED);
    this.ws = null;
    this.options.handlers.disconnect?.();
    this.options.handlers.close();

    if (this.options.autoReconnect) {
      this.reconnect();
    }
  }

  /**
   * Initiates reconnection with exponential backoff
   */
  private reconnect(): void {
    if (this.reconnectTimeout || this.state === ConnectionState.CONNECTING) {
      return;
    }

    this.reconnectAttempts++;
    const maxAttempts = this.options.retry?.maxAttempts || DEFAULT_RETRY_CONFIG.maxAttempts;
    if (this.reconnectAttempts > maxAttempts) {
      this.setState(ConnectionState.FAILED);
      logger.error('Max reconnection attempts exceeded');
      return;
    }

    const initialDelay = this.options.retry?.initialDelay || DEFAULT_RETRY_CONFIG.initialDelay;
    const backoffFactor = this.options.retry?.backoffFactor || DEFAULT_RETRY_CONFIG.backoffFactor;
    const maxDelay = this.options.retry?.maxDelay || DEFAULT_RETRY_CONFIG.maxDelay;

    const delay = Math.min(
      initialDelay * Math.pow(backoffFactor, this.reconnectAttempts - 1),
      maxDelay
    );

    this.setState(ConnectionState.RECONNECTING);
    logger.info({ attempt: this.reconnectAttempts, delay }, 'Scheduling reconnection');

    this.reconnectTimeout = setTimeout(async () => {
      this.reconnectTimeout = null;
      try {
        await this.connect();
      } catch (error) {
        logger.error({ error }, 'Reconnection failed');
      }
    }, delay);
    this.options.handlers.reconnect?.();
  }

  /**
   * Subscribes to a channel with optional filter
   */
  subscribe(channel: string, filter?: unknown): void {
    const subscription: NostrWSMessage = {
      type: 'REQ',
      data: { channel, filter },
      priority: MessagePriority.HIGH
    };

    this.subscriptions.set(channel, subscription);
    this.send(subscription);
  }

  /**
   * Resubscribes to all active subscriptions
   */
  private resubscribeAll(): void {
    for (const subscription of this.subscriptions.values()) {
      this.send(subscription);
    }
  }

  /**
   * Unsubscribes from a channel
   */
  unsubscribe(channel: string): void {
    const subscription = this.subscriptions.get(channel);
    if (subscription) {
      this.send({
        type: 'CLOSE',
        data: { channel },
        priority: MessagePriority.HIGH
      });
      this.subscriptions.delete(channel);
    }
  }

  /**
   * Flushes the message queue by sending pending messages
   */
  private async flushMessageQueue(): Promise<void> {
    if (this.state !== ConnectionState.CONNECTED) return;

    while (this.messageQueue.size > 0) {
      const message = this.messageQueue.dequeue();
      if (!message) break;

      try {
        await this.sendImmediate(message);
      } catch (error) {
        await this.messageQueue.retry(message);
      }
    }
  }

  /**
   * Sends a message immediately without queueing
   */
  private async sendImmediate(message: NostrWSMessage): Promise<void> {
    if (!this.ws || this.state !== ConnectionState.CONNECTED) {
      throw new Error('Not connected');
    }

    return new Promise((resolve, reject) => {
      this.ws!.send(JSON.stringify(message), (error) => {
        if (error) {
          logger.error({ error, message }, 'Failed to send message');
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Sends a message to the WebSocket server
   */
  async send(message: NostrWSMessage): Promise<void> {
    if (this.state === ConnectionState.CONNECTED) {
      try {
        await this.sendImmediate(message);
        return;
      } catch (error) {
        if (!this.options.bufferMessages) {
          throw error;
        }
      }
    }

    if (this.options.bufferMessages) {
      this.messageQueue.enqueue(message);
    } else {
      throw new Error('Not connected and message buffering is disabled');
    }
  }

  /**
   * Closes the WebSocket connection
   */
  close(): void {
    this.options.autoReconnect = false;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
    }

    this.handleDisconnection();
    this.messageQueue.clear();
    this.subscriptions.clear();
  }
}
