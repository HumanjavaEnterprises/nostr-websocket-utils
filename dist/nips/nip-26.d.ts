/**
 * @file NIP-26: Delegated Event Signing
 * @module nips/nip-26
 * @see https://github.com/nostr-protocol/nips/blob/master/26.md
 *
 * A delegation token is a BIP-340 schnorr signature over
 * sha256(utf8("nostr:delegation:<delegatee>:<conditions>")), NOT an event
 * signature. Both creation and verification serialize the conditions the same
 * way and hash the same string, so tokens round-trip and interoperate with
 * nostr-tools / nak / relays enforcing NIP-26.
 */
import type { NostrEvent } from '../types/events.js';
/**
 * Represents the conditions for a Nostr event delegation.
 * @property {number} [kind] - The kind of events this delegation is valid for
 * @property {number} [since] - Unix timestamp from which this delegation is valid (created_at>since)
 * @property {number} [until] - Unix timestamp until which this delegation is valid (created_at<until)
 */
interface DelegationConditions {
    kind?: number;
    since?: number;
    until?: number;
}
/**
 * Represents a Nostr event delegation.
 * @property {string} pubkey - The public key of the delegator
 * @property {DelegationConditions} conditions - The conditions under which this delegation is valid
 * @property {string} token - The delegation token (schnorr sig) signed by the delegator
 */
interface Delegation {
    pubkey: string;
    conditions: DelegationConditions;
    token: string;
}
/**
 * Serialize delegation conditions into the NIP-26 query string grammar,
 * e.g. "kind=1&created_at>1700000000&created_at<1800000000".
 */
export declare function serializeConditions(conditions: DelegationConditions): string;
/**
 * Parse the NIP-26 conditions query string back into structured conditions.
 */
export declare function parseConditions(conditionsString: string): DelegationConditions;
/**
 * Create a delegation token: schnorr(sha256("nostr:delegation:<delegatee>:<conditions>")).
 * @returns The hex-encoded delegation token.
 */
export declare function createDelegation(delegatorPrivkey: string, delegateePubkey: string, conditions: DelegationConditions): Promise<string>;
/**
 * Verify a delegation token against the delegator's public key.
 */
export declare function verifyDelegation(delegatorPubkey: string, delegateePubkey: string, token: string, conditions: DelegationConditions): Promise<boolean>;
/**
 * Add a delegation tag to an event.
 * The tag carries the NIP-26 conditions string verbatim.
 */
export declare function addDelegationTag(event: NostrEvent, delegation: Delegation): NostrEvent;
/**
 * Extract delegation from an event.
 */
export declare function extractDelegation(event: NostrEvent): Delegation | null;
/**
 * Validate a delegated event: check conditions then verify the delegation token.
 */
export declare function validateDelegatedEvent(event: NostrEvent): Promise<boolean>;
export {};
//# sourceMappingURL=nip-26.d.ts.map