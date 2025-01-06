/**
 * @file WebSocket client configuration options
 * @module types/options
 */
import WebSocket from 'ws';
import { NostrWSMessage } from './messages.js';
/**
 * Handler functions for WebSocket events
 */
export interface NostrWSHandlers {
    /**
     * Handler for incoming messages
     */
    message: (message: NostrWSMessage) => Promise<void>;
    /**
     * Handler for WebSocket errors
     */
    error: (error: Error) => void;
    /**
     * Handler for connection close events
     */
    close: () => void;
    /**
     * Handler for connection state changes
     */
    stateChange?: (state: string) => void;
    /**
     * Handler for heartbeat events
     */
    heartbeat?: () => void;
    /**
     * Handler for connection events
     */
    connect?: () => void;
    /**
     * Handler for disconnection events
     */
    disconnect?: () => void;
    /**
     * Handler for reconnection events
     */
    reconnect?: () => void;
}
/**
 * Connection retry configuration
 */
export interface RetryConfig {
    /**
     * Maximum number of retry attempts
     * @default 10
     */
    maxAttempts: number;
    /**
     * Initial delay between retries in milliseconds
     * @default 1000
     */
    initialDelay: number;
    /**
     * Maximum delay between retries in milliseconds
     * @default 30000
     */
    maxDelay: number;
    /**
     * Factor to multiply delay by after each attempt
     * @default 1.5
     */
    backoffFactor: number;
}
/**
 * Queue configuration
 */
export interface QueueConfig {
    /**
     * Maximum size of the message queue
     * @default 1000
     */
    maxSize: number;
    /**
     * Maximum number of retry attempts per message
     * @default 3
     */
    maxRetries: number;
    /**
     * Base delay between retries in milliseconds
     * @default 1000
     */
    retryDelay: number;
    /**
     * Time in milliseconds after which messages are considered stale
     * @default 300000 (5 minutes)
     */
    staleTimeout: number;
}
/**
 * Heartbeat configuration
 */
export interface HeartbeatConfig {
    /**
     * Interval between heartbeat pings in milliseconds
     * @default 30000
     */
    interval: number;
    /**
     * Timeout for heartbeat response in milliseconds
     * @default 5000
     */
    timeout: number;
    /**
     * Maximum missed heartbeats before connection is considered dead
     * @default 3
     */
    maxMissed: number;
}
/**
 * WebSocket client configuration options
 */
export interface NostrWSOptions {
    /**
     * WebSocket implementation to use
     * @default ws
     */
    WebSocketImpl: typeof WebSocket;
    /**
     * Event handlers
     */
    handlers: NostrWSHandlers;
    /**
     * Retry configuration
     */
    retry?: Partial<RetryConfig>;
    /**
     * Queue configuration
     */
    queue?: Partial<QueueConfig>;
    /**
     * Heartbeat configuration
     */
    heartbeat?: Partial<HeartbeatConfig>;
    /**
     * Whether to automatically reconnect on disconnection
     * @default true
     */
    autoReconnect?: boolean;
    /**
     * Whether to buffer messages when disconnected
     * @default true
     */
    bufferMessages?: boolean;
    /**
     * Whether to automatically remove stale messages from the queue
     * @default true
     */
    cleanStaleMessages?: boolean;
}
//# sourceMappingURL=options.d.ts.map