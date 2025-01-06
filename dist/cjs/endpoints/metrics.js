"use strict";
/**
 * @file Metrics endpoint for Nostr WebSocket server
 * @module endpoints/metrics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsEndpoint = exports.MetricsEndpoint = void 0;
const http_1 = require("http");
const metrics_js_1 = require("../utils/metrics.js");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.getLogger)('MetricsEndpoint');
class MetricsEndpoint {
    constructor(options = {}) {
        this.options = {
            port: options.port || 9100,
            host: options.host || 'localhost',
            path: options.path || '/metrics',
            auth: options.auth || { username: '', password: '' }
        };
        this.server = (0, http_1.createServer)((req, res) => this.handleRequest(req, res));
    }
    checkAuth(req) {
        if (!this.options.auth.username)
            return true;
        const authHeader = req.headers.authorization || '';
        const [type, credentials] = authHeader.split(' ');
        if (type !== 'Basic')
            return false;
        const [username, password] = Buffer.from(credentials, 'base64')
            .toString()
            .split(':');
        return username === this.options.auth.username &&
            password === this.options.auth.password;
    }
    async handleRequest(req, res) {
        try {
            // Only handle GET requests to metrics path
            if (req.method !== 'GET' || req.url !== this.options.path) {
                res.writeHead(404);
                res.end('Not Found');
                return;
            }
            // Check authentication if configured
            if (!this.checkAuth(req)) {
                res.writeHead(401, {
                    'WWW-Authenticate': 'Basic realm="Nostr Metrics"'
                });
                res.end('Unauthorized');
                return;
            }
            // Get metrics in Prometheus format
            const metrics = metrics_js_1.metricsTracker.getPrometheusMetrics();
            // Send response
            res.writeHead(200, {
                'Content-Type': 'text/plain; version=0.0.4',
                'Cache-Control': 'no-cache'
            });
            res.end(metrics);
            logger.info({
                method: req.method,
                path: req.url,
                status: 200,
                metrics: metrics.split('\n').length
            }, 'Metrics request served');
        }
        catch (error) {
            logger.error({ error }, 'Error serving metrics');
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }
    /**
     * Start the metrics endpoint server
     */
    start() {
        return new Promise((resolve, reject) => {
            this.server.listen(this.options.port, this.options.host, () => {
                logger.info({
                    host: this.options.host,
                    port: this.options.port,
                    path: this.options.path
                }, 'Metrics endpoint started');
                resolve();
            }).on('error', reject);
        });
    }
    /**
     * Stop the metrics endpoint server
     */
    stop() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err)
                    reject(err);
                else {
                    logger.info('Metrics endpoint stopped');
                    resolve();
                }
            });
        });
    }
}
exports.MetricsEndpoint = MetricsEndpoint;
// Export singleton instance with default configuration
exports.metricsEndpoint = new MetricsEndpoint();
//# sourceMappingURL=metrics.js.map