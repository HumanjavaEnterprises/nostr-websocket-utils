/**
 * @file WebSocket transport implementation
 * @module transport/websocket
 */
import { BaseTransport } from './base.js';
import type { TransportOptions } from './base.js';
export declare class WebSocketTransport extends BaseTransport {
    private connections;
    constructor(options?: TransportOptions);
    connect(endpoint: string): Promise<void>;
    disconnect(endpoint: string): Promise<void>;
    send(endpoint: string, data: any): Promise<void>;
    protected trackMetric(endpoint: string, metric: string, value: unknown): void;
    private checkEndpointHealth;
    /**
     * Get all active WebSocket connections
     */
    getActiveConnections(): string[];
    /**
     * Check if connected to endpoint
     */
    isConnected(endpoint: string): boolean;
}
//# sourceMappingURL=websocket.d.ts.map