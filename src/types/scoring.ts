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
  // Core metrics any transport would need
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

// Default scoring weights
export const DEFAULT_WEIGHTS = {
  latency: 0.2,
  reliability: 0.3,
  uptime: 0.2,
  errors: 0.2,
  activity: 0.1,
} as const;

// Default scoring strategy
export class DefaultScoringStrategy implements ScoringStrategy {
  constructor(private weights = DEFAULT_WEIGHTS) {}

  calculateScore(metrics: BaseMetrics): number {
    const now = Date.now();
    
    // Basic scoring components that would work for any transport
    const latencyScore = Math.max(0, 100 - (metrics.averageLatency / 10));
    const activityScore = metrics.lastSeen ? 
      Math.max(0, 100 - ((now - metrics.lastSeen) / (60 * 1000))) : 0;
    const errorScore = Math.max(0, 100 - (metrics.connectionErrors * 5));
    
    return Math.round(
      (latencyScore * this.weights.latency) +
      (errorScore * this.weights.errors) +
      (activityScore * this.weights.activity)
    );
  }
}
