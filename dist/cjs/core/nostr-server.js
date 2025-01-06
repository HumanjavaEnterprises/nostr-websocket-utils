"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostrWSServer = void 0;
exports.createWSServer = createWSServer;
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.getLogger)('NostrWSServer');
/**
 * Represents a Nostr WebSocket server
 */
class NostrWSServer {
    /**
     * Creates a new Nostr WebSocket server instance
     *
     * @param {NostrWSServerOptions} options - Server configuration options
     */
    constructor(options) {
        this.server = new ws_1.WebSocketServer({
            port: options.port,
            host: options.host
        });
        /**
         * Handles incoming WebSocket connections
         *
         * @param {WebSocket} ws - The connected WebSocket client
         */
        this.server.on('connection', async (ws) => {
            const socket = ws;
            socket.clientId = (0, uuid_1.v4)();
            socket.subscriptions = new Set();
            socket.isAlive = true;
            logger.info(`Client connected: ${socket.clientId}`);
            /**
             * Calls the onConnection handler if provided
             */
            await options.onConnection?.(socket);
            /**
             * Handles incoming messages from the client
             *
             * @param {Buffer} data - The incoming message data
             */
            socket.on('message', async (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    logger.info('Received message:', message);
                    /**
                     * Calls the onMessage handler if provided
                     */
                    await options.onMessage?.(message, socket);
                }
                catch (error) {
                    logger.error('Error processing message:', error);
                    /**
                     * Calls the onError handler if provided
                     */
                    options.onError?.(error, socket);
                }
            });
            /**
             * Handles WebSocket errors
             *
             * @param {Error} error - The error that occurred
             */
            socket.on('error', (error) => {
                logger.error(`Client error (${socket.clientId}):`, error);
                /**
                 * Calls the onError handler if provided
                 */
                options.onError?.(error, socket);
            });
            /**
             * Handles client disconnections
             */
            socket.on('close', () => {
                logger.info(`Client disconnected: ${socket.clientId}`);
                /**
                 * Calls the onClose handler if provided
                 */
                options.onClose?.(socket);
            });
        });
    }
    /**
     * Closes the WebSocket server
     */
    stop() {
        this.server.close();
    }
}
exports.NostrWSServer = NostrWSServer;
/**
 * Creates a new Nostr WebSocket server instance
 *
 * @param {NostrWSServerOptions} options - Server configuration options
 * @returns {NostrWSServer} The created server instance
 */
function createWSServer(options) {
    return new NostrWSServer(options);
}
//# sourceMappingURL=nostr-server.js.map