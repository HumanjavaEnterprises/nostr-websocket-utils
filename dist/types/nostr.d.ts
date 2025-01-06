/**
 * @file Nostr protocol type definitions
 * @module types/nostr
 */
import type { WebSocket as WSClient } from 'ws';
import { Logger } from './logger.js';
import type { NostrWSMessage } from './messages.js';
import type { NostrEvent } from './events.js';
/**
 * Signed Nostr event with id and signature
 */
export interface SignedNostrEvent extends NostrEvent {
    /**
     * Event ID (32-bytes lowercase hex of the serialized event data)
     */
    id: string;
    /**
     * Signature of the event ID (64-bytes hex of the schnorr signature)
     */
    sig: string;
}
/**
 * Extended WebSocket interface for Nostr
 */
export interface NostrWSSocket extends WSClient {
    /**
     * Whether the socket is alive (for ping/pong)
     */
    isAlive?: boolean;
    /**
     * Set of active subscription IDs
     */
    subscriptions?: Set<string>;
    /**
     * Unique client identifier
     */
    clientId?: string;
}
/**
 * Server configuration options
 */
export interface NostrWSServerOptions {
    /**
     * Port to listen on
     */
    port: number;
    /**
     * Host to bind to
     */
    host?: string;
    /**
     * Path for the WebSocket endpoint
     */
    path?: string;
    /**
     * Maximum payload size in bytes
     */
    maxPayload?: number;
    /**
     * Ping interval in milliseconds
     */
    pingInterval?: number;
    /**
     * Client timeout in milliseconds
     */
    clientTimeout?: number;
    /**
     * Heartbeat interval in milliseconds
     */
    heartbeatInterval?: number;
    /**
     * Handlers for various events
     */
    handlers?: {
        message?: (socket: NostrWSSocket, message: NostrWSServerMessage) => Promise<void>;
        error?: (socket: NostrWSSocket, error: Error) => void;
        close?: (socket: NostrWSSocket) => void;
    };
    /**
     * Callback for when a new connection is established
     */
    onConnection?: (socket: NostrWSSocket) => void;
}
/**
 * Server message structure
 */
export interface NostrWSServerMessage {
    /**
     * Message type
     */
    type: string;
    /**
     * Message data
     */
    data?: unknown;
    /**
     * Error message if applicable
     */
    error?: string;
}
/**
 * Extended WebSocket interface for Nostr server
 */
export interface NostrWSServerSocket extends WSClient {
    clientId: string;
    subscriptions: Set<string>;
    lastPing?: number;
    isAlive: boolean;
}
/**
 * Nostr WebSocket server options
 */
export interface NostrWSServerServerOptions {
    port: number;
    host?: string;
    path?: string;
    logger: Logger;
    maxClients?: number;
    pingInterval?: number;
    pingTimeout?: number;
    handlers?: {
        message?: (message: NostrWSServerMessage, ws: NostrWSServerSocket) => Promise<void>;
        error?: (error: Error, ws: NostrWSServerSocket) => void;
        close?: (ws: NostrWSServerSocket) => void;
    };
}
/**
 * Nostr WebSocket server message
 */
export type NostrWSServerServerMessage = NostrWSMessage & {
    clientId?: string;
    timestamp?: number;
};
//# sourceMappingURL=nostr.d.ts.map