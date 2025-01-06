/**
 * @file Base transport layer for Nostr connections
 * @module transport/base
 */
import { EventEmitter } from 'events';
import type { MetricsProvider, ScoringStrategy, MetricValue, TransportData } from '../types/scoring.js';
export interface TransportOptions {
    metricsProvider?: MetricsProvider;
    scoringStrategy?: ScoringStrategy;
    metricsEnabled?: boolean;
}
export declare abstract class BaseTransport extends EventEmitter {
    protected scoringStrategy: ScoringStrategy;
    protected metricsProvider?: MetricsProvider;
    protected metricsEnabled: boolean;
    constructor(options?: TransportOptions);
    /**
     * Create a default metrics provider if none is supplied
     */
    protected createDefaultMetricsProvider(): MetricsProvider;
    /**
     * Track a metric update
     */
    protected trackMetric(endpoint: string, metricType: string, value: MetricValue): void;
    /**
     * Gets the score for an endpoint
     * @param endpoint - Endpoint to get score for
     * @returns {number} Score between 0 and 100
     */
    getScore(endpoint: string): number;
    /**
     * Gets scores for all endpoints
     * @returns {Map<string, number>} Map of endpoint scores
     */
    getAllScores(): Map<string, number>;
    /**
     * Enable/disable metrics
     */
    setMetricsEnabled(enabled: boolean): void;
    /**
     * Updates the scoring strategy
     * @param strategy - New scoring strategy
     */
    updateScoringStrategy(strategy: ScoringStrategy): void;
    /**
     * Updates the metrics provider
     * @param provider - New metrics provider
     */
    updateMetricsProvider(provider?: MetricsProvider): void;
    abstract connect(endpoint: string): Promise<void>;
    abstract disconnect(endpoint: string): Promise<void>;
    abstract send(endpoint: string, data: TransportData): Promise<void>;
}
//# sourceMappingURL=base.d.ts.map