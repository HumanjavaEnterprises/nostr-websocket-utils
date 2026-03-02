/**
 * @file NIP-44: Versioned Encrypted Payloads
 * @module nips/nip-44
 * @see https://github.com/nostr-protocol/nips/blob/master/44.md
 *
 * NIP-44 replaces NIP-04 with a modern encryption scheme using
 * ChaCha20 + HMAC-SHA256. This module provides DM-level helpers
 * that parallel the NIP-04 module (nip-04.ts).
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
/**
 * Kind value for NIP-44 encrypted direct messages (gift-wrapped DMs use kind 14,
 * but for parity with NIP-04 kind 4 usage, callers may choose their own kind).
 * NIP-44 itself is a payload format, not a kind — the kind depends on the use case.
 * We default to kind 44 as a convenience constant; callers should override as needed.
 */
export declare const ENCRYPTED_DM_KIND_44 = 44;
/**
 * Creates a NIP-44 conversation key from a sender's private key and recipient's public key.
 * This key is symmetric and reusable for all messages in the conversation.
 * @param senderPrivkeyHex - Sender's private key in hex
 * @param recipientPubkeyHex - Recipient's public key in hex
 * @returns Conversation key as Uint8Array
 */
export declare function getConversationKey(senderPrivkeyHex: string, recipientPubkeyHex: string): Uint8Array;
/**
 * Encrypts a message using NIP-44
 * @param plaintext - Message content to encrypt
 * @param senderPrivkeyHex - Sender's private key in hex
 * @param recipientPubkeyHex - Recipient's public key in hex
 * @returns Encrypted payload string (base64)
 */
export declare function encryptNip44(plaintext: string, senderPrivkeyHex: string, recipientPubkeyHex: string): string;
/**
 * Decrypts a NIP-44 encrypted payload
 * @param payload - Encrypted payload string (base64)
 * @param recipientPrivkeyHex - Recipient's private key in hex
 * @param senderPubkeyHex - Sender's public key in hex
 * @returns Decrypted plaintext
 */
export declare function decryptNip44(payload: string, recipientPrivkeyHex: string, senderPubkeyHex: string): string;
/**
 * Creates an encrypted direct message event using NIP-44
 * @param content - Message content to encrypt
 * @param recipientPubkey - Recipient's public key (hex)
 * @param senderPrivkey - Sender's private key (hex)
 * @param tags - Additional tags for the event
 * @param kind - Event kind (defaults to ENCRYPTED_DM_KIND_44)
 * @returns Encrypted message event as NostrWSMessage
 */
export declare function createEncryptedDM44(content: string, recipientPubkey: string, senderPrivkey: string, tags?: string[][], kind?: number): NostrWSMessage;
/**
 * Decrypts a received direct message event encrypted with NIP-44
 * @param message - Received message
 * @param recipientPrivkey - Recipient's private key (hex)
 * @param senderPubkey - Sender's public key (hex)
 * @param logger - Logger instance
 * @returns Decrypted message content
 */
export declare function decryptDM44(message: NostrWSMessage, recipientPrivkey: string, senderPubkey: string, logger: Logger): string;
/**
 * Validates a NIP-44 encrypted DM event format
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns True if message follows NIP-44 encrypted DM format
 */
export declare function validateEncryptedDM44(message: NostrWSMessage, logger: Logger): boolean;
//# sourceMappingURL=nip-44.d.ts.map