"use strict";
/**
 * @file WebSocket server implementation
 * @module core/server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostrWSServer = void 0;
const ws_1 = require("ws");
const logger_js_1 = require("../utils/logger.js");
const rate_limiter_js_1 = require("../utils/rate-limiter.js");
const uuid_1 = require("uuid");
const logger = (0, logger_js_1.createLogger)('NostrWSServer');
/**
 * NostrWSServer class for handling WebSocket connections
 */
class NostrWSServer {
    constructor(options) {
        this.options = {
            ...options,
            port: options.port || 8080,
            host: options.host || 'localhost',
            maxConnections: options.maxConnections || 1000,
            pingInterval: options.pingInterval || 30000,
            rateLimits: options.rateLimits
        };
        this.wss = new ws_1.WebSocketServer({
            port: this.options.port,
            host: this.options.host
        });
        this.setupServer();
        this.startPingInterval();
        if (this.options.rateLimits) {
            this.rateLimiter = (0, rate_limiter_js_1.createRateLimiter)({
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
            socket.clientId = (0, uuid_1.v4)();
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
            if (nostrSocket.readyState === ws_1.WebSocket.OPEN) {
                nostrSocket.close();
            }
        });
        this.wss.close();
    }
}
exports.NostrWSServer = NostrWSServer;
//# sourceMappingURL=server.js.map