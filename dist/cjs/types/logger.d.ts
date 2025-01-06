/**
 * @file Logger type definitions
 * @module types/logger
 */
import type { Logger as PinoLogger } from 'pino';
export type Logger = PinoLogger;
/**
 * WebSocket context for logging
 */
export interface WebSocketLogContext {
    clientId?: string;
    url?: string;
    messageId?: string;
    [key: string]: unknown;
}
/**
 * Extended logger interface with WebSocket-specific methods
 */
export interface NostrWSLogger extends Logger {
    /**
     * Log WebSocket connection event
     */
    wsConnect(context: WebSocketLogContext): void;
    /**
     * Log WebSocket disconnection event
     */
    wsDisconnect(context: WebSocketLogContext): void;
    /**
     * Log WebSocket message event
     */
    wsMessage(context: WebSocketLogContext): void;
    /**
     * Log WebSocket error event
     */
    wsError(error: Error, context: WebSocketLogContext): void;
    /**
     * Log WebSocket metrics
     */
    wsMetrics(metrics: Record<string, unknown>, context: WebSocketLogContext): void;
}
//# sourceMappingURL=logger.d.ts.map