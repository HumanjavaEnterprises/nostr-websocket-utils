"use strict";
/**
 * @file WebSocket transport implementation
 * @module transport/websocket
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketTransport = void 0;
const ws_1 = __importDefault(require("ws"));
const base_js_1 = require("./base.js");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.getLogger)('WebSocketTransport');
class WebSocketTransport extends base_js_1.BaseTransport {
    constructor(options = {}) {
        super(options);
        this.connections = new Map();
    }
    async connect(endpoint) {
        if (this.connections.has(endpoint)) {
            logger.warn({ endpoint }, 'Already connected to endpoint');
            return;
        }
        try {
            const ws = new ws_1.default(endpoint);
            ws.on('open', () => {
                this.trackMetric(endpoint, 'connection', true);
                this.trackMetric(endpoint, 'openHandshake', Date.now());
            });
            ws.on('close', () => {
                this.trackMetric(endpoint, 'connection', false);
                this.trackMetric(endpoint, 'closeHandshake', Date.now());
                this.connections.delete(endpoint);
            });
            ws.on('message', (data) => {
                const length = data instanceof Buffer ? data.length :
                    data instanceof ArrayBuffer ? data.byteLength :
                        data instanceof Array ? data.reduce((acc, buf) => acc + buf.length, 0) : 0;
                this.trackMetric(endpoint, 'messageReceived', length);
            });
            ws.on('error', (error) => {
                this.trackMetric(endpoint, 'error', error);
                logger.error({ error, endpoint }, 'WebSocket error');
            });
            // Track ping/pong for latency
            ws.on('ping', () => {
                this.trackMetric(endpoint, 'ping', Date.now());
            });
            ws.on('pong', () => {
                if (!this.metricsEnabled || !this.metricsProvider)
                    return;
                const now = Date.now();
                const metrics = this.metricsProvider.getMetrics(endpoint);
                if (!metrics || !metrics.lastSeen)
                    return;
                this.trackMetric(endpoint, 'latency', now - metrics.lastSeen);
            });
            this.connections.set(endpoint, ws);
        }
        catch (error) {
            this.trackMetric(endpoint, 'connectionError', error);
            throw error;
        }
    }
    async disconnect(endpoint) {
        const ws = this.connections.get(endpoint);
        if (!ws)
            return;
        return new Promise((resolve, reject) => {
            ws.close();
            ws.on('close', () => {
                this.connections.delete(endpoint);
                resolve();
            });
            ws.on('error', reject);
        });
    }
    async send(endpoint, data) {
        const ws = this.connections.get(endpoint);
        if (!ws)
            throw new Error(`Not connected to ${endpoint}`);
        return new Promise((resolve, reject) => {
            ws.send(data, (error) => {
                if (error) {
                    this.trackMetric(endpoint, 'sendError', error);
                    reject(error);
                }
                else {
                    this.trackMetric(endpoint, 'messageSent', data.length);
                    resolve();
                }
            });
        });
    }
    trackMetric(endpoint, metric, value) {
        if (this.metricsProvider && this.metricsEnabled) {
            const metricValue = value instanceof Error ? value.message : String(value);
            this.metricsProvider.trackMetric(endpoint, metric, metricValue);
        }
    }
    async checkEndpointHealth(endpoint) {
        try {
            if (!this.metricsEnabled || !this.metricsProvider) {
                return true;
            }
            const metrics = this.metricsProvider.getMetrics(endpoint);
            if (!metrics || !metrics.lastSeen) {
                return true;
            }
            const now = Date.now();
            const elapsed = now - metrics.lastSeen;
            // If we haven't seen a ping response in 30 seconds, consider unhealthy
            return elapsed < 30000;
        }
        catch (error) {
            logger.error('Error checking endpoint health:', error);
            return false;
        }
    }
    /**
     * Get all active WebSocket connections
     */
    getActiveConnections() {
        return Array.from(this.connections.keys());
    }
    /**
     * Check if connected to endpoint
     */
    isConnected(endpoint) {
        const ws = this.connections.get(endpoint);
        return ws?.readyState === ws_1.default.OPEN;
    }
}
exports.WebSocketTransport = WebSocketTransport;
//# sourceMappingURL=websocket.js.map