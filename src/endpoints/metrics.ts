/**
 * @file Metrics endpoint for Nostr WebSocket server
 * @module endpoints/metrics
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { metricsTracker } from '../utils/metrics.js';
import { getLogger } from '../utils/logger.js';

const logger = getLogger('MetricsEndpoint');

export interface MetricsEndpointOptions {
  port?: number;
  host?: string;
  path?: string;
  auth?: {
    username: string;
    password: string;
  };
}

export class MetricsEndpoint {
  private server;
  private options: Required<MetricsEndpointOptions>;

  constructor(options: MetricsEndpointOptions = {}) {
    this.options = {
      port: options.port || 9100,
      host: options.host || 'localhost',
      path: options.path || '/metrics',
      auth: options.auth || { username: '', password: '' }
    };

    this.server = createServer((req, res) => this.handleRequest(req, res));
  }

  private checkAuth(req: IncomingMessage): boolean {
    if (!this.options.auth.username) return true;

    const authHeader = req.headers.authorization || '';
    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic') return false;

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');

    return username === this.options.auth.username &&
           password === this.options.auth.password;
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
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
      const metrics = metricsTracker.getPrometheusMetrics();

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

    } catch (error) {
      logger.error({ error }, 'Error serving metrics');
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }

  /**
   * Start the metrics endpoint server
   */
  public start(): Promise<void> {
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
  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) reject(err);
        else {
          logger.info('Metrics endpoint stopped');
          resolve();
        }
      });
    });
  }
}

// Export singleton instance with default configuration
export const metricsEndpoint = new MetricsEndpoint();
