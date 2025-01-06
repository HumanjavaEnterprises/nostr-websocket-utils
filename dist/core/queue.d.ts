/**
 * @file Message queue implementation
 * @module core/queue
 */
import { NostrWSMessage } from '../types/index.js';
/**
 * Message queue implementation for handling WebSocket messages
 */
export declare class MessageQueue {
    private readonly sender;
    private readonly options;
    private readonly queue;
    private readonly logger;
    private processing;
    constructor(sender: (message: NostrWSMessage) => Promise<void>, options?: {
        maxSize?: number;
        maxRetries?: number;
        retryDelay?: number;
        staleTimeout?: number;
    });
    /**
     * Add a message to the queue
     */
    enqueue(message: NostrWSMessage): Promise<void>;
    /**
     * Process messages in the queue
     */
    private processQueue;
    /**
     * Get the current size of the queue
     */
    getSize(): number;
    /**
     * Clear all messages from the queue
     */
    clear(): void;
}
//# sourceMappingURL=queue.d.ts.map