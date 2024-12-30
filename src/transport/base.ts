/**
 * @file Base transport layer for Nostr connections
 * @module transport/base
 */

import { EventEmitter } from 'events';
import { getLogger } from '../utils/logger';
import { DefaultScoringStrategy } from '../types/scoring';
import type { MetricsProvider, ScoringStrategy, MetricUpdateEvent } from '../types/scoring';

const logger = getLogger('BaseTransport');

export interface TransportOptions {
  metricsProvider?: MetricsProvider;
  scoringStrategy?: ScoringStrategy;
  metricsEnabled?: boolean;
}

export abstract class BaseTransport extends EventEmitter {
  protected scoringStrategy: ScoringStrategy;
  protected metricsProvider?: MetricsProvider;
  protected metricsEnabled: boolean;

  constructor(options: TransportOptions = {}) {
    super();
    this.scoringStrategy = options.scoringStrategy ?? new DefaultScoringStrategy();
    this.metricsProvider = options.metricsProvider;
    this.metricsEnabled = !!this.metricsProvider;
  }

  /**
   * Create a default metrics provider if none is supplied
   */
  protected createDefaultMetricsProvider(): MetricsProvider {
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
      trackMetric: () => {}
    };
  }

  /**
   * Track a metric update
   */
  protected trackMetric(endpoint: string, metricType: string, value: any) {
    if (!this.metricsEnabled) return;

    try {
      this.metricsProvider?.trackMetric(endpoint, metricType, value);
      
      const event: MetricUpdateEvent = {
        endpoint,
        metricType,
        value,
        timestamp: Date.now()
      };
      
      this.emit('metric', event);
      
    } catch (error) {
      logger.error({ error, endpoint, metricType }, 'Error tracking metric');
    }
  }

  /**
   * Gets the score for an endpoint
   * @param endpoint - Endpoint to get score for
   * @returns {number} Score between 0 and 100
   */
  public getScore(endpoint: string): number {
    if (!this.metricsEnabled) return 100;
    
    const metrics = this.metricsProvider?.getMetrics(endpoint);
    if (!metrics) return 100;
    
    return this.scoringStrategy.calculateScore(metrics);
  }

  /**
   * Gets scores for all endpoints
   * @returns {Map<string, number>} Map of endpoint scores
   */
  public getAllScores(): Map<string, number> {
    if (!this.metricsEnabled || !this.metricsProvider) return new Map();

    const scores = new Map<string, number>();
    const allMetrics = this.metricsProvider.getAllMetrics();
    for (const [endpoint, metrics] of allMetrics) {
      scores.set(endpoint, this.scoringStrategy.calculateScore(metrics));
    }
    return scores;
  }

  /**
   * Enable/disable metrics
   */
  public setMetricsEnabled(enabled: boolean) {
    this.metricsEnabled = enabled;
  }

  /**
   * Updates the scoring strategy
   * @param strategy - New scoring strategy
   */
  public updateScoringStrategy(strategy: ScoringStrategy): void {
    this.scoringStrategy = strategy;
  }

  /**
   * Updates the metrics provider
   * @param provider - New metrics provider
   */
  public updateMetricsProvider(provider?: MetricsProvider): void {
    this.metricsProvider = provider;
    this.metricsEnabled = !!provider;
  }

  // Abstract methods that specific transports must implement
  abstract connect(endpoint: string): Promise<void>;
  abstract disconnect(endpoint: string): Promise<void>;
  abstract send(endpoint: string, data: any): Promise<void>;
}
