/**
 * @file NIP-33: Parameterized Replaceable Events
 * @module nips/nip-33
 * @see https://github.com/nostr-protocol/nips/blob/master/33.md
 */

import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';

/**
 * Parameterized replaceable event kinds (30000-39999)
 */
export const PARAMETERIZED_REPLACEABLE_KINDS = {
  CATEGORIZED_BOOKMARK: 30000,
  CATEGORIZED_HIGHLIGHT: 30001,
  CATEGORIZED_PEOPLE_LIST: 30002,
  PROFILE_BADGES: 30008,
  BADGE_DEFINITION: 30009,
  CUSTOM_START: 31000,
  CUSTOM_END: 39999
};

/**
 * Creates a parameterized replaceable event
 * @param kind - Event kind
 * @param content - Event content
 * @param identifier - Unique identifier for the parameter
 * @param additionalTags - Additional tags
 * @returns {NostrWSMessage} Parameterized replaceable event
 */
export function createParameterizedEvent(
  kind: number,
  content: string,
  identifier: string,
  additionalTags: string[][] = []
): NostrWSMessage {
  return ['EVENT', {
    kind,
    content,
    tags: [
      ['d', identifier],
      ...additionalTags
    ]
  }];
}

/**
 * Validates a parameterized replaceable event
 * @param message - Message to validate
 * @param _logger - Logger instance
 * @returns {boolean} True if valid
 */
export function validateParameterizedEvent(
  message: NostrWSMessage,
  _logger: Logger
): boolean {
  try {
    if (!Array.isArray(message) || message[0] !== 'EVENT') {
      return false;
    }

    const event = message[1] as Record<string, unknown>;
    const kind = event.kind as number;

    // Check if kind is in valid range
    if (kind < 30000 || kind > 39999) {
      _logger.debug('Invalid kind for parameterized replaceable event');
      return false;
    }

    // Must have exactly one 'd' tag
    if (!Array.isArray(event.tags)) {
      _logger.debug('Missing tags array');
      return false;
    }

    const dTags = event.tags.filter(tag => 
      Array.isArray(tag) && tag[0] === 'd' && tag[1]
    );

    if (dTags.length !== 1) {
      _logger.debug('Must have exactly one d tag');
      return false;
    }

    return true;
  } catch (error) {
    _logger.error('Error validating parameterized event:', error);
    return false;
  }
}

/**
 * Parameterized event manager interface
 */
export interface ParameterizedEventManager {
  /**
   * Creates a new parameterized event
   * @param kind - Event kind
   * @param content - Event content
   * @param identifier - Parameter identifier
   * @param tags - Additional tags
   * @returns {NostrWSMessage} Created event
   */
  createEvent(
    kind: number,
    content: string,
    identifier: string,
    tags?: string[][]
  ): NostrWSMessage;

  /**
   * Updates an existing parameterized event
   * @param kind - Event kind
   * @param identifier - Parameter identifier
   * @param content - New content
   * @returns {NostrWSMessage} Update event
   */
  updateEvent(
    kind: number,
    identifier: string,
    content: string
  ): NostrWSMessage;

  /**
   * Subscribes to parameterized events
   * @param kinds - Event kinds to subscribe to
   * @param identifiers - Parameter identifiers
   * @returns {NostrWSMessage} Subscription message
   */
  subscribe(
    kinds: number[],
    identifiers: string[]
  ): NostrWSMessage;
}

/**
 * Creates a parameterized event manager
 * @param _logger - Logger instance
 * @returns {ParameterizedEventManager} Event manager
 */
export function createParameterizedEventManager(
  _logger: Logger
): ParameterizedEventManager {
  return {
    createEvent(
      kind: number,
      content: string,
      identifier: string,
      tags: string[][] = []
    ): NostrWSMessage {
      return createParameterizedEvent(kind, content, identifier, tags);
    },

    updateEvent(
      kind: number,
      identifier: string,
      content: string
    ): NostrWSMessage {
      return createParameterizedEvent(kind, content, identifier);
    },

    subscribe(kinds: number[], identifiers: string[]): NostrWSMessage {
      return ['REQ', {
        filter: {
          kinds,
          '#d': identifiers
        }
      }];
    }
  };
}

/**
 * Event replacement handler interface
 */
export interface EventReplacementHandler {
  /**
   * Checks if an event should replace another
   * @param newEvent - New event
   * @param existingEvent - Existing event
   * @returns {boolean} True if should replace
   */
  shouldReplace(
    newEvent: Record<string, unknown>,
    existingEvent: Record<string, unknown>
  ): boolean;

  /**
   * Gets replacement key for an event
   * @param event - Event to get key for
   * @returns {string} Replacement key
   */
  getReplacementKey(event: Record<string, unknown>): string;
}

/**
 * Creates an event replacement handler
 * @param _logger - Logger instance
 * @returns {EventReplacementHandler} Replacement handler
 */
export function createEventReplacementHandler(
  _logger: Logger
): EventReplacementHandler {
  return {
    shouldReplace(
      newEvent: Record<string, unknown>,
      existingEvent: Record<string, unknown>
    ): boolean {
      try {
        // Must be same kind
        if (newEvent.kind !== existingEvent.kind) return false;

        // Must have same 'd' tag value
        const newTags = newEvent.tags as string[][];
        const existingTags = existingEvent.tags as string[][];

        const newDTag = newTags?.find(tag => tag[0] === 'd')?.[1];
        const existingDTag = existingTags?.find(tag => tag[0] === 'd')?.[1];

        if (newDTag !== existingDTag) return false;

        // Replace if newer
        return (newEvent.created_at as number) > (existingEvent.created_at as number);
      } catch (error) {
        _logger.error('Error checking event replacement:', error);
        return false;
      }
    },

    getReplacementKey(event: Record<string, unknown>): string {
      const kind = event.kind as number;
      const dTag = (event.tags as string[][])?.find(tag => tag[0] === 'd')?.[1];
      return `${kind}:${dTag}`;
    }
  };
}
