"use strict";
/**
 * @file NIP-01: Basic protocol flow implementation
 * @module nips/nip-01
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 *
 * All builders emit spec-shaped positional arrays exactly as they appear on the
 * wire, e.g. ["REQ", <subId>, <filter1>, <filter2>...], ["CLOSE", <subId>],
 * ["NOTICE", <message>]. Do NOT wrap arguments in an object — real relays
 * (strfry / nostream / Damus-compatible) reject the object form.
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
const HEX_64 = /^[0-9a-f]{64}$/;
const HEX_128 = /^[0-9a-f]{128}$/;
/**
 * Validates a message according to NIP-01 wire specifications.
 * Accepts both client->relay messages (EVENT / REQ / CLOSE) and
 * relay->client control messages (NOTICE / EOSE / OK / CLOSED) whose
 * second element is a string or boolean rather than an object.
 */
function validateMessage(message) {
    if (!message || !Array.isArray(message)) {
        logger.debug('Invalid message format');
        return false;
    }
    const type = message[0];
    if (!type || !(type in messages_js_1.MESSAGE_TYPES)) {
        logger.debug(`Invalid message type: ${type}`);
        return false;
    }
    switch (type) {
        case messages_js_1.MESSAGE_TYPES.EVENT:
            // ["EVENT", <event>] (client->relay) or ["EVENT", <subId>, <event>] (relay->client)
            if (message.length === 3) {
                return validateEvent(message[2]).valid;
            }
            return validateEvent(message[1]).valid;
        case messages_js_1.MESSAGE_TYPES.REQ:
            return validateReqMessage(message);
        case messages_js_1.MESSAGE_TYPES.CLOSE:
            return validateCloseMessage(message);
        case messages_js_1.MESSAGE_TYPES.NOTICE:
            // ["NOTICE", <message>]
            return typeof message[1] === 'string';
        case messages_js_1.MESSAGE_TYPES.EOSE:
            // ["EOSE", <subId>]
            return typeof message[1] === 'string';
        case messages_js_1.MESSAGE_TYPES.OK:
            // ["OK", <eventId>, <boolean>, <message>]
            return (typeof message[1] === 'string' &&
                typeof message[2] === 'boolean' &&
                (message[3] === undefined || typeof message[3] === 'string'));
        case messages_js_1.MESSAGE_TYPES.CLOSED:
            // ["CLOSED", <subId>, <message>]
            return (typeof message[1] === 'string' &&
                (message[2] === undefined || typeof message[2] === 'string'));
        default:
            // AUTH / COUNT / internal PING/PONG/ERROR — accept as-is.
            return true;
    }
}
/**
 * Creates an EVENT message: ["EVENT", <event>]
 */
function createEventMessage(event) {
    return [messages_js_1.MESSAGE_TYPES.EVENT, event];
}
/**
 * Creates a REQ message: ["REQ", <subscriptionId>, <filter1>, <filter2>, ...]
 */
function createReqMessage(subscriptionId, filters) {
    return [messages_js_1.MESSAGE_TYPES.REQ, subscriptionId, ...filters];
}
/**
 * Creates a CLOSE message: ["CLOSE", <subscriptionId>]
 */
function createCloseMessage(subscriptionId) {
    return [messages_js_1.MESSAGE_TYPES.CLOSE, subscriptionId];
}
/**
 * Creates a NOTICE message: ["NOTICE", <message>]
 */
function createNoticeMessage(message) {
    return [messages_js_1.MESSAGE_TYPES.NOTICE, message];
}
/**
 * Validates a Nostr event according to NIP-01.
 * Uses strict type checks (never truthiness) so valid kind:0, empty-content,
 * and created_at:0 events pass, and enforces hex format on id/pubkey/sig.
 */
function validateEvent(event) {
    if (typeof event !== 'object' || !event) {
        return { valid: false, error: 'Event must be an object' };
    }
    const typedEvent = event;
    if (typeof typedEvent.id !== 'string' || !HEX_64.test(typedEvent.id)) {
        return { valid: false, error: 'Event id must be 64-char lowercase hex' };
    }
    if (typeof typedEvent.pubkey !== 'string' || !HEX_64.test(typedEvent.pubkey)) {
        return { valid: false, error: 'Event pubkey must be 64-char lowercase hex' };
    }
    if (typeof typedEvent.created_at !== 'number' ||
        !Number.isInteger(typedEvent.created_at) ||
        typedEvent.created_at < 0) {
        return { valid: false, error: 'Event must have a non-negative integer created_at' };
    }
    if (typeof typedEvent.kind !== 'number' ||
        !Number.isInteger(typedEvent.kind) ||
        typedEvent.kind < 0) {
        return { valid: false, error: 'Event must have a non-negative integer kind' };
    }
    if (!Array.isArray(typedEvent.tags)) {
        return { valid: false, error: 'Event must have an array of tags' };
    }
    if (typeof typedEvent.content !== 'string') {
        return { valid: false, error: 'Event content must be a string' };
    }
    if (typeof typedEvent.sig !== 'string' || !HEX_128.test(typedEvent.sig)) {
        return { valid: false, error: 'Event sig must be 128-char lowercase hex' };
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
/**
 * Validates a positional REQ: ["REQ", <subId:string>, <filter:object>, ...]
 */
function validateReqMessage(message) {
    const subscriptionId = message[1];
    if (typeof subscriptionId !== 'string' || subscriptionId.length === 0) {
        logger.debug('Invalid subscription id');
        return false;
    }
    const filters = message.slice(2);
    if (filters.length === 0) {
        logger.debug('REQ must carry at least one filter');
        return false;
    }
    for (const filter of filters) {
        if (typeof filter !== 'object' || filter === null || Array.isArray(filter)) {
            logger.debug('Invalid filter format');
            return false;
        }
    }
    return true;
}
/**
 * Validates a positional CLOSE: ["CLOSE", <subId:string>]
 */
function validateCloseMessage(message) {
    const subscriptionId = message[1];
    if (typeof subscriptionId !== 'string' || subscriptionId.length === 0) {
        logger.debug('Invalid subscription id');
        return false;
    }
    return true;
}
//# sourceMappingURL=nip-01.js.map