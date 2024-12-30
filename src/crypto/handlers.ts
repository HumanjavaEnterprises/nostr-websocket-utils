/**
 * @file Crypto handlers for Nostr messages
 * @module crypto/handlers
 */

import { getLogger } from '../utils/logger';
import type { NostrWSMessage } from '../types/messages';
import { MESSAGE_TYPES } from '../types/messages';
import type { NostrEvent, SignedNostrEvent } from '../types/events';
import { validateEvent, verifySignature } from 'nostr-crypto-utils';

const logger = getLogger('crypto');

/**
 * Validates a signed message
 * @param message - Message to validate
 * @returns Promise resolving to true if message is valid
 */
export async function validateSignedMessage(
  message: NostrWSMessage
): Promise<boolean> {
  try {
    if (message.type !== MESSAGE_TYPES.EVENT || !message.data) {
      logger.debug('Invalid message format');
      return false;
    }

    const event = message.data as NostrEvent;

    if (!validateEvent(event)) {
      logger.debug('Invalid event format');
      return false;
    }

    const isValid = await verifySignature(event as SignedNostrEvent);
    if (!isValid) {
      logger.debug('Invalid signature');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error validating signed message:', error);
    return false;
  }
}
