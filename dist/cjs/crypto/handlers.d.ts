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
 * Validates a signature
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns True if signature is valid
 */
export declare function validateSignature(message: NostrWSMessage, logger: any): boolean;
//# sourceMappingURL=handlers.d.ts.map