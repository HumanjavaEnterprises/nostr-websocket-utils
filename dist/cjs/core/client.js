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
        // Failover: try each relay URL in turn (rotating the starting index on
        // reconnect attempts so a persistently-down first relay doesn't block B/C).
        const count = this.relayUrls.length;
        const start = count > 0 ? this.reconnectAttempts % count : 0;
        let lastError;
        for (let i = 0; i < count; i++) {
            const url = this.relayUrls[(start + i) % count];
            try {
                await this.connectTo(url);
                return; // connected successfully
            }
            catch (error) {
                lastError = error;
                this.logger.warn({ url, error }, 'Relay connection attempt failed, trying next');
            }
        }
        this.logger.error({ error: lastError }, 'Failed to connect to any relay');
        this.handleDisconnect();
        throw lastError instanceof Error ? lastError : new Error('Failed to connect to any relay');
    }
    /**
     * Attempt a connection to a single relay URL.
     */
    async connectTo(url) {
        if (url.startsWith('ws://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
            console.warn('[nostr-websocket] WARNING: Connecting over plaintext ws:// — messages are not encrypted');
        }
        const ws = new ws_1.default(url);
        this.ws = ws;
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Connection timeout'));
            }, this.options.connectionTimeout || 5000);
            ws.on('open', () => {
                clearTimeout(timeout);
                this.connectionState = index_js_1.ConnectionState.CONNECTED;
                this.reconnectAttempts = 0;
                this.logger.info({ url }, 'Connected to relay');
                resolve();
            });
            ws.on('error', (error) => {
                clearTimeout(timeout);
                this.logger.error({ error, url }, 'WebSocket error');
                if (this.options.onError) {
                    this.options.onError(error);
                }
                reject(error);
            });
            ws.on('close', () => {
                this.handleDisconnect();
            });
            ws.on('message', (data) => {
                this.handleMessage(data);
            });
        });
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
        // Allow buffering while CONNECTED/CONNECTING/RECONNECTING so the message
        // queue can hold messages across a disconnect (its sender-retry loop flushes
        // them once the socket is open again). Only reject when there is no path to
        // a connection.
        if (this.connectionState === index_js_1.ConnectionState.DISCONNECTED ||
            this.connectionState === index_js_1.ConnectionState.FAILED) {
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
            const baseDelay = this.options.retryDelay || 1000;
            const maxDelay = 30000; // 30 second cap
            const delay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts), maxDelay);
            const jitter = delay * 0.1 * Math.random(); // 10% jitter
            const totalDelay = delay + jitter;
            this.logger.info({ attempt: this.reconnectAttempts, maxAttempts: this.options.retryAttempts, delay: Math.round(totalDelay) }, `Reconnecting in ${Math.round(totalDelay)}ms`);
            this.reconnectTimeout = setTimeout(() => {
                this.connect().catch(error => {
                    this.logger.error({ error }, 'Reconnection failed');
                });
            }, totalDelay);
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