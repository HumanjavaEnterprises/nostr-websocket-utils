"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NostrWSClient = void 0;
const ws_1 = __importDefault(require("ws"));
const index_js_1 = require("../types/index.js");
const queue_js_1 = require("./queue.js");
const logger_js_1 = require("../utils/logger.js");
/**
 * NostrWSClient handles WebSocket connections to Nostr relays
 */
class NostrWSClient {
    constructor(relayUrls, options = {}) {
        this.relayUrls = relayUrls;
        this.options = options;
        this.ws = null;
        this.connectionState = index_js_1.ConnectionState.DISCONNECTED;
        this.reconnectAttempts = 0;
        this.reconnectTimeout = null;
        this.logger = options.logger || (0, logger_js_1.createLogger)('NostrWSClient');
        this.queue = new queue_js_1.MessageQueue(async (message) => {
            if (!this.ws || this.connectionState !== index_js_1.ConnectionState.CONNECTED) {
                throw new Error('Not connected to relay');
            }
            try {
                this.ws.send(JSON.stringify(message));
                this.logger.debug({ message }, 'Message sent');
            }
            catch (error) {
                this.logger.error({ error, message }, 'Failed to send message');
                throw error;
            }
        }, {
            maxSize: options.queueSize,
            maxRetries: options.maxRetries,
            retryDelay: options.retryDelay
        });
    }
    /**
     * Connect to the relay
     */
    async connect() {
        if (this.connectionState === index_js_1.ConnectionState.CONNECTED) {
            this.logger.debug('Already connected');
            return;
        }
        if (this.connectionState === index_js_1.ConnectionState.CONNECTING) {
            this.logger.debug('Connection already in progress');
            return;
        }
        this.connectionState = index_js_1.ConnectionState.CONNECTING;
        try {
            const url = this.relayUrls[0]; // For now just use first relay
            this.ws = new ws_1.default(url);
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, this.options.connectionTimeout || 5000);
                this.ws.on('open', () => {
                    clearTimeout(timeout);
                    this.connectionState = index_js_1.ConnectionState.CONNECTED;
                    this.reconnectAttempts = 0;
                    this.logger.info('Connected to relay');
                    resolve();
                });
                this.ws.on('error', (error) => {
                    clearTimeout(timeout);
                    this.logger.error({ error }, 'WebSocket error');
                    if (this.options.onError) {
                        this.options.onError(error);
                    }
                    reject(error);
                });
                this.ws.on('close', () => {
                    this.handleDisconnect();
                });
                this.ws.on('message', (data) => {
                    this.handleMessage(data);
                });
            });
        }
        catch (error) {
            this.logger.error({ error }, 'Failed to connect');
            this.handleDisconnect();
            throw error;
        }
    }
    /**
     * Disconnect from the relay
     */
    async disconnect() {
        if (this.connectionState === index_js_1.ConnectionState.DISCONNECTED) {
            this.logger.debug('Already disconnected');
            return;
        }
        this.connectionState = index_js_1.ConnectionState.DISCONNECTED;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.logger.info('Disconnected from relay');
    }
    /**
     * Send a message to the relay
     */
    async sendMessage(message) {
        if (this.connectionState !== index_js_1.ConnectionState.CONNECTED) {
            throw new Error('Not connected to relay');
        }
        await this.queue.enqueue(message);
    }
    handleMessage(data) {
        try {
            const message = JSON.parse(data.toString());
            this.logger.debug({ message }, 'Received message');
            if (this.options.onMessage) {
                this.options.onMessage(data.toString());
            }
        }
        catch (error) {
            this.logger.error({ error, data }, 'Failed to parse message');
            if (this.options.onError) {
                this.options.onError(error);
            }
        }
    }
    handleDisconnect() {
        this.connectionState = index_js_1.ConnectionState.DISCONNECTED;
        this.ws = null;
        if (this.options.retryAttempts &&
            this.reconnectAttempts < this.options.retryAttempts) {
            this.connectionState = index_js_1.ConnectionState.RECONNECTING;
            this.reconnectAttempts++;
            const delay = this.options.retryDelay || 1000;
            this.logger.info({ attempt: this.reconnectAttempts, maxAttempts: this.options.retryAttempts }, `Reconnecting in ${delay}ms`);
            this.reconnectTimeout = setTimeout(() => {
                this.connect().catch(error => {
                    this.logger.error({ error }, 'Reconnection failed');
                });
            }, delay);
        }
        else {
            this.logger.warn('Max reconnection attempts reached');
            this.connectionState = index_js_1.ConnectionState.FAILED;
        }
    }
    /**
     * Get the current connection state
     */
    getConnectionState() {
        return this.connectionState;
    }
}
exports.NostrWSClient = NostrWSClient;
//# sourceMappingURL=client.js.map