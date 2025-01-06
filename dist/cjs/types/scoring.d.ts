/**
 * @file Scoring and metrics type definitions
 * @module types/scoring
 */
/**
 * Metric value types
 */
export type MetricValue = number | string | boolean | Date;
/**
 * Transport data types
 */
export type TransportData = string | Buffer | ArrayBuffer | SharedArrayBuffer;
/**
 * Metrics update event
 */
export interface MetricUpdateEvent {
    endpoint: string;
    metricType: string;
    value: MetricValue;
    timestamp: number;
}
export interface BaseMetrics {
    totalConnections: number;
    activeConnections: number;
    connectionErrors: number;
    messagesReceived: number;
    messagesSent: number;
    bytesReceived: number;
    bytesSent: number;
    averageLatency: number;
    lastSeen: number;
}
export interface ScoringStrategy {
    calculateScore(metrics: BaseMetrics): number;
}
export interface MetricsProvider<T extends BaseMetrics = BaseMetrics> {
    getMetrics(endpoint: string): T;
    getAllMetrics(): Map<string, T>;
    trackMetric(endpoint: string, metricType: string, value: any): void;
}
export declare const DEFAULT_WEIGHTS: {
    readonly latency: 0.2;
    readonly reliability: 0.3;
    readonly uptime: 0.2;
    readonly errors: 0.2;
    readonly activity: 0.1;
};
export declare class DefaultScoringStrategy implements ScoringStrategy {
    private weights;
    constructor(weights?: {
        readonly latency: 0.2;
        readonly reliability: 0.3;
        readonly uptime: 0.2;
        readonly errors: 0.2;
        readonly activity: 0.1;
    });
    calculateScore(metrics: BaseMetrics): number;
}
//# sourceMappingURL=scoring.d.ts.map