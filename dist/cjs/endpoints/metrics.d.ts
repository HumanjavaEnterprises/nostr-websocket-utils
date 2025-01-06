/**
 * @file Metrics endpoint for Nostr WebSocket server
 * @module endpoints/metrics
 */
export interface MetricsEndpointOptions {
    port?: number;
    host?: string;
    path?: string;
    auth?: {
        username: string;
        password: string;
    };
}
export declare class MetricsEndpoint {
    private server;
    private options;
    constructor(options?: MetricsEndpointOptions);
    private checkAuth;
    private handleRequest;
    /**
     * Start the metrics endpoint server
     */
    start(): Promise<void>;
    /**
     * Stop the metrics endpoint server
     */
    stop(): Promise<void>;
}
export declare const metricsEndpoint: MetricsEndpoint;
//# sourceMappingURL=metrics.d.ts.map