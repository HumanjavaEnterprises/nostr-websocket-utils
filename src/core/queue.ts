/**
 * @file Message queue implementation for WebSocket communication
 * @module core/queue
 */

import { NostrWSMessage, MessagePriority } from '../types/messages';
import { getLogger } from '../utils/logger';

const logger = getLogger('queue');

/**
 * Options for message queue configuration
 */
interface QueueOptions {
  maxSize?: number;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Message queue implementation with priority handling and retry logic
 */
export class MessageQueue {
  private queue: NostrWSMessage[] = [];
  private maxSize: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor(options: QueueOptions = {}) {
    this.maxSize = options.maxSize || 1000;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  /**
   * Adds a message to the queue with priority handling
   * @param message Message to enqueue
   * @returns true if message was added, false if queue is full
   */
  enqueue(message: NostrWSMessage): boolean {
    if (this.queue.length >= this.maxSize) {
      logger.warn({ message }, 'Queue is full, message dropped');
      return false;
    }

    const queuedMessage = {
      ...message,
      priority: message.priority || MessagePriority.MEDIUM,
      queuedAt: Date.now(),
      retryCount: 0
    };

    // Insert message in priority order
    const insertIndex = this.queue.findIndex(
      m => (m.priority || MessagePriority.MEDIUM) > queuedMessage.priority!
    );

    if (insertIndex === -1) {
      this.queue.push(queuedMessage);
    } else {
      this.queue.splice(insertIndex, 0, queuedMessage);
    }

    logger.debug({ message: queuedMessage }, 'Message enqueued');
    return true;
  }

  /**
   * Gets the next message from the queue
   * @returns Next message or undefined if queue is empty
   */
  dequeue(): NostrWSMessage | undefined {
    return this.queue.shift();
  }

  /**
   * Handles message retry logic
   * @param message Message that failed to send
   * @returns true if message was requeued, false if max retries exceeded
   */
  async retry(message: NostrWSMessage): Promise<boolean> {
    const retryCount = (message.retryCount || 0) + 1;
    
    if (retryCount > this.maxRetries) {
      logger.warn({ message }, 'Max retries exceeded, message dropped');
      return false;
    }

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, this.retryDelay * retryCount));

    return this.enqueue({
      ...message,
      retryCount,
      queuedAt: Date.now()
    });
  }

  /**
   * Gets the current size of the queue
   */
  get size(): number {
    return this.queue.length;
  }

  /**
   * Clears all messages from the queue
   */
  clear(): void {
    this.queue = [];
    logger.info('Queue cleared');
  }

  /**
   * Gets messages that have been in the queue longer than the specified duration
   * @param duration Duration in milliseconds
   * @returns Array of stale messages
   */
  getStaleMessages(duration: number): NostrWSMessage[] {
    const now = Date.now();
    return this.queue.filter(
      message => message.queuedAt && (now - message.queuedAt) > duration
    );
  }

  /**
   * Removes messages that have been in the queue longer than the specified duration
   * @param duration Duration in milliseconds
   * @returns Number of messages removed
   */
  removeStaleMessages(duration: number): number {
    const now = Date.now();
    const initialSize = this.queue.length;
    
    this.queue = this.queue.filter(
      message => message.queuedAt && (now - message.queuedAt) <= duration
    );

    const removedCount = initialSize - this.queue.length;
    if (removedCount > 0) {
      logger.info({ removedCount }, 'Stale messages removed from queue');
    }
    
    return removedCount;
  }
}
