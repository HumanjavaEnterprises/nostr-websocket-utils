/**
 * @file Validation type definitions
 * @module types/validation
 */

import { NostrEvent } from './events.js';
import { NostrWSMessage } from './messages.js';

/**
 * Validation result interface
 */
export interface NostrWSValidationResult {
  /**
   * Whether the validation passed
   */
  isValid: boolean;

  /**
   * Error message if validation failed
   */
  error?: string;
}

/**
 * Event validator interface
 */
export interface NostrEventValidator {
  /**
   * Validate a Nostr event
   */
  validateEvent(event: NostrEvent): NostrWSValidationResult;
}

/**
 * Message validator interface
 */
export interface NostrMessageValidator {
  /**
   * Validate a WebSocket message
   */
  validateMessage(message: NostrWSMessage): NostrWSValidationResult;
}

/**
 * Validator factory interface
 */
export interface ValidatorFactory {
  /**
   * Create an event validator
   */
  createEventValidator(): NostrEventValidator;

  /**
   * Create a message validator
   */
  createMessageValidator(): NostrMessageValidator;
}
