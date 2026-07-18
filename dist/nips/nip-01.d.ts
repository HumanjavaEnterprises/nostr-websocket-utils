/**
 * @file NIP-01: Basic protocol flow implementation
 * @module nips/nip-01
 * @see https://github.com/nostr-protocol/nips/blob/master/01.md
 *
 * All builders emit spec-shaped positional arrays exactly as they appear on the
 * wire, e.g. ["REQ", <subId>, <filter1>, <filter2>...], ["CLOSE", <subId>],
 * ["NOTICE", <message>]. Do NOT wrap arguments in an object — real relays
 * (strfry / nostream / Damus-compatible) reject the object form.
 */
import type { NostrWSMessage, NostrEvent } from '../types/messages.js';
interface NostrEventValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * Validates a message according to NIP-01 wire specifications.
 * Accepts both client->relay messages (EVENT / REQ / CLOSE) and
 * relay->client control messages (NOTICE / EOSE / OK / CLOSED) whose
 * second element is a string or boolean rather than an object.
 */
export declare function validateMessage(message: NostrWSMessage): boolean;
/**
 * Creates an EVENT message: ["EVENT", <event>]
 */
export declare function createEventMessage(event: NostrEvent): NostrWSMessage;
/**
 * Creates a REQ message: ["REQ", <subscriptionId>, <filter1>, <filter2>, ...]
 */
export declare function createReqMessage(subscriptionId: string, filters: Array<Record<string, unknown>>): NostrWSMessage;
/**
 * Creates a CLOSE message: ["CLOSE", <subscriptionId>]
 */
export declare function createCloseMessage(subscriptionId: string): NostrWSMessage;
/**
 * Creates a NOTICE message: ["NOTICE", <message>]
 */
export declare function createNoticeMessage(message: string): NostrWSMessage;
/**
 * Validates a Nostr event according to NIP-01.
 * Uses strict type checks (never truthiness) so valid kind:0, empty-content,
 * and created_at:0 events pass, and enforces hex format on id/pubkey/sig.
 */
export declare function validateEvent(event: NostrEvent): NostrEventValidationResult;
export {};
//# sourceMappingURL=nip-01.d.ts.map