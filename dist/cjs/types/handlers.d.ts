/**
 * @file Handler type definitions for WebSocket events
 * @module types/handlers
 */
import type { WebSocket } from 'ws';
import type { NostrWSMessage } from './messages.js';
import type { ExtendedWebSocket } from './websocket.js';
/**
 * Events emitted by the NostrWSClient
 * @interface NostrWSClientEvents
 */
export interface NostrWSClientEvents {
    /**
     * Emitted when the client connects to the relay
     */
    connect: () => void;
    /**
     * Emitted when the client disconnects from the relay
     */
    disconnect: () => void;
    /**
     * Emitted when the client reconnects to the relay
     */
    reconnect: () => void;
    /**
     * Emitted when a message is received from the relay
     * @param message - The received message
     */
    message: (message: NostrWSMessage) => void;
    /**
     * Emitted when an error occurs
     * @param error - The error object
     */
    error: (error: Error) => void;
}
/**
 * Events emitted by the NostrWSServer
 * @interface NostrWSServerEvents
 */
export interface NostrWSServerEvents {
    /**
     * Emitted when a client connects to the server
     * @param client - The connected client
     */
    connection: (client: ExtendedWebSocket) => void;
    /**
     * Emitted when a message is received from a client
     * @param message - The received message
     * @param client - The client that sent the message
     */
    message: (message: NostrWSMessage, client: ExtendedWebSocket) => void;
    /**
     * Emitted when an error occurs
     * @param error - The error object
     */
    error: (error: Error) => void;
}
/**
 * Configuration options for WebSocket handlers
 * @interface NostrWSHandlers
 */
export interface NostrWSHandlers {
    /**
     * Handler for incoming messages
     * @param ws - The WebSocket instance
     * @param message - The received message
     */
    message: (ws: ExtendedWebSocket, message: NostrWSMessage) => Promise<void> | void;
    /**
     * Handler for WebSocket errors
     * @param ws - The WebSocket instance
     * @param error - The error object
     */
    error?: (ws: WebSocket, error: Error) => void;
    /**
     * Handler for WebSocket connection close
     * @param ws - The WebSocket instance
     */
    close?: (ws: WebSocket) => void;
}
//# sourceMappingURL=handlers.d.ts.map