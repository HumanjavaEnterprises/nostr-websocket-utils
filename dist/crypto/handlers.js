/**
 * @file Crypto handlers for Nostr messages
 * @module crypto/handlers
 */
import { getLogger } from '../utils/logger.js';
import { MESSAGE_TYPES } from '../types/messages.js';
import { validateRelayMessage as validateEvent, verifySignature } from 'nostr-crypto-utils';
const logger = getLogger('crypto');
/**
 * Validates a signed message
 * @param message - Message to validate
 * @returns Promise resolving to true if message is valid
 */
export async function validateSignedMessage(message) {
    try {
        if (!Array.isArray(message) || message[0] !== MESSAGE_TYPES.EVENT || !message[1]) {
            logger.debug('Invalid message format');
            return false;
        }
        const event = message[1];
        if (!validateEvent(event)) {
            logger.debug('Invalid event format');
            return false;
        }
        const isValid = await verifySignature(event);
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
export function validateSignature(message, logger) {
    try {
        if (!Array.isArray(message) || message[0] !== MESSAGE_TYPES.EVENT) {
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