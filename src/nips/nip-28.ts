/**
 * @file NIP-28: Public Chat
 * @module nips/nip-28
 * @see https://github.com/nostr-protocol/nips/blob/master/28.md
 */

import type { NostrWSMessage } from '../types/messages';
import type { Logger } from '../types/logger';

/**
 * Chat event kinds
 */
export const ChatEventKinds = {
  CHANNEL_CREATION: 40,
  CHANNEL_METADATA: 41,
  CHANNEL_MESSAGE: 42,
  CHANNEL_HIDE_MESSAGE: 43,
  CHANNEL_MUTE_USER: 44,
  USER_MUTE: 45
} as const;

/**
 * Channel metadata structure
 */
export interface ChannelMetadata {
  name: string;
  about?: string;
  picture?: string;
  rules?: string[];
  moderators?: string[];
  pinned?: string[];
}

/**
 * Creates a channel creation message
 * @param metadata - Channel metadata
 * @returns {NostrWSMessage} Channel creation event
 */
export function createChannelCreationEvent(
  metadata: ChannelMetadata
): NostrWSMessage {
  return ['EVENT', {
    kind: ChatEventKinds.CHANNEL_CREATION,
    content: JSON.stringify(metadata),
    tags: []
  }];
}

/**
 * Creates a channel message
 * @param channelId - Channel ID
 * @param content - Message content
 * @param replyTo - Optional ID of message being replied to
 * @returns {NostrWSMessage} Channel message event
 */
export function createChannelMessage(
  channelId: string,
  content: string,
  replyTo?: string
): NostrWSMessage {
  const tags = [['e', channelId, '', 'root']];
  if (replyTo) {
    tags.push(['e', replyTo, '', 'reply']);
  }

  return ['EVENT', {
    kind: ChatEventKinds.CHANNEL_MESSAGE,
    content,
    tags
  }];
}

/**
 * Creates a message moderation event
 * @param channelId - Channel ID
 * @param messageId - Message ID to moderate
 * @param reason - Moderation reason
 * @returns {NostrWSMessage} Hide message event
 */
export function createHideMessageEvent(
  channelId: string,
  messageId: string,
  reason: string
): NostrWSMessage {
  return ['EVENT', {
    kind: ChatEventKinds.CHANNEL_HIDE_MESSAGE,
    content: reason,
    tags: [
      ['e', channelId, '', 'root'],
      ['e', messageId, '', 'reply']
    ]
  }];
}

/**
 * Chat message handler interface
 */
export interface ChatMessageHandler {
  /**
   * Handles incoming chat message
   * @param message - Chat message
   * @returns {Promise<void>}
   */
  handleMessage(message: NostrWSMessage): Promise<void>;

  /**
   * Handles message moderation
   * @param message - Moderation message
   * @returns {Promise<void>}
   */
  handleModeration(message: NostrWSMessage): Promise<void>;
}

/**
 * Creates a chat message handler
 * @param logger - Logger instance
 * @returns {ChatMessageHandler} Message handler
 */
export function createChatMessageHandler(logger: Logger): ChatMessageHandler {
  return {
    async handleMessage(message: NostrWSMessage): Promise<void> {
      try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') return;

        const event = message[1] as NostrEvent;
        if (event.kind !== ChatEventKinds.CHANNEL_MESSAGE) return;

        // Extract channel ID and reply ID from tags
        const { tags } = event;
        const channelId = tags.find(tag => 
          tag[0] === 'e' && tag[3] === 'root'
        )?.[1];

        const replyId = tags.find(tag =>
          tag[0] === 'e' && tag[3] === 'reply'
        )?.[1];

        // Process message
        logger.debug('Processing chat message', {
          channelId,
          replyId,
          content: event.content
        });

        // Additional message processing logic here
      } catch (error) {
        logger.error('Error handling chat message:', error);
      }
    },

    async handleModeration(message: NostrWSMessage): Promise<void> {
      try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') return;

        const event = message[1] as NostrEvent;
        if (event.kind !== ChatEventKinds.CHANNEL_HIDE_MESSAGE) return;

        // Extract channel and message IDs
        const { tags } = event;
        const channelId = tags.find(tag =>
          tag[0] === 'e' && tag[3] === 'root'
        )?.[1];

        const messageId = tags.find(tag =>
          tag[0] === 'e' && tag[3] === 'reply'
        )?.[1];

        // Process moderation
        logger.debug('Processing message moderation', {
          channelId,
          messageId,
          reason: event.content
        });

        // Additional moderation logic here
      } catch (error) {
        logger.error('Error handling message moderation:', error);
      }
    }
  };
}

/**
 * Channel subscription manager interface
 */
export interface ChannelSubscriptionManager {
  /**
   * Subscribes to a channel
   * @param channelId - Channel ID
   * @returns {NostrWSMessage} Subscription message
   */
  subscribe(channelId: string): NostrWSMessage;

  /**
   * Unsubscribes from a channel
   * @param channelId - Channel ID
   * @returns {NostrWSMessage} Unsubscribe message
   */
  unsubscribe(channelId: string): NostrWSMessage;

  /**
   * Gets channel metadata
   * @param channelId - Channel ID
   * @returns {Promise<ChannelMetadata | undefined>} Channel metadata
   */
  getMetadata(channelId: string): Promise<ChannelMetadata | undefined>;
}

/**
 * Creates a channel subscription manager
 * @param logger - Logger instance
 * @returns {ChannelSubscriptionManager} Subscription manager
 */
export function createChannelSubscriptionManager(
  logger: Logger
): ChannelSubscriptionManager {
  const subscriptions = new Map<string, string>(); // channelId -> subscriptionId
  const metadata = new Map<string, ChannelMetadata>();

  return {
    subscribe(channelId: string): NostrWSMessage {
      const subscriptionId = `chat:${channelId}:${Date.now()}`;
      subscriptions.set(channelId, subscriptionId);

      return ['REQ', {
        subscription_id: subscriptionId,
        filter: {
          kinds: [
            ChatEventKinds.CHANNEL_MESSAGE,
            ChatEventKinds.CHANNEL_HIDE_MESSAGE
          ],
          '#e': [channelId]
        }
      }];
    },

    unsubscribe(channelId: string): NostrWSMessage {
      const subscriptionId = subscriptions.get(channelId);
      if (!subscriptionId) {
        logger.debug(`No subscription found for channel ${channelId}`);
        return ['CLOSE', { subscription_id: '' }];
      }

      subscriptions.delete(channelId);
      return ['CLOSE', { subscription_id: subscriptionId }];
    },

    async getMetadata(channelId: string): Promise<ChannelMetadata | undefined> {
      return metadata.get(channelId);
    }
  };
}

interface NostrEvent {
  kind: number;
  content: string;
  tags: string[][];
}
