/**
 * @file Scoring and metrics type definitions
 * @module types/scoring
 */
// Default scoring weights
export const DEFAULT_WEIGHTS = {
    latency: 0.2,
    reliability: 0.3,
    uptime: 0.2,
    errors: 0.2,
    activity: 0.1,
};
// Default scoring strategy
export class DefaultScoringStrategy {
    constructor(weights = DEFAULT_WEIGHTS) {
        this.weights = weights;
    }
    calculateScore(metrics) {
        const now = Date.now();
        // Basic scoring components that would work for any transport
        const latencyScore = Math.max(0, 100 - (metrics.averageLatency / 10));
        const activityScore = metrics.lastSeen ?
            Math.max(0, 100 - ((now - metrics.lastSeen) / (60 * 1000))) : 0;
        const errorScore = Math.max(0, 100 - (metrics.connectionErrors * 5));
        return Math.round((latencyScore * this.weights.latency) +
            (errorScore * this.weights.errors) +
            (activityScore * this.weights.activity));
    }
}
//# sourceMappingURL=scoring.js.map