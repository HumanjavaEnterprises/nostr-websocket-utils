/**
 * @file NIP-04: Encrypted Direct Message Support
 * @module nips/nip-04
 * @see https://github.com/nostr-protocol/nips/blob/master/04.md
 */

import { encryptMessage, decryptMessage } from 'nostr-crypto-utils';
import type { NostrWSMessage } from '../types/messages';
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
    return {
      type: 'EVENT',
      data: {
        kind: ENCRYPTED_DM_KIND,
        content: encryptedContent,
        tags: [
          ['p', recipientPubkey],
          ...tags
        ]
      }
    };
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
    if (message.type !== 'EVENT' || !message.data) {
      throw new Error('Invalid message format');
    }

    const event = message.data as Record<string, unknown>;
    if (event.kind !== ENCRYPTED_DM_KIND) {
      throw new Error('Not an encrypted DM event');
    }

    const content = event.content as string;
    if (!content) {
      throw new Error('No encrypted content found');
    }

    return await decryptMessage(content, senderPubkey, recipientPrivkey);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to decrypt DM: ${errorMessage}`);
    throw new Error(errorMessage);
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
    if (message.type !== 'EVENT' || !message.data) {
      logger.debug('Not an event message');
      return false;
    }

    const event = message.data as Record<string, unknown>;
    if (event.kind !== ENCRYPTED_DM_KIND) {
      logger.debug('Not an encrypted DM event');
      return false;
    }

    if (!event.content || typeof event.content !== 'string') {
      logger.debug('Invalid or missing content');
      return false;
    }

    if (!Array.isArray(event.tags)) {
      logger.debug('Missing tags array');
      return false;
    }

    const pTag = event.tags.find(tag => 
      Array.isArray(tag) && tag[0] === 'p' && tag[1]
    );
    if (!pTag) {
      logger.debug('Missing recipient pubkey tag');
      return false;
    }

    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error validating encrypted DM: ${errorMessage}`);
    return false;
  }
}
