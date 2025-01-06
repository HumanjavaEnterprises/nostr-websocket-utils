"use strict";
/**
 * @file Crypto handlers for Nostr messages
 * @module crypto/handlers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignedMessage = validateSignedMessage;
exports.validateSignature = validateSignature;
const logger_js_1 = require("../utils/logger.js");
const messages_js_1 = require("../types/messages.js");
const nostr_crypto_utils_1 = require("nostr-crypto-utils");
const logger = (0, logger_js_1.getLogger)('crypto');
/**
 * Validates a signed message
 * @param message - Message to validate
 * @returns Promise resolving to true if message is valid
 */
async function validateSignedMessage(message) {
    try {
        if (!Array.isArray(message) || message[0] !== messages_js_1.MESSAGE_TYPES.EVENT || !message[1]) {
            logger.debug('Invalid message format');
            return false;
        }
        const event = message[1];
        if (!(0, nostr_crypto_utils_1.validateRelayMessage)(event)) {
            logger.debug('Invalid event format');
            return false;
        }
        const isValid = await (0, nostr_crypto_utils_1.verifySignature)(event);
        if (!isValid) {
            logger.debug('Invalid signature');
            return false;
        }
        return true;
    }
    catch (error) {
        logger.error('Error validating signed message:', error);
        return false;
    }
}
/**
 * Validates a signature
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns True if signature is valid
 */
function validateSignature(message, logger) {
    try {
        if (!Array.isArray(message) || message[0] !== messages_js_1.MESSAGE_TYPES.EVENT) {
            return true; // Not an event message
        }
        const event = message[1];
        if (!event.sig || typeof event.sig !== 'string') {
            logger.debug('Missing or invalid signature');
            return false;
        }
        // Additional validation logic...
        return true;
    }
    catch (error) {
        logger.error('Error validating signature:', error);
        return false;
    }
}
//# sourceMappingURL=handlers.js.map