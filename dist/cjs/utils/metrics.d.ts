/**
 * @file Metrics tracking for Nostr WebSocket connections
 * @module metrics
 */
import { EventEmitter } from 'events';
export interface RelayMetrics {
    totalConnections: number;
    activeConnections: number;
    connectionErrors: number;
    messagesReceived: number;
    messagesSent: number;
    bytesReceived: number;
    bytesSent: number;
    averageLatency: number;
    maxLatency: number;
    minLatency: number;
    totalErrors: number;
    lastError?: string;
    eventsReceived: number;
    eventsSent: number;
    subscriptions: number;
    uptime: number;
    reliability: number;
    lastSeen: number;
    score: number;
}
export declare class RelayMetricsTracker extends EventEmitter {
    private metrics;
    private startTime;
    constructor();
    /**
     * Get metrics for a specific relay
     */
    getRelayMetrics(relayUrl: string): RelayMetrics;
    /**
     * Get metrics for all relays
     */
    getAllMetrics(): Map<string, RelayMetrics>;
    /**
     * Initialize metrics for a new relay
     */
    private initializeMetrics;
    /**
     * Update connection metrics
     */
    trackConnection(relayUrl: string, connected: boolean): void;
    /**
     * Track message metrics
     */
    trackMessage(relayUrl: string, sent: boolean, bytes: number): void;
    /**
     * Track latency
     */
    trackLatency(relayUrl: string, latencyMs: number): void;
    /**
     * Track errors
     */
    trackError(relayUrl: string, error: Error): void;
    /**
     * Track protocol-specific events
     */
    trackProtocolEvent(relayUrl: string, type: 'event' | 'subscription', sent: boolean): void;
    /**
     * Calculate relay score based on metrics
     */
    private calculateScore;
    /**
     * Update scores for all relays
     */
    private updateScores;
    /**
     * Get high-value relays (score > threshold)
     */
    getHighValueRelays(threshold?: number): string[];
    /**
     * Export metrics in Prometheus format
     */
    getPrometheusMetrics(): string;
}
export declare const metricsTracker: RelayMetricsTracker;
//# sourceMappingURL=metrics.d.ts.map