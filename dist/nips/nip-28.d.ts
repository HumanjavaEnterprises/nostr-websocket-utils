/**
 * @file NIP-28: Public Chat
 * @module nips/nip-28
 * @see https://github.com/nostr-protocol/nips/blob/master/28.md
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
/**
 * Chat event kinds
 */
export declare const ChatEventKinds: {
    readonly CHANNEL_CREATION: 40;
    readonly CHANNEL_METADATA: 41;
    readonly CHANNEL_MESSAGE: 42;
    readonly CHANNEL_HIDE_MESSAGE: 43;
    readonly CHANNEL_MUTE_USER: 44;
    readonly USER_MUTE: 45;
};
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
export declare function createChannelCreationEvent(metadata: ChannelMetadata): NostrWSMessage;
/**
 * Creates a channel message
 * @param channelId - Channel ID
 * @param content - Message content
 * @param replyTo - Optional ID of message being replied to
 * @returns {NostrWSMessage} Channel message event
 */
export declare function createChannelMessage(channelId: string, content: string, replyTo?: string): NostrWSMessage;
/**
 * Creates a message moderation event
 * @param channelId - Channel ID
 * @param messageId - Message ID to moderate
 * @param reason - Moderation reason
 * @returns {NostrWSMessage} Hide message event
 */
export declare function createHideMessageEvent(channelId: string, messageId: string, reason: string): NostrWSMessage;
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
export declare function createChatMessageHandler(logger: Logger): ChatMessageHandler;
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
export declare function createChannelSubscriptionManager(logger: Logger): ChannelSubscriptionManager;
//# sourceMappingURL=nip-28.d.ts.map