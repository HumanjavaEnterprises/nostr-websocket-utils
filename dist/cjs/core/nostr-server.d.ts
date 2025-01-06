import { NostrWSServerOptions } from '../types/websocket.js';
/**
 * Represents a Nostr WebSocket server
 */
export declare class NostrWSServer {
    /**
     * The underlying WebSocket server instance
     */
    private server;
    /**
     * Creates a new Nostr WebSocket server instance
     *
     * @param {NostrWSServerOptions} options - Server configuration options
     */
    constructor(options: NostrWSServerOptions);
    /**
     * Closes the WebSocket server
     */
    stop(): void;
}
/**
 * Creates a new Nostr WebSocket server instance
 *
 * @param {NostrWSServerOptions} options - Server configuration options
 * @returns {NostrWSServer} The created server instance
 */
export declare function createWSServer(options: NostrWSServerOptions): NostrWSServer;
//# sourceMappingURL=nostr-server.d.ts.map