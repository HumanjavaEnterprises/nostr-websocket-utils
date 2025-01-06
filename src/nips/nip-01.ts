/**
 * @file NIP-01: Basic protocol flow implementation
 * @module nips/nip-01
 */

import { getLogger } from '../utils/logger.js';
import type { NostrWSMessage, NostrEvent } from '../types/messages.js';
import { MESSAGE_TYPES } from '../types/messages.js';

const logger = getLogger('NIP-01');

interface NostrEventValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a message according to NIP-01 specifications
 */
export function validateMessage(message: NostrWSMessage): boolean {
  if (!message || !Array.isArray(message)) {
    logger.debug('Invalid message format');
    return false;
  }

  if (!message[0] || !(message[0] in MESSAGE_TYPES)) {
    logger.debug(`Invalid message type: ${message[0]}`);
    return false;
  }

  if (!message[1] || typeof message[1] !== 'object') {
    logger.debug('Invalid message data');
    return false;
  }

  // Message type specific validation
  if (message[0] === MESSAGE_TYPES.EVENT) {
    if (!validateEvent(message[1] as NostrEvent).valid) {
      return false;
    }
  }

  if (message[0] === MESSAGE_TYPES.REQ) {
    if (!validateReqMessage(message)) {
      return false;
    }
  }

  if (message[0] === MESSAGE_TYPES.CLOSE) {
    if (!validateCloseMessage(message)) {
      return false;
    }
  }

  return true;
}

/**
 * Creates an EVENT message
 */
export function createEventMessage(event: NostrEvent): NostrWSMessage {
  return [MESSAGE_TYPES.EVENT, event];
}

/**
 * Creates a REQ message
 */
export function createReqMessage(subscriptionId: string, filters: Array<Record<string, unknown>>): NostrWSMessage {
  return [MESSAGE_TYPES.REQ, {
    subscription_id: subscriptionId,
    filters
  }];
}

/**
 * Creates a CLOSE message
 */
export function createCloseMessage(subscriptionId: string): NostrWSMessage {
  return [MESSAGE_TYPES.CLOSE, {
    subscription_id: subscriptionId
  }];
}

/**
 * Creates a NOTICE message
 */
export function createNoticeMessage(message: string): NostrWSMessage {
  return [MESSAGE_TYPES.NOTICE, {
    message
  }];
}

/**
 * Validates a Nostr event according to NIP-01
 */
export function validateEvent(event: NostrEvent): NostrEventValidationResult {
  if (typeof event !== 'object' || !event) {
    return { valid: false, error: 'Event must be an object' };
  }

  const typedEvent = event;

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
  const { subscription_id, filters } = message[1] as any;
  
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
  const { subscription_id } = message[1] as any;
  
  if (!subscription_id || typeof subscription_id !== 'string') {
    logger.debug('Invalid subscription_id');
    return false;
  }

  return true;
}
