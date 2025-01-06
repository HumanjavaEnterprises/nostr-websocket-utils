import { NostrWSMessage, ConnectionState } from '../types/index.js';
import { NostrWSClientOptions } from '../types/websocket.js';
/**
 * NostrWSClient handles WebSocket connections to Nostr relays
 */
export declare class NostrWSClient {
    private readonly relayUrls;
    private readonly options;
    private ws;
    private readonly queue;
    private readonly logger;
    private connectionState;
    private reconnectAttempts;
    private reconnectTimeout;
    constructor(relayUrls: string[], options?: NostrWSClientOptions);
    /**
     * Connect to the relay
     */
    connect(): Promise<void>;
    /**
     * Disconnect from the relay
     */
    disconnect(): Promise<void>;
    /**
     * Send a message to the relay
     */
    sendMessage(message: NostrWSMessage): Promise<void>;
    private handleMessage;
    private handleDisconnect;
    /**
     * Get the current connection state
     */
    getConnectionState(): ConnectionState;
}
//# sourceMappingURL=client.d.ts.map