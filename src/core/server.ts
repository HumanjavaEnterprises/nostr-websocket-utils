/**
 * @file WebSocket server implementation
 * @module core/server
 */

import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { getLogger } from '../utils/logger';
import { NostrWSServerSocket, NostrWSServerOptions, NostrWSServerMessage } from '../types/websocket';
import { RateLimiter, createRateLimiter } from '../utils/rate-limiter';
import { MessageType } from '../types/messages';

const logger = getLogger('NostrWSServer');

/**
 * NostrWSServer class for handling WebSocket connections
 */
export class NostrWSServer {
  private wss: WebSocketServer;
  private options: NostrWSServerOptions;
  private rateLimiter?: RateLimiter;
  private pingInterval?: NodeJS.Timeout;

  constructor(options: NostrWSServerOptions) {
    this.options = {
      ...options,
      port: options.port || 8080,
      host: options.host || 'localhost',
      maxConnections: options.maxConnections || 1000,
      pingInterval: options.pingInterval || 30000,
      rateLimits: options.rateLimits
    };

    this.wss = new WebSocketServer({
      port: this.options.port,
      host: this.options.host
    });

    this.setupServer();
    this.startPingInterval();

    if (this.options.rateLimits) {
      this.rateLimiter = createRateLimiter({
        EVENT: this.options.rateLimits
      }, logger);
    }
  }

  /**
   * Set up WebSocket server event handlers
   */
  private setupServer(): void {
    this.wss.on('connection', async (ws: WebSocket) => {
      const socket = ws as NostrWSServerSocket;
      socket.clientId = uuidv4();
      socket.subscriptions = new Set();
      socket.isAlive = true;

      logger.info(`Client connected: ${socket.clientId}`);

      if (this.wss.clients.size > this.options.maxConnections!) {
        logger.warn(`Max connections (${this.options.maxConnections}) reached`);
        socket.close(1008, 'Max connections reached');
        return;
      }

      socket.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as NostrWSServerMessage;
          
          if (this.rateLimiter && await this.rateLimiter.shouldLimit(socket.clientId, message)) {
            socket.send(JSON.stringify({
              type: 'NOTICE' as MessageType,
              data: { message: 'Rate limit exceeded' }
            } as NostrWSServerMessage));
            return;
          }

          await this.options.onMessage?.(message, socket);
        } catch (error) {
          logger.error('Error processing message:', error);
          this.options.onError?.(error as Error, socket);
        }
      });

      socket.on('error', (error: Error) => {
        logger.error(`Client error (${socket.clientId}):`, error);
        this.options.onError?.(error, socket);
      });

      socket.on('close', () => {
        logger.info(`Client disconnected: ${socket.clientId}`);
        this.options.onClose?.(socket);
      });

      socket.on('pong', () => {
        socket.isAlive = true;
      });

      await this.options.onConnection?.(socket);
    });
  }

  /**
   * Start ping interval to check client connections
   */
  private startPingInterval(): void {
    if (this.options.pingInterval) {
      this.pingInterval = setInterval(() => {
        this.wss.clients.forEach((socket: WebSocket) => {
          const nostrSocket = socket as NostrWSServerSocket;
          if (!nostrSocket.isAlive) {
            nostrSocket.terminate();
            return;
          }
          nostrSocket.isAlive = false;
          nostrSocket.ping();
        });
      }, this.options.pingInterval);
    }
  }

  /**
   * Stop the server and clean up resources
   */
  public stop(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    this.wss.clients.forEach((socket: WebSocket) => {
      const nostrSocket = socket as NostrWSServerSocket;
      if (nostrSocket.readyState === WebSocket.OPEN) {
        nostrSocket.close();
      }
    });
    this.wss.close();
  }
}
