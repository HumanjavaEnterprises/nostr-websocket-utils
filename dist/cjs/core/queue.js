"use strict";
/**
 * @file Message queue implementation
 * @module core/queue
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueue = void 0;
const index_js_1 = require("../types/index.js");
const logger_js_1 = require("../utils/logger.js");
/**
 * Message queue implementation for handling WebSocket messages
 */
class MessageQueue {
    constructor(sender, options = {}) {
        this.sender = sender;
        this.options = options;
        this.queue = [];
        this.processing = false;
        this.logger = (0, logger_js_1.createLogger)('MessageQueue');
    }
    /**
     * Add a message to the queue
     */
    async enqueue(message) {
        if (this.options.maxSize &&
            this.queue.length >= this.options.maxSize) {
            throw new Error('Queue is full');
        }
        const [type, ...data] = message;
        const queueItem = {
            type,
            data: data.length === 1 ? data[0] : data,
            priority: index_js_1.MessagePriority.NORMAL,
            queuedAt: Date.now(),
            retryCount: 0
        };
        this.queue.push(queueItem);
        this.queue.sort((a, b) => (a.priority === b.priority) ?
            (a.queuedAt - b.queuedAt) :
            (a.priority === index_js_1.MessagePriority.HIGH ? -1 : 1));
        if (!this.processing) {
            this.processQueue().catch(error => {
                this.logger.error({ error }, 'Error processing queue');
            });
        }
    }
    /**
     * Process messages in the queue
     */
    async processQueue() {
        if (this.processing || this.queue.length === 0) {
            return;
        }
        this.processing = true;
        try {
            while (this.queue.length > 0) {
                const item = this.queue[0];
                const message = [item.type, item.data];
                try {
                    await this.sender(message);
                    this.queue.shift();
                }
                catch (error) {
                    this.logger.error({ error, message }, 'Failed to send message');
                    if (this.options.maxRetries &&
                        item.retryCount >= this.options.maxRetries) {
                        this.logger.warn({ message }, 'Max retries reached, removing message from queue');
                        this.queue.shift();
                        continue;
                    }
                    item.retryCount++;
                    await new Promise(resolve => setTimeout(resolve, this.options.retryDelay || 1000));
                }
            }
        }
        finally {
            this.processing = false;
        }
        // Clean up stale messages
        if (this.options.staleTimeout) {
            const now = Date.now();
            const staleTimeout = this.options.staleTimeout;
            this.queue.forEach((message, index) => {
                if (now - message.queuedAt > staleTimeout) {
                    this.logger.warn({ message }, 'Message is stale, removing from queue');
                    this.queue.splice(index, 1);
                }
            });
        }
    }
    /**
     * Get the current size of the queue
     */
    getSize() {
        return this.queue.length;
    }
    /**
     * Clear all messages from the queue
     */
    clear() {
        this.queue.length = 0;
    }
}
exports.MessageQueue = MessageQueue;
//# sourceMappingURL=queue.js.map