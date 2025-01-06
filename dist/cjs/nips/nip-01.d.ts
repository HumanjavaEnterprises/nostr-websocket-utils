/**
 * @file NIP-01: Basic protocol flow implementation
 * @module nips/nip-01
 */
import type { NostrWSMessage, NostrEvent } from '../types/messages.js';
interface NostrEventValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * Validates a message according to NIP-01 specifications
 */
export declare function validateMessage(message: NostrWSMessage): boolean;
/**
 * Creates an EVENT message
 */
export declare function createEventMessage(event: NostrEvent): NostrWSMessage;
/**
 * Creates a REQ message
 */
export declare function createReqMessage(subscriptionId: string, filters: Array<Record<string, unknown>>): NostrWSMessage;
/**
 * Creates a CLOSE message
 */
export declare function createCloseMessage(subscriptionId: string): NostrWSMessage;
/**
 * Creates a NOTICE message
 */
export declare function createNoticeMessage(message: string): NostrWSMessage;
/**
 * Validates a Nostr event according to NIP-01
 */
export declare function validateEvent(event: NostrEvent): NostrEventValidationResult;
export {};
//# sourceMappingURL=nip-01.d.ts.map