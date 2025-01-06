"use strict";
/**
 * @file NIP-28: Public Chat
 * @module nips/nip-28
 * @see https://github.com/nostr-protocol/nips/blob/master/28.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEventKinds = void 0;
exports.createChannelCreationEvent = createChannelCreationEvent;
exports.createChannelMessage = createChannelMessage;
exports.createHideMessageEvent = createHideMessageEvent;
exports.createChatMessageHandler = createChatMessageHandler;
exports.createChannelSubscriptionManager = createChannelSubscriptionManager;
/**
 * Chat event kinds
 */
exports.ChatEventKinds = {
    CHANNEL_CREATION: 40,
    CHANNEL_METADATA: 41,
    CHANNEL_MESSAGE: 42,
    CHANNEL_HIDE_MESSAGE: 43,
    CHANNEL_MUTE_USER: 44,
    USER_MUTE: 45
};
/**
 * Creates a channel creation message
 * @param metadata - Channel metadata
 * @returns {NostrWSMessage} Channel creation event
 */
function createChannelCreationEvent(metadata) {
    return ['EVENT', {
            kind: exports.ChatEventKinds.CHANNEL_CREATION,
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
function createChannelMessage(channelId, content, replyTo) {
    const tags = [['e', channelId, '', 'root']];
    if (replyTo) {
        tags.push(['e', replyTo, '', 'reply']);
    }
    return ['EVENT', {
            kind: exports.ChatEventKinds.CHANNEL_MESSAGE,
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
function createHideMessageEvent(channelId, messageId, reason) {
    return ['EVENT', {
            kind: exports.ChatEventKinds.CHANNEL_HIDE_MESSAGE,
            content: reason,
            tags: [
                ['e', channelId, '', 'root'],
                ['e', messageId, '', 'reply']
            ]
        }];
}
/**
 * Creates a chat message handler
 * @param logger - Logger instance
 * @returns {ChatMessageHandler} Message handler
 */
function createChatMessageHandler(logger) {
    return {
        async handleMessage(message) {
            try {
                if (!Array.isArray(message) || message[0] !== 'EVENT')
                    return;
                const event = message[1];
                if (event.kind !== exports.ChatEventKinds.CHANNEL_MESSAGE)
                    return;
                // Extract channel ID and reply ID from tags
                const { tags } = event;
                const channelId = tags.find(tag => tag[0] === 'e' && tag[3] === 'root')?.[1];
                const replyId = tags.find(tag => tag[0] === 'e' && tag[3] === 'reply')?.[1];
                // Process message
                logger.debug('Processing chat message', {
                    channelId,
                    replyId,
                    content: event.content
                });
                // Additional message processing logic here
            }
            catch (error) {
                logger.error('Error handling chat message:', error);
            }
        },
        async handleModeration(message) {
            try {
                if (!Array.isArray(message) || message[0] !== 'EVENT')
                    return;
                const event = message[1];
                if (event.kind !== exports.ChatEventKinds.CHANNEL_HIDE_MESSAGE)
                    return;
                // Extract channel and message IDs
                const { tags } = event;
                const channelId = tags.find(tag => tag[0] === 'e' && tag[3] === 'root')?.[1];
                const messageId = tags.find(tag => tag[0] === 'e' && tag[3] === 'reply')?.[1];
                // Process moderation
                logger.debug('Processing message moderation', {
                    channelId,
                    messageId,
                    reason: event.content
                });
                // Additional moderation logic here
            }
            catch (error) {
                logger.error('Error handling message moderation:', error);
            }
        }
    };
}
/**
 * Creates a channel subscription manager
 * @param logger - Logger instance
 * @returns {ChannelSubscriptionManager} Subscription manager
 */
function createChannelSubscriptionManager(logger) {
    const subscriptions = new Map(); // channelId -> subscriptionId
    const metadata = new Map();
    return {
        subscribe(channelId) {
            const subscriptionId = `chat:${channelId}:${Date.now()}`;
            subscriptions.set(channelId, subscriptionId);
            return ['REQ', {
                    subscription_id: subscriptionId,
                    filter: {
                        kinds: [
                            exports.ChatEventKinds.CHANNEL_MESSAGE,
                            exports.ChatEventKinds.CHANNEL_HIDE_MESSAGE
                        ],
                        '#e': [channelId]
                    }
                }];
        },
        unsubscribe(channelId) {
            const subscriptionId = subscriptions.get(channelId);
            if (!subscriptionId) {
                logger.debug(`No subscription found for channel ${channelId}`);
                return ['CLOSE', { subscription_id: '' }];
            }
            subscriptions.delete(channelId);
            return ['CLOSE', { subscription_id: subscriptionId }];
        },
        async getMetadata(channelId) {
            return metadata.get(channelId);
        }
    };
}
//# sourceMappingURL=nip-28.js.map