/**
 * @file NIP-04: Encrypted Direct Message Support
 * @module nips/nip-04
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */

import { encryptMessage, decryptMessage } from 'nostr-crypto-utils';
import type { NostrWSMessage, NostrEvent } from '../types/messages';
import type { Logger } from '../types/logger';

/**
 * Kind value for encrypted direct messages
 */
export const ENCRYPTED_DM_KIND = 4;

/**
 * Creates an encrypted direct message event
 * @param content - Message content to encrypt
 * @param recipientPubkey - Recipient's public key
 * @param senderPrivkey - Sender's private key
 * @param tags - Additional tags for the event
 * @returns {Promise<NostrWSMessage>} Encrypted message event
 */
export async function createEncryptedDM(
  content: string,
  recipientPubkey: string,
  senderPrivkey: string,
  tags: string[][] = []
): Promise<NostrWSMessage> {
  try {
    const encryptedContent = await encryptMessage(content, recipientPubkey, senderPrivkey);
    return ['EVENT', {
      kind: ENCRYPTED_DM_KIND,
      content: encryptedContent,
      tags: [
        ['p', recipientPubkey],
        ...tags
      ]
    }];
  } catch (error: unknown) {
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
export async function decryptDM(
  message: NostrWSMessage,
  recipientPrivkey: string,
  senderPubkey: string,
  logger: Logger
): Promise<string> {
  try {
    if (!Array.isArray(message) || message[0] !== 'EVENT') {
      throw new Error('Invalid message format');
    }

    const event = message[1] as NostrEvent;
    if (event.kind !== ENCRYPTED_DM_KIND) {
      throw new Error('Not an encrypted DM event');
    }

    return await decryptMessage(event.content, senderPubkey, recipientPrivkey);
  } catch (error: unknown) {
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
export function validateEncryptedDM(
  message: NostrWSMessage,
  logger: Logger
): boolean {
  try {
    if (!Array.isArray(message) || message[0] !== 'EVENT') {
      logger.debug('Invalid message format');
      return false;
    }

    const event = message[1] as NostrEvent;
    if (event.kind !== ENCRYPTED_DM_KIND) {
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

    const recipientTag = event.tags.find((tag: string[]) =>
      Array.isArray(tag) && tag[0] === 'p' && tag[1]
    );

    if (!recipientTag) {
      logger.debug('Missing recipient tag');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error validating encrypted DM:', error);
    return false;
  }
}
