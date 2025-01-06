/**
 * @file NIP-26: Delegated Event Signing
 * @module nips/nip-26
 */
import type { NostrEvent } from '../types/events.js';
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
export declare function createDelegation(delegatorPrivkey: string, delegateePubkey: string, conditions: DelegationConditions): Promise<string>;
/**
 * Verify a delegation token
 */
export declare function verifyDelegation(delegatorPubkey: string, delegateePubkey: string, token: string, conditions: DelegationConditions): Promise<boolean>;
/**
 * Add delegation tag to an event
 */
export declare function addDelegationTag(event: NostrEvent, delegation: Delegation): NostrEvent;
/**
 * Extract delegation from an event
 */
export declare function extractDelegation(event: NostrEvent): Delegation | null;
/**
 * Validate a delegated event
 */
export declare function validateDelegatedEvent(event: NostrEvent): Promise<boolean>;
export {};
//# sourceMappingURL=nip-26.d.ts.map