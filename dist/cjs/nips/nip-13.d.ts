/**
 * @file NIP-13: Proof of Work
 * @module nips/nip-13
 * @see https://github.com/nostr-protocol/nips/blob/master/13.md
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
/**
 * Calculates the number of leading zero bits in a hex string
 * @param hex - Hex string to check
 * @returns {number} Number of leading zero bits
 */
export declare function countLeadingZeroBits(hex: string): number;
/**
 * Result of mining proof of work.
 */
export interface PowResult {
    /** The mined event id (sha256 of the NIP-01 serialization including the nonce tag) */
    id: string;
    /** The winning nonce */
    nonce: number;
    /** The event tags including the committed ["nonce", <n>, <target>] tag */
    tags: string[][];
}
/**
 * Mines proof of work for an event per NIP-13: the nonce lives in a
 * ["nonce", "<n>", "<target>"] tag inside the standard NIP-01 id preimage.
 * @param event - Event object without id (must have pubkey/created_at/kind/tags/content)
 * @param targetDifficulty - Target number of leading zero bits
 * @param maxAttempts - Maximum number of attempts
 * @returns {Promise<PowResult>} The mined id, winning nonce, and committed tags
 */
export declare function calculatePowEventId(event: Record<string, unknown>, targetDifficulty: number, maxAttempts?: number): Promise<PowResult>;
/**
 * Validates proof of work for an event
 * @param message - Message containing event
 * @param minDifficulty - Minimum required difficulty
 * @param logger - Logger instance
 * @returns {boolean} True if proof of work is valid
 */
export declare function validateEventPoW(message: NostrWSMessage, minDifficulty: number, logger: Logger): boolean;
/**
 * Dynamic difficulty calculator based on event type and content
 */
export interface DifficultyCalculator {
    /**
     * Calculates required difficulty for an event
     * @param event - Event to check
     * @returns {number} Required number of leading zero bits
     */
    calculateRequiredDifficulty(event: Record<string, unknown>): number;
}
/**
 * Creates a default difficulty calculator
 * @param baseDifficulty - Base difficulty for all events
 * @param contentMultiplier - Multiplier based on content length
 * @returns {DifficultyCalculator} Difficulty calculator
 */
export declare function createDifficultyCalculator(baseDifficulty?: number, contentMultiplier?: number): DifficultyCalculator;
/**
 * Rate limiter interface for proof of work
 */
export interface PowRateLimiter {
    /**
     * Checks if an event should be rate limited
     * @param pubkey - Publisher's public key
     * @param currentTime - Current timestamp
     * @returns {boolean} True if should be rate limited
     */
    shouldRateLimit(pubkey: string, currentTime: number): boolean;
    /**
     * Records an event for rate limiting
     * @param pubkey - Publisher's public key
     * @param difficulty - Event difficulty
     * @param currentTime - Current timestamp
     */
    recordEvent(pubkey: string, difficulty: number, currentTime: number): void;
}
/**
 * Creates a default PoW rate limiter
 * @param windowSeconds - Time window for rate limiting
 * @param maxDifficulty - Maximum cumulative difficulty per window
 * @returns {PowRateLimiter} Rate limiter
 */
export declare function createPowRateLimiter(windowSeconds?: number, maxDifficulty?: number): PowRateLimiter;
//# sourceMappingURL=nip-13.d.ts.map