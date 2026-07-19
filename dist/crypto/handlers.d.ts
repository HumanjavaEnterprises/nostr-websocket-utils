/**
 * @file Crypto handlers for Nostr messages
 * @module crypto/handlers
 */
import type { NostrWSMessage } from '../types/messages.js';
/**
 * Validates a signed message
 * @param message - Message to validate
 * @returns Promise resolving to true if message is valid
 */
export declare function validateSignedMessage(message: NostrWSMessage): Promise<boolean>;
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
export declare function validateSignature(message: NostrWSMessage, logger?: {
    debug: (...a: unknown[]) => void;
    error: (...a: unknown[]) => void;
}): Promise<boolean>;
//# sourceMappingURL=handlers.d.ts.map