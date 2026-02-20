"use strict";
/**
 * @file Metrics tracking for Nostr WebSocket connections
 * @module metrics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsTracker = exports.RelayMetricsTracker = void 0;
const events_1 = require("events");
const logger_js_1 = require("./logger.js");
const logger = (0, logger_js_1.getLogger)('RelayMetrics');
class RelayMetricsTracker extends events_1.EventEmitter {
    constructor() {
        super();
        this.metrics = new Map();
        this.startTime = Date.now();
        // Periodically calculate scores
        setInterval(() => this.updateScores(), 60000); // Every minute
    }
    /**
     * Get metrics for a specific relay
     */
    getRelayMetrics(relayUrl) {
        if (!this.metrics.has(relayUrl)) {
            this.initializeMetrics(relayUrl);
        }
        return this.metrics.get(relayUrl);
    }
    /**
     * Get metrics for all relays
     */
    getAllMetrics() {
        return this.metrics;
    }
    /**
     * Initialize metrics for a new relay
     */
    initializeMetrics(relayUrl) {
        this.metrics.set(relayUrl, {
            totalConnections: 0,
            activeConnections: 0,
            connectionErrors: 0,
            messagesReceived: 0,
            messagesSent: 0,
            bytesReceived: 0,
            bytesSent: 0,
            averageLatency: 0,
            maxLatency: 0,
            minLatency: Infinity,
            totalErrors: 0,
            eventsReceived: 0,
            eventsSent: 0,
            subscriptions: 0,
            uptime: 0,
            reliability: 1,
            lastSeen: Date.now(),
            score: 100
        });
    }
    /**
     * Update connection metrics
     */
    trackConnection(relayUrl, connected) {
        const metrics = this.getRelayMetrics(relayUrl);
        if (connected) {
            metrics.totalConnections++;
            metrics.activeConnections++;
            metrics.lastSeen = Date.now();
        }
        else {
            metrics.activeConnections = Math.max(0, metrics.activeConnections - 1);
        }
        this.emit('metrics.update', relayUrl, metrics);
    }
    /**
     * Track message metrics
     */
    trackMessage(relayUrl, sent, bytes) {
        const metrics = this.getRelayMetrics(relayUrl);
        if (sent) {
            metrics.messagesSent++;
            metrics.bytesSent += bytes;
        }
        else {
            metrics.messagesReceived++;
            metrics.bytesReceived += bytes;
        }
        metrics.lastSeen = Date.now();
        this.emit('metrics.update', relayUrl, metrics);
    }
    /**
     * Track latency
     */
    trackLatency(relayUrl, latencyMs) {
        const metrics = this.getRelayMetrics(relayUrl);
        metrics.maxLatency = Math.max(metrics.maxLatency, latencyMs);
        metrics.minLatency = Math.min(metrics.minLatency, latencyMs);
        // Exponential moving average for smoothing
        metrics.averageLatency = metrics.averageLatency * 0.9 + latencyMs * 0.1;
        this.emit('metrics.update', relayUrl, metrics);
    }
    /**
     * Track errors
     */
    trackError(relayUrl, error) {
        const metrics = this.getRelayMetrics(relayUrl);
        metrics.totalErrors++;
        metrics.lastError = error.message;
        metrics.connectionErrors++;
        this.emit('metrics.update', relayUrl, metrics);
    }
    /**
     * Track protocol-specific events
     */
    trackProtocolEvent(relayUrl, type, sent) {
        const metrics = this.getRelayMetrics(relayUrl);
        if (type === 'event') {
            if (sent) {
                metrics.eventsSent++;
            }
            else {
                metrics.eventsReceived++;
            }
        }
        else if (type === 'subscription') {
            metrics.subscriptions += sent ? 1 : -1;
            metrics.subscriptions = Math.max(0, metrics.subscriptions);
        }
        this.emit('metrics.update', relayUrl, metrics);
    }
    /**
     * Calculate relay score based on metrics
     */
    calculateScore(metrics) {
        const now = Date.now();
        // Calculate weighted scores for different aspects
        const latencyScore = Math.max(0, 100 - (metrics.averageLatency / 10)); // Lower is better
        const reliabilityScore = metrics.reliability * 100;
        const uptimeScore = Math.min(100, (metrics.uptime / (60 * 60 * 24)) * 100); // Score based on 24h uptime
        const errorScore = Math.max(0, 100 - (metrics.connectionErrors * 5)); // Each error reduces score by 5
        const activityScore = metrics.lastSeen ? Math.max(0, 100 - ((now - metrics.lastSeen) / (60 * 1000))) : 0; // Activity in last hour
        // Weighted average
        return Math.round((latencyScore * 0.2) +
            (reliabilityScore * 0.3) +
            (uptimeScore * 0.2) +
            (errorScore * 0.2) +
            (activityScore * 0.1));
    }
    /**
     * Update scores for all relays
     */
    updateScores() {
        const now = Date.now();
        for (const [url, metrics] of this.metrics.entries()) {
            // Update uptime
            metrics.uptime = (now - this.startTime) / 1000;
            // Update reliability based on successful vs total connections
            metrics.reliability = metrics.totalConnections > 0
                ? 1 - (metrics.connectionErrors / metrics.totalConnections)
                : 1;
            // Calculate composite score
            metrics.score = this.calculateScore(metrics);
            this.emit('metrics.score', url, metrics.score);
            logger.info({ url, score: metrics.score }, 'Updated relay score');
        }
    }
    /**
     * Get high-value relays (score > threshold)
     */
    getHighValueRelays(threshold = 70) {
        return Array.from(this.metrics.entries())
            .filter(([_, metrics]) => metrics.score >= threshold)
            .map(([url]) => url);
    }
    /**
     * Export metrics in Prometheus format
     */
    getPrometheusMetrics() {
        const lines = [];
        // Helper to format metric line
        const formatMetric = (name, value, labels = {}) => {
            const labelStr = Object.entries(labels)
                .map(([k, v]) => `${k}="${v}"`)
                .join(',');
            lines.push(`nostr_${name}${labelStr ? `{${labelStr}}` : ''} ${value}`);
        };
        for (const [url, metrics] of this.metrics.entries()) {
            const labels = { relay: url };
            // Connection metrics
            formatMetric('connections_total', metrics.totalConnections, labels);
            formatMetric('connections_active', metrics.activeConnections, labels);
            formatMetric('connection_errors_total', metrics.connectionErrors, labels);
            // Message metrics
            formatMetric('messages_received_total', metrics.messagesReceived, labels);
            formatMetric('messages_sent_total', metrics.messagesSent, labels);
            formatMetric('bytes_received_total', metrics.bytesReceived, labels);
            formatMetric('bytes_sent_total', metrics.bytesSent, labels);
            // Performance metrics
            formatMetric('latency_average', metrics.averageLatency, labels);
            formatMetric('latency_max', metrics.maxLatency, labels);
            formatMetric('latency_min', metrics.minLatency, labels);
            // Protocol metrics
            formatMetric('events_received_total', metrics.eventsReceived, labels);
            formatMetric('events_sent_total', metrics.eventsSent, labels);
            formatMetric('subscriptions_active', metrics.subscriptions, labels);
            // Scoring metrics
            formatMetric('uptime_seconds', metrics.uptime, labels);
            formatMetric('reliability_score', metrics.reliability, labels);
            formatMetric('composite_score', metrics.score, labels);
        }
        return lines.join('\n') + '\n';
    }
}
exports.RelayMetricsTracker = RelayMetricsTracker;
// Export singleton instance
exports.metricsTracker = new RelayMetricsTracker();
//# sourceMappingURL=metrics.js.map