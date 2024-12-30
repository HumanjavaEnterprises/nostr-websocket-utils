/**
 * @file NIP-01: Basic protocol flow implementation
 * @module nips/nip-01
 */

import { getLogger } from '../utils/logger';
import type { NostrWSMessage } from '../types/messages';
import { MESSAGE_TYPES } from '../types/messages';

const logger = getLogger('NIP-01');

interface NostrEventValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a message according to NIP-01 specifications
 */
export function validateMessage(message: NostrWSMessage): boolean {
  if (!message || typeof message !== 'object') {
    logger.debug('Invalid message format');
    return false;
  }

  if (!message.type || !Object.values(MESSAGE_TYPES).includes(message.type as any)) {
    logger.debug(`Invalid message type: ${message.type}`);
    return false;
  }

  if (!message.data || typeof message.data !== 'object') {
    logger.debug('Invalid message data');
    return false;
  }

  // Message type specific validation
  if (message.type === MESSAGE_TYPES.EVENT) {
    if (!validateEvent(message.data).valid) {
      return false;
    }
  }

  if (message.type === MESSAGE_TYPES.REQ) {
    if (!validateReqMessage(message)) {
      return false;
    }
  }

  if (message.type === MESSAGE_TYPES.CLOSE) {
    if (!validateCloseMessage(message)) {
      return false;
    }
  }

  return true;
}

/**
 * Creates an EVENT message
 */
export function createEventMessage(event: Record<string, unknown>): NostrWSMessage {
  return {
    type: MESSAGE_TYPES.EVENT,
    data: event
  };
}

/**
 * Creates a REQ message
 */
export function createReqMessage(subscriptionId: string, filters: Array<Record<string, unknown>>): NostrWSMessage {
  return {
    type: MESSAGE_TYPES.REQ,
    data: {
      subscription_id: subscriptionId,
      filters
    }
  };
}

/**
 * Creates a CLOSE message
 */
export function createCloseMessage(subscriptionId: string): NostrWSMessage {
  return {
    type: MESSAGE_TYPES.CLOSE,
    data: {
      subscription_id: subscriptionId
    }
  };
}

/**
 * Creates a NOTICE message
 */
export function createNoticeMessage(message: string): NostrWSMessage {
  return {
    type: MESSAGE_TYPES.NOTICE,
    data: {
      message
    }
  };
}

/**
 * Validates a Nostr event according to NIP-01
 */
export function validateEvent(event: unknown): NostrEventValidationResult {
  if (typeof event !== 'object' || !event) {
    return { valid: false, error: 'Event must be an object' };
  }

  const typedEvent = event as Record<string, unknown>;

  if (!typedEvent.id || typeof typedEvent.id !== 'string') {
    return { valid: false, error: 'Event must have a string id' };
  }

  if (!typedEvent.pubkey || typeof typedEvent.pubkey !== 'string') {
    return { valid: false, error: 'Event must have a string pubkey' };
  }

  if (!typedEvent.created_at || typeof typedEvent.created_at !== 'number') {
    return { valid: false, error: 'Event must have a number created_at' };
  }

  if (!typedEvent.kind || typeof typedEvent.kind !== 'number') {
    return { valid: false, error: 'Event must have a number kind' };
  }

  if (!Array.isArray(typedEvent.tags)) {
    return { valid: false, error: 'Event must have an array of tags' };
  }

  if (!typedEvent.content || typeof typedEvent.content !== 'string') {
    return { valid: false, error: 'Event must have a string content' };
  }

  if (!typedEvent.sig || typeof typedEvent.sig !== 'string') {
    return { valid: false, error: 'Event must have a string sig' };
  }

  // Validate tag structure
  for (const tag of typedEvent.tags) {
    if (!Array.isArray(tag) || tag.length === 0) {
      return { valid: false, error: 'Each tag must be a non-empty array' };
    }

    if (typeof tag[0] !== 'string') {
      return { valid: false, error: 'Tag identifier must be a string' };
    }
  }

  return { valid: true };
}

// Private helper functions

function validateReqMessage(message: NostrWSMessage): boolean {
  const { subscription_id, filters } = message.data as any;
  
  if (!subscription_id || typeof subscription_id !== 'string') {
    logger.debug('Invalid subscription_id');
    return false;
  }

  if (!Array.isArray(filters)) {
    logger.debug('Invalid filters format');
    return false;
  }

  return true;
}

function validateCloseMessage(message: NostrWSMessage): boolean {
  const { subscription_id } = message.data as any;
  
  if (!subscription_id || typeof subscription_id !== 'string') {
    logger.debug('Invalid subscription_id');
    return false;
  }

  return true;
}
