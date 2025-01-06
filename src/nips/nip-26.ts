/**
 * @file NIP-26: Delegated Event Signing
 * @module nips/nip-26
 */

import { getLogger } from '../utils/logger.js';
import { signEvent, verifySignature } from 'nostr-crypto-utils';
import type { NostrEvent } from '../types/events.js';

const logger = getLogger('NIP-26');

/**
 * Represents the conditions for a Nostr event delegation
 * @interface DelegationConditions
 * @property {number} [kind] - The kind of events this delegation is valid for
 * @property {number} [since] - Unix timestamp from which this delegation is valid
 * @property {number} [until] - Unix timestamp until which this delegation is valid
 * @property {unknown} [key: string] - Any additional conditions
 */
interface DelegationConditions {
  kind?: number;
  since?: number;
  until?: number;
  [key: string]: unknown;
}

/**
 * Represents a Nostr event delegation
 * @interface Delegation
 * @property {string} pubkey - The public key of the delegator
 * @property {DelegationConditions} conditions - The conditions under which this delegation is valid
 * @property {string} token - The delegation token signed by the delegator
 */
interface Delegation {
  pubkey: string;
  conditions: DelegationConditions;
  token: string;
}

/**
 * Create a delegation token
 */
export async function createDelegation(
  delegatorPrivkey: string,
  delegateePubkey: string,
  conditions: DelegationConditions
): Promise<string> {
  try {
    const conditionsString = Object.entries(conditions)
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('&');

    const message = `nostr:delegation:${delegateePubkey}:${conditionsString}`;
    
    // Create a NostrEvent object for signing
    const event: NostrEvent = {
      id: '', // This will be set by signEvent
      pubkey: delegateePubkey,
      created_at: Math.floor(Date.now() / 1000),
      kind: 0, // Using kind 0 for delegation events
      tags: [],
      content: message,
      sig: '' // This will be set by signEvent
    };

    const signedEvent = await signEvent(event, delegatorPrivkey);
    return signedEvent.sig;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to create delegation: ${errorMessage}`);
    throw new Error(`Failed to create delegation: ${errorMessage}`);
  }
}

/**
 * Verify a delegation token
 */
export async function verifyDelegation(
  delegatorPubkey: string,
  delegateePubkey: string,
  token: string,
  conditions: DelegationConditions
): Promise<boolean> {
  try {
    const conditionsString = Object.entries(conditions)
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('&');

    const message = `nostr:delegation:${delegateePubkey}:${conditionsString}`;
    const verificationEvent = {
      id: '',
      pubkey: delegatorPubkey,
      created_at: Math.floor(Date.now() / 1000),
      kind: 0,
      tags: [],
      content: message,
      sig: token
    };
    return await verifySignature(verificationEvent);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to verify delegation: ${errorMessage}`);
    return false;
  }
}

/**
 * Add delegation tag to an event
 */
export function addDelegationTag(event: NostrEvent, delegation: Delegation): NostrEvent {
  const conditionsString = Object.entries(delegation.conditions)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('&');

  const delegationTag = ['delegation', delegation.pubkey, conditionsString, delegation.token];
  
  return {
    ...event,
    tags: [...event.tags, delegationTag]
  };
}

/**
 * Extract delegation from an event
 */
export function extractDelegation(event: NostrEvent): Delegation | null {
  try {
    const delegationTag = event.tags.find(tag => tag[0] === 'delegation');
    if (!delegationTag || delegationTag.length !== 4) {
      return null;
    }

    const [, pubkey, conditionsString, token] = delegationTag;
    const conditions: DelegationConditions = {};

    conditionsString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key === 'kind' || key === 'since' || key === 'until') {
        conditions[key] = parseInt(value, 10);
      } else {
        conditions[key] = value;
      }
    });

    return { pubkey, conditions, token };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to extract delegation: ${errorMessage}`);
    return null;
  }
}

/**
 * Validate a delegated event
 */
export async function validateDelegatedEvent(event: NostrEvent): Promise<boolean> {
  try {
    const delegation = extractDelegation(event);
    if (!delegation) {
      return false;
    }

    const { kind, created_at } = event;
    const { kind: allowedKind, since, until } = delegation.conditions;

    // Check kind constraint
    if (allowedKind !== undefined && kind !== allowedKind) {
      logger.debug('Event kind does not match delegation conditions');
      return false;
    }

    // Check time constraints
    if (since !== undefined && created_at < since) {
      logger.debug('Event is before delegation start time');
      return false;
    }

    if (until !== undefined && created_at > until) {
      logger.debug('Event is after delegation end time');
      return false;
    }

    // Verify delegation token
    return await verifyDelegation(
      delegation.pubkey,
      event.pubkey,
      delegation.token,
      delegation.conditions
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to validate delegated event: ${errorMessage}`);
    return false;
  }
}
