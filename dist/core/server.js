/**
 * @file WebSocket server implementation
 * @module core/server
 */
import { WebSocket, WebSocketServer } from 'ws';
import { createLogger } from '../utils/logger.js';
import { createRateLimiter } from '../utils/rate-limiter.js';
import { v4 as uuidv4 } from 'uuid';
const logger = createLogger('NostrWSServer');
/**
 * NostrWSServer class for handling WebSocket connections
 */
export class NostrWSServer {
    constructor(options) {
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
    setupServer() {
        this.wss.on('connection', async (ws) => {
            const socket = ws;
            socket.clientId = uuidv4();
            socket.subscriptions = new Set();
            socket.isAlive = true;
            logger.info(`Client connected: ${socket.clientId}`);
            if (this.wss.clients.size > this.options.maxConnections) {
                logger.warn(`Max connections (${this.options.maxConnections}) reached`);
                socket.close(1008, 'Max connections reached');
                return;
            }
            socket.on('message', async (data) => {
                try {
                    const rawMessage = data.toString();
                    await this.handleMessage(socket, rawMessage);
                }
                catch (error) {
                    logger.error('Error processing message:', error);
                    this.options.onError?.(error, socket);
                }
            });
            socket.on('error', (error) => {
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
    async handleMessage(socket, rawMessage) {
        try {
            // Parse the message as a NostrWSMessage tuple
            const message = JSON.parse(rawMessage);
            // Rate limiting check
            if (this.rateLimiter && await this.rateLimiter.shouldLimit(socket.clientId, message)) {
                logger.debug(`Rate limit exceeded for client ${socket.clientId}`);
                socket.send(JSON.stringify(['NOTICE', 'Rate limit exceeded']));
                return;
            }
            // Process message
            try {
                await this.options.onMessage?.(message, socket);
            }
            catch (error) {
                this.options.onError?.(error, socket);
            }
        }
        catch (error) {
            this.options.onError?.(error, socket);
        }
    }
    /**
     * Start ping interval to check client connections
     */
    startPingInterval() {
        if (this.options.pingInterval) {
            this.pingInterval = setInterval(() => {
                this.wss.clients.forEach((socket) => {
                    const nostrSocket = socket;
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
    stop() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        this.wss.clients.forEach((socket) => {
            const nostrSocket = socket;
            if (nostrSocket.readyState === WebSocket.OPEN) {
                nostrSocket.close();
            }
        });
        this.wss.close();
    }
}
//# sourceMappingURL=server.js.map