"use strict";
/**
 * @file NIP-01: Basic protocol flow implementation
 * @module nips/nip-01
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessage = validateMessage;
exports.createEventMessage = createEventMessage;
exports.createReqMessage = createReqMessage;
exports.createCloseMessage = createCloseMessage;
exports.createNoticeMessage = createNoticeMessage;
exports.validateEvent = validateEvent;
const logger_js_1 = require("../utils/logger.js");
const messages_js_1 = require("../types/messages.js");
const logger = (0, logger_js_1.getLogger)('NIP-01');
/**
 * Validates a message according to NIP-01 specifications
 */
function validateMessage(message) {
    if (!message || !Array.isArray(message)) {
        logger.debug('Invalid message format');
        return false;
    }
    if (!message[0] || !(message[0] in messages_js_1.MESSAGE_TYPES)) {
        logger.debug(`Invalid message type: ${message[0]}`);
        return false;
    }
    if (!message[1] || typeof message[1] !== 'object') {
        logger.debug('Invalid message data');
        return false;
    }
    // Message type specific validation
    if (message[0] === messages_js_1.MESSAGE_TYPES.EVENT) {
        if (!validateEvent(message[1]).valid) {
            return false;
        }
    }
    if (message[0] === messages_js_1.MESSAGE_TYPES.REQ) {
        if (!validateReqMessage(message)) {
            return false;
        }
    }
    if (message[0] === messages_js_1.MESSAGE_TYPES.CLOSE) {
        if (!validateCloseMessage(message)) {
            return false;
        }
    }
    return true;
}
/**
 * Creates an EVENT message
 */
function createEventMessage(event) {
    return [messages_js_1.MESSAGE_TYPES.EVENT, event];
}
/**
 * Creates a REQ message
 */
function createReqMessage(subscriptionId, filters) {
    return [messages_js_1.MESSAGE_TYPES.REQ, {
            subscription_id: subscriptionId,
            filters
        }];
}
/**
 * Creates a CLOSE message
 */
function createCloseMessage(subscriptionId) {
    return [messages_js_1.MESSAGE_TYPES.CLOSE, {
            subscription_id: subscriptionId
        }];
}
/**
 * Creates a NOTICE message
 */
function createNoticeMessage(message) {
    return [messages_js_1.MESSAGE_TYPES.NOTICE, {
            message
        }];
}
/**
 * Validates a Nostr event according to NIP-01
 */
function validateEvent(event) {
    if (typeof event !== 'object' || !event) {
        return { valid: false, error: 'Event must be an object' };
    }
    const typedEvent = event;
    if (!typedEvent.id || typeof typedEvent.id !== 'string') {
        return { valid: false, error: 'Event must have a string id' };
    }
    if (!typedEvent.pubkey || typeof typedEvent.pubkey !== 'string') {
        return { valid: false, error: 'Event must have a string pubkey' };
    }
    if (!typedEvent.created_at || typeof typedEvent.created_at !== 'number') {
        return { valid: false, error: 'Event must have a number created_at' };
    }
    if (!typedEvent.kind || typeof typedEvent.kind !== 'number') {
        return { valid: false, error: 'Event must have a number kind' };
    }
    if (!Array.isArray(typedEvent.tags)) {
        return { valid: false, error: 'Event must have an array of tags' };
    }
    if (!typedEvent.content || typeof typedEvent.content !== 'string') {
        return { valid: false, error: 'Event must have a string content' };
    }
    if (!typedEvent.sig || typeof typedEvent.sig !== 'string') {
        return { valid: false, error: 'Event must have a string sig' };
    }
    // Validate tag structure
    for (const tag of typedEvent.tags) {
        if (!Array.isArray(tag) || tag.length === 0) {
            return { valid: false, error: 'Each tag must be a non-empty array' };
        }
        if (typeof tag[0] !== 'string') {
            return { valid: false, error: 'Tag identifier must be a string' };
        }
    }
    return { valid: true };
}
// Private helper functions
function validateReqMessage(message) {
    const { subscription_id, filters } = message[1];
    if (!subscription_id || typeof subscription_id !== 'string') {
        logger.debug('Invalid subscription_id');
        return false;
    }
    if (!Array.isArray(filters)) {
        logger.debug('Invalid filters format');
        return false;
    }
    return true;
}
function validateCloseMessage(message) {
    const { subscription_id } = message[1];
    if (!subscription_id || typeof subscription_id !== 'string') {
        logger.debug('Invalid subscription_id');
        return false;
    }
    return true;
}
//# sourceMappingURL=nip-01.js.map