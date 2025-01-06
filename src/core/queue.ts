/**
 * @file Message queue implementation
 * @module core/queue
 */

import { NostrWSMessage, MessagePriority, QueueItem } from '../types/index.js';
import { createLogger } from '../utils/logger.js';
import { Logger } from 'pino';

/**
 * Message queue implementation for handling WebSocket messages
 */
export class MessageQueue {
  private readonly queue: QueueItem[] = [];
  private readonly logger: Logger;
  private processing = false;

  constructor(
    private readonly sender: (message: NostrWSMessage) => Promise<void>,
    private readonly options: {
      maxSize?: number;
      maxRetries?: number;
      retryDelay?: number;
      staleTimeout?: number;
    } = {}
  ) {
    this.logger = createLogger('MessageQueue');
  }

  /**
   * Add a message to the queue
   */
  async enqueue(message: NostrWSMessage): Promise<void> {
    if (
      this.options.maxSize &&
      this.queue.length >= this.options.maxSize
    ) {
      throw new Error('Queue is full');
    }

    const [type, ...data] = message;
    const queueItem: QueueItem = {
      type,
      data: data.length === 1 ? data[0] : data,
      priority: MessagePriority.NORMAL,
      queuedAt: Date.now(),
      retryCount: 0
    };

    this.queue.push(queueItem);
    this.queue.sort((a, b) => 
      (a.priority === b.priority) ? 
        (a.queuedAt - b.queuedAt) : 
        (a.priority === MessagePriority.HIGH ? -1 : 1)
    );

    if (!this.processing) {
      this.processQueue().catch(error => {
        this.logger.error({ error }, 'Error processing queue');
      });
    }
  }

  /**
   * Process messages in the queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    try {
      while (this.queue.length > 0) {
        const item = this.queue[0];
        const message: NostrWSMessage = [item.type, item.data];

        try {
          await this.sender(message);
          this.queue.shift();
        } catch (error) {
          this.logger.error({ error, message }, 'Failed to send message');

          if (
            this.options.maxRetries &&
            item.retryCount >= this.options.maxRetries
          ) {
            this.logger.warn(
              { message },
              'Max retries reached, removing message from queue'
            );
            this.queue.shift();
            continue;
          }

          item.retryCount++;
          await new Promise(resolve =>
            setTimeout(resolve, this.options.retryDelay || 1000)
          );
        }
      }
    } finally {
      this.processing = false;
    }

    // Clean up stale messages
    if (this.options.staleTimeout) {
      const now = Date.now();
      const staleTimeout = this.options.staleTimeout;
      this.queue.forEach((message, index) => {
        if (now - message.queuedAt > staleTimeout) {
          this.logger.warn(
            { message },
            'Message is stale, removing from queue'
          );
          this.queue.splice(index, 1);
        }
      });
    }
  }

  /**
   * Get the current size of the queue
   */
  getSize(): number {
    return this.queue.length;
  }

  /**
   * Clear all messages from the queue
   */
  clear(): void {
    this.queue.length = 0;
  }
}
