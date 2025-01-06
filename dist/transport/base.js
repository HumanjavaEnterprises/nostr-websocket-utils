/**
 * @file Base transport layer for Nostr connections
 * @module transport/base
 */
import { EventEmitter } from 'events';
import { getLogger } from '../utils/logger.js';
import { DefaultScoringStrategy } from '../types/scoring.js';
const logger = getLogger('BaseTransport');
export class BaseTransport extends EventEmitter {
    constructor(options = {}) {
        super();
        this.scoringStrategy = options.scoringStrategy ?? new DefaultScoringStrategy();
        this.metricsProvider = options.metricsProvider;
        this.metricsEnabled = !!this.metricsProvider;
    }
    /**
     * Create a default metrics provider if none is supplied
     */
    createDefaultMetricsProvider() {
        return {
            getMetrics: () => ({
                totalConnections: 0,
                activeConnections: 0,
                connectionErrors: 0,
                messagesReceived: 0,
                messagesSent: 0,
                bytesReceived: 0,
                bytesSent: 0,
                averageLatency: 0,
                lastSeen: Date.now()
            }),
            getAllMetrics: () => new Map(),
            trackMetric: () => { }
        };
    }
    /**
     * Track a metric update
     */
    trackMetric(endpoint, metricType, value) {
        if (!this.metricsEnabled)
            return;
        try {
            this.metricsProvider?.trackMetric(endpoint, metricType, value);
            const event = {
                endpoint,
                metricType,
                value,
                timestamp: Date.now()
            };
            this.emit('metric', event);
        }
        catch (error) {
            logger.error({ error, endpoint, metricType }, 'Error tracking metric');
        }
    }
    /**
     * Gets the score for an endpoint
     * @param endpoint - Endpoint to get score for
     * @returns {number} Score between 0 and 100
     */
    getScore(endpoint) {
        if (!this.metricsEnabled)
            return 100;
        const metrics = this.metricsProvider?.getMetrics(endpoint);
        if (!metrics)
            return 100;
        return this.scoringStrategy.calculateScore(metrics);
    }
    /**
     * Gets scores for all endpoints
     * @returns {Map<string, number>} Map of endpoint scores
     */
    getAllScores() {
        if (!this.metricsEnabled || !this.metricsProvider)
            return new Map();
        const scores = new Map();
        const allMetrics = this.metricsProvider.getAllMetrics();
        for (const [endpoint, metrics] of allMetrics) {
            scores.set(endpoint, this.scoringStrategy.calculateScore(metrics));
        }
        return scores;
    }
    /**
     * Enable/disable metrics
     */
    setMetricsEnabled(enabled) {
        this.metricsEnabled = enabled;
    }
    /**
     * Updates the scoring strategy
     * @param strategy - New scoring strategy
     */
    updateScoringStrategy(strategy) {
        this.scoringStrategy = strategy;
    }
    /**
     * Updates the metrics provider
     * @param provider - New metrics provider
     */
    updateMetricsProvider(provider) {
        this.metricsProvider = provider;
        this.metricsEnabled = !!provider;
    }
}
//# sourceMappingURL=base.js.map