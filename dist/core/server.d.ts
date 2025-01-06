/**
 * @file WebSocket server implementation
 * @module core/server
 */
import { NostrWSServerOptions } from '../types/websocket.js';
/**
 * NostrWSServer class for handling WebSocket connections
 */
export declare class NostrWSServer {
    private wss;
    private options;
    private rateLimiter?;
    private pingInterval?;
    constructor(options: NostrWSServerOptions);
    /**
     * Set up WebSocket server event handlers
     */
    private setupServer;
    private handleMessage;
    /**
     * Start ping interval to check client connections
     */
    private startPingInterval;
    /**
     * Stop the server and clean up resources
     */
    stop(): void;
}
//# sourceMappingURL=server.d.ts.map