/**
 * @file NIP-04: Encrypted Direct Message Support
 * @module nips/nip-04
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
/**
 * Kind value for encrypted direct messages
 */
export declare const ENCRYPTED_DM_KIND = 4;
/**
 * Creates an encrypted direct message event
 * @param content - Message content to encrypt
 * @param recipientPubkey - Recipient's public key
 * @param senderPrivkey - Sender's private key
 * @param tags - Additional tags for the event
 * @returns {Promise<NostrWSMessage>} Encrypted message event
 */
export declare function createEncryptedDM(content: string, recipientPubkey: string, senderPrivkey: string, tags?: string[][]): Promise<NostrWSMessage>;
/**
 * Decrypts a received direct message event
 * @param message - Received message
 * @param recipientPrivkey - Recipient's private key
 * @param senderPubkey - Sender's public key
 * @param logger - Logger instance
 * @returns {Promise<string>} Decrypted message content
 */
export declare function decryptDM(message: NostrWSMessage, recipientPrivkey: string, senderPubkey: string, logger: Logger): Promise<string>;
/**
 * Validates an encrypted DM event format
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns {boolean} True if message follows NIP-04 format
 */
export declare function validateEncryptedDM(message: NostrWSMessage, logger: Logger): boolean;
//# sourceMappingURL=nip-04.d.ts.map