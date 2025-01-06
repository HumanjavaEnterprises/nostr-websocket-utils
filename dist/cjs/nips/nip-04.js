"use strict";
/**
 * @file NIP-04: Encrypted Direct Message Support
 * @module nips/nip-04
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCRYPTED_DM_KIND = void 0;
exports.createEncryptedDM = createEncryptedDM;
exports.decryptDM = decryptDM;
exports.validateEncryptedDM = validateEncryptedDM;
const nostr_crypto_utils_1 = require("nostr-crypto-utils");
/**
 * Kind value for encrypted direct messages
 */
exports.ENCRYPTED_DM_KIND = 4;
/**
 * Creates an encrypted direct message event
 * @param content - Message content to encrypt
 * @param recipientPubkey - Recipient's public key
 * @param senderPrivkey - Sender's private key
 * @param tags - Additional tags for the event
 * @returns {Promise<NostrWSMessage>} Encrypted message event
 */
async function createEncryptedDM(content, recipientPubkey, senderPrivkey, tags = []) {
    try {
        const encryptedContent = await (0, nostr_crypto_utils_1.encryptMessage)(content, recipientPubkey, senderPrivkey);
        return ['EVENT', {
                kind: exports.ENCRYPTED_DM_KIND,
                content: encryptedContent,
                tags: [
                    ['p', recipientPubkey],
                    ...tags
                ]
            }];
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to create encrypted DM: ${errorMessage}`);
    }
}
/**
 * Decrypts a received direct message event
 * @param message - Received message
 * @param recipientPrivkey - Recipient's private key
 * @param senderPubkey - Sender's public key
 * @param logger - Logger instance
 * @returns {Promise<string>} Decrypted message content
 */
async function decryptDM(message, recipientPrivkey, senderPubkey, logger) {
    try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') {
            throw new Error('Invalid message format');
        }
        const event = message[1];
        if (event.kind !== exports.ENCRYPTED_DM_KIND) {
            throw new Error('Not an encrypted DM event');
        }
        return await (0, nostr_crypto_utils_1.decryptMessage)(event.content, senderPubkey, recipientPrivkey);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Failed to decrypt DM:', errorMessage);
        throw new Error(`Failed to decrypt DM: ${errorMessage}`);
    }
}
/**
 * Validates an encrypted DM event format
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns {boolean} True if message follows NIP-04 format
 */
function validateEncryptedDM(message, logger) {
    try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') {
            logger.debug('Invalid message format');
            return false;
        }
        const event = message[1];
        if (event.kind !== exports.ENCRYPTED_DM_KIND) {
            logger.debug('Not an encrypted DM event');
            return false;
        }
        if (!event.content || typeof event.content !== 'string') {
            logger.debug('Missing or invalid content');
            return false;
        }
        if (!Array.isArray(event.tags)) {
            logger.debug('Missing tags array');
            return false;
        }
        const recipientTag = event.tags.find((tag) => Array.isArray(tag) && tag[0] === 'p' && tag[1]);
        if (!recipientTag) {
            logger.debug('Missing recipient tag');
            return false;
        }
        return true;
    }
    catch (error) {
        logger.error('Error validating encrypted DM:', error);
        return false;
    }
}
//# sourceMappingURL=nip-04.js.map