/**
 * @file WebSocket transport implementation
 * @module transport/websocket
 */

import WebSocket from 'ws';
import { BaseTransport } from './base';
import { getLogger } from '../utils/logger';
import type { TransportOptions } from './base';

const logger = getLogger('WebSocketTransport');

export class WebSocketTransport extends BaseTransport {
  private connections: Map<string, WebSocket> = new Map();

  constructor(options: TransportOptions = {}) {
    super(options);
  }

  async connect(endpoint: string): Promise<void> {
    if (this.connections.has(endpoint)) {
      logger.warn({ endpoint }, 'Already connected to endpoint');
      return;
    }

    try {
      const ws = new WebSocket(endpoint);
      
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
        if (!this.metricsEnabled || !this.metricsProvider) return;
        
        const now = Date.now();
        const metrics = this.metricsProvider.getMetrics(endpoint);
        if (!metrics || !metrics.lastSeen) return;
        
        this.trackMetric(endpoint, 'latency', now - metrics.lastSeen);
      });

      this.connections.set(endpoint, ws);

    } catch (error) {
      this.trackMetric(endpoint, 'connectionError', error);
      throw error;
    }
  }

  async disconnect(endpoint: string): Promise<void> {
    const ws = this.connections.get(endpoint);
    if (!ws) return;

    return new Promise((resolve, reject) => {
      ws.close();
      ws.on('close', () => {
        this.connections.delete(endpoint);
        resolve();
      });
      ws.on('error', reject);
    });
  }

  async send(endpoint: string, data: any): Promise<void> {
    const ws = this.connections.get(endpoint);
    if (!ws) throw new Error(`Not connected to ${endpoint}`);

    return new Promise((resolve, reject) => {
      ws.send(data, (error) => {
        if (error) {
          this.trackMetric(endpoint, 'sendError', error);
          reject(error);
        } else {
          this.trackMetric(endpoint, 'messageSent', data.length);
          resolve();
        }
      });
    });
  }

  private async checkEndpointHealth(endpoint: string): Promise<boolean> {
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
    } catch (error) {
      logger.error('Error checking endpoint health:', error);
      return false;
    }
  }

  /**
   * Get all active WebSocket connections
   */
  public getActiveConnections(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Check if connected to endpoint
   */
  public isConnected(endpoint: string): boolean {
    const ws = this.connections.get(endpoint);
    return ws?.readyState === WebSocket.OPEN;
  }
}
