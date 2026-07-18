/**
 * @file Crypto handlers for Nostr messages
 * @module crypto/handlers
 */

import { getLogger } from '../utils/logger.js';
import type { NostrWSMessage } from '../types/messages.js';
import { MESSAGE_TYPES } from '../types/messages.js';
import type { NostrEvent, SignedNostrEvent } from '../types/events.js';
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
    if (!Array.isArray(message) || message[0] !== MESSAGE_TYPES.EVENT || !message[1]) {
      logger.debug('Invalid message format');
      return false;
    }

    const event = message[1] as NostrEvent;

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
    logger.error({ error }, 'Error validating signed message');
    return false;
  }
}

/**
 * Cryptographically validates an EVENT message's signature.
 *
 * SECURITY: this performs real BIP-340 verification via nostr-crypto-utils
 * (validateEvent + verifySignature). It returns a Promise<boolean> and returns
 * `false` for non-EVENT messages (a non-EVENT message is not a validly-signed
 * event, so callers gating inbound events must not treat it as valid).
 *
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns Promise resolving to true only if the event's signature verifies
 */
export async function validateSignature(
  message: NostrWSMessage,
  logger?: { debug: (...a: unknown[]) => void; error: (...a: unknown[]) => void }
): Promise<boolean> {
  try {
    if (!Array.isArray(message) || message[0] !== MESSAGE_TYPES.EVENT || !message[1]) {
      logger?.debug('Not an EVENT message');
      return false;
    }

    const event = message[1] as NostrEvent;

    if (!validateEvent(event)) {
      logger?.debug('Invalid event format');
      return false;
    }

    return await verifySignature(event as SignedNostrEvent);
  } catch (error) {
    logger?.error('Error validating signature:', error);
    return false;
  }
}
