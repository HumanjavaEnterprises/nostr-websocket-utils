/**
 * @file NIP-44: Versioned Encrypted Payloads
 * @module nips/nip-44
 * @see https://github.com/nostr-protocol/nips/blob/master/44.md
 *
 * NIP-44 replaces NIP-04 with a modern encryption scheme using
 * ChaCha20 + HMAC-SHA256. This module provides DM-level helpers
 * that parallel the NIP-04 module (nip-04.ts).
 */

import { nip44, hexToBytes, getPublicKeySync } from 'nostr-crypto-utils';
import type { NostrWSMessage, NostrEvent } from '../types/messages.js';
import type { Logger } from '../types/logger.js';

/**
 * Kind value for NIP-44 encrypted direct messages (gift-wrapped DMs use kind 14,
 * but for parity with NIP-04 kind 4 usage, callers may choose their own kind).
 * NIP-44 itself is a payload format, not a kind — the kind depends on the use case.
 * We default to kind 44 as a convenience constant; callers should override as needed.
 */
export const ENCRYPTED_DM_KIND_44 = 44;

/**
 * Creates a NIP-44 conversation key from a sender's private key and recipient's public key.
 * This key is symmetric and reusable for all messages in the conversation.
 * @param senderPrivkeyHex - Sender's private key in hex
 * @param recipientPubkeyHex - Recipient's public key in hex
 * @returns Conversation key as Uint8Array
 */
export function getConversationKey(
  senderPrivkeyHex: string,
  recipientPubkeyHex: string
): Uint8Array {
  const privkeyBytes = hexToBytes(senderPrivkeyHex);
  return nip44.getConversationKey(privkeyBytes, recipientPubkeyHex);
}

/**
 * Encrypts a message using NIP-44
 * @param plaintext - Message content to encrypt
 * @param senderPrivkeyHex - Sender's private key in hex
 * @param recipientPubkeyHex - Recipient's public key in hex
 * @returns Encrypted payload string (base64)
 */
export function encryptNip44(
  plaintext: string,
  senderPrivkeyHex: string,
  recipientPubkeyHex: string
): string {
  const conversationKey = getConversationKey(senderPrivkeyHex, recipientPubkeyHex);
  return nip44.encrypt(plaintext, conversationKey);
}

/**
 * Decrypts a NIP-44 encrypted payload
 * @param payload - Encrypted payload string (base64)
 * @param recipientPrivkeyHex - Recipient's private key in hex
 * @param senderPubkeyHex - Sender's public key in hex
 * @returns Decrypted plaintext
 */
export function decryptNip44(
  payload: string,
  recipientPrivkeyHex: string,
  senderPubkeyHex: string
): string {
  const conversationKey = getConversationKey(recipientPrivkeyHex, senderPubkeyHex);
  return nip44.decrypt(payload, conversationKey);
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
export function createEncryptedDM44(
  content: string,
  recipientPubkey: string,
  senderPrivkey: string,
  tags: string[][] = [],
  kind: number = ENCRYPTED_DM_KIND_44
): NostrWSMessage {
  try {
    const encryptedContent = encryptNip44(content, senderPrivkey, recipientPubkey);
    const senderPubkey = getPublicKeySync(senderPrivkey);
    return ['EVENT', {
      kind,
      pubkey: senderPubkey,
      content: encryptedContent,
      tags: [
        ['p', recipientPubkey],
        ...tags
      ]
    }];
  } catch (error: unknown) {
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
export function decryptDM44(
  message: NostrWSMessage,
  recipientPrivkey: string,
  senderPubkey: string,
  logger: Logger
): string {
  try {
    if (!Array.isArray(message) || message[0] !== 'EVENT') {
      throw new Error('Invalid message format');
    }

    const event = message[1] as NostrEvent;
    return decryptNip44(event.content, recipientPrivkey, senderPubkey);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ error: errorMessage }, 'Failed to decrypt NIP-44 DM');
    throw new Error(`Failed to decrypt NIP-44 DM: ${errorMessage}`);
  }
}

/**
 * Validates a NIP-44 encrypted DM event format
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns True if message follows NIP-44 encrypted DM format
 */
export function validateEncryptedDM44(
  message: NostrWSMessage,
  logger: Logger
): boolean {
  try {
    if (!Array.isArray(message) || message[0] !== 'EVENT') {
      logger.debug('Invalid message format');
      return false;
    }

    const event = message[1] as NostrEvent;

    if (!event.content || typeof event.content !== 'string') {
      logger.debug('Missing or invalid content');
      return false;
    }

    if (!Array.isArray(event.tags)) {
      logger.debug('Missing tags array');
      return false;
    }

    const recipientTag = event.tags.find((tag: string[]) =>
      Array.isArray(tag) && tag[0] === 'p' && tag[1]
    );

    if (!recipientTag) {
      logger.debug('Missing recipient tag');
      return false;
    }

    return true;
  } catch (error) {
    logger.error({ error }, 'Error validating NIP-44 encrypted DM');
    return false;
  }
}
