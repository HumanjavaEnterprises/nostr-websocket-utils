"use strict";
/**
 * @file NIP-44: Versioned Encrypted Payloads
 * @module nips/nip-44
 * @see https://github.com/nostr-protocol/nips/blob/master/44.md
 *
 * NIP-44 replaces NIP-04 with a modern encryption scheme using
 * ChaCha20 + HMAC-SHA256. This module provides DM-level helpers
 * that parallel the NIP-04 module (nip-04.ts).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCRYPTED_DM_KIND_44 = void 0;
exports.getConversationKey = getConversationKey;
exports.encryptNip44 = encryptNip44;
exports.decryptNip44 = decryptNip44;
exports.createEncryptedDM44 = createEncryptedDM44;
exports.decryptDM44 = decryptDM44;
exports.validateEncryptedDM44 = validateEncryptedDM44;
const nostr_crypto_utils_1 = require("nostr-crypto-utils");
/**
 * Kind value for NIP-44 encrypted direct messages (gift-wrapped DMs use kind 14,
 * but for parity with NIP-04 kind 4 usage, callers may choose their own kind).
 * NIP-44 itself is a payload format, not a kind — the kind depends on the use case.
 * We default to kind 44 as a convenience constant; callers should override as needed.
 */
exports.ENCRYPTED_DM_KIND_44 = 44;
/**
 * Creates a NIP-44 conversation key from a sender's private key and recipient's public key.
 * This key is symmetric and reusable for all messages in the conversation.
 * @param senderPrivkeyHex - Sender's private key in hex
 * @param recipientPubkeyHex - Recipient's public key in hex
 * @returns Conversation key as Uint8Array
 */
function getConversationKey(senderPrivkeyHex, recipientPubkeyHex) {
    const privkeyBytes = (0, nostr_crypto_utils_1.hexToBytes)(senderPrivkeyHex);
    return nostr_crypto_utils_1.nip44.getConversationKey(privkeyBytes, recipientPubkeyHex);
}
/**
 * Encrypts a message using NIP-44
 * @param plaintext - Message content to encrypt
 * @param senderPrivkeyHex - Sender's private key in hex
 * @param recipientPubkeyHex - Recipient's public key in hex
 * @returns Encrypted payload string (base64)
 */
function encryptNip44(plaintext, senderPrivkeyHex, recipientPubkeyHex) {
    const conversationKey = getConversationKey(senderPrivkeyHex, recipientPubkeyHex);
    return nostr_crypto_utils_1.nip44.encrypt(plaintext, conversationKey);
}
/**
 * Decrypts a NIP-44 encrypted payload
 * @param payload - Encrypted payload string (base64)
 * @param recipientPrivkeyHex - Recipient's private key in hex
 * @param senderPubkeyHex - Sender's public key in hex
 * @returns Decrypted plaintext
 */
function decryptNip44(payload, recipientPrivkeyHex, senderPubkeyHex) {
    const conversationKey = getConversationKey(recipientPrivkeyHex, senderPubkeyHex);
    return nostr_crypto_utils_1.nip44.decrypt(payload, conversationKey);
}
/**
 * Creates an encrypted direct message event using NIP-44
 * @param content - Message content to encrypt
 * @param recipientPubkey - Recipient's public key (hex)
 * @param senderPrivkey - Sender's private key (hex)
 * @param tags - Additional tags for the event
 * @param kind - Event kind (defaults to ENCRYPTED_DM_KIND_44)
 * @returns Encrypted message event as NostrWSMessage
 */
function createEncryptedDM44(content, recipientPubkey, senderPrivkey, tags = [], kind = exports.ENCRYPTED_DM_KIND_44) {
    try {
        const encryptedContent = encryptNip44(content, senderPrivkey, recipientPubkey);
        const senderPubkey = (0, nostr_crypto_utils_1.getPublicKeySync)(senderPrivkey);
        return ['EVENT', {
                kind,
                pubkey: senderPubkey,
                content: encryptedContent,
                tags: [
                    ['p', recipientPubkey],
                    ...tags
                ]
            }];
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to create NIP-44 encrypted DM: ${errorMessage}`);
    }
}
/**
 * Decrypts a received direct message event encrypted with NIP-44
 * @param message - Received message
 * @param recipientPrivkey - Recipient's private key (hex)
 * @param senderPubkey - Sender's public key (hex)
 * @param logger - Logger instance
 * @returns Decrypted message content
 */
function decryptDM44(message, recipientPrivkey, senderPubkey, logger) {
    try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') {
            throw new Error('Invalid message format');
        }
        const event = message[1];
        return decryptNip44(event.content, recipientPrivkey, senderPubkey);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Failed to decrypt NIP-44 DM:', errorMessage);
        throw new Error(`Failed to decrypt NIP-44 DM: ${errorMessage}`);
    }
}
/**
 * Validates a NIP-44 encrypted DM event format
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns True if message follows NIP-44 encrypted DM format
 */
function validateEncryptedDM44(message, logger) {
    try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') {
            logger.debug('Invalid message format');
            return false;
        }
        const event = message[1];
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
        logger.error('Error validating NIP-44 encrypted DM:', error);
        return false;
    }
}
//# sourceMappingURL=nip-44.js.map