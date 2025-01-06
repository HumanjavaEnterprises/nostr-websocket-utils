/**
 * @file NIP-05: DNS-Based Verification
 * @module nips/nip-05
 * @see https://github.com/nostr-protocol/nips/blob/master/05.md
 */
import { Logger } from 'pino';
/**
 * NIP-05 verification result
 */
export interface NIP05VerificationResult {
    valid: boolean;
    pubkey?: string;
    relays?: string[];
    error?: string;
}
/**
 * Verifies a NIP-05 identifier
 * @param identifier - Internet identifier (user@domain.com)
 * @param pubkey - Public key to verify
 * @param logger - Logger instance
 * @returns {Promise<NIP05VerificationResult>} Verification result
 */
export declare function verifyNIP05Identifier(identifier: string, pubkey: string, logger: Logger): Promise<NIP05VerificationResult>;
/**
 * Creates metadata event with NIP-05 identifier
 * @param identifier - Internet identifier
 * @param metadata - Additional metadata
 * @returns {Record<string, unknown>} Metadata event content
 */
export declare function createNIP05Metadata(identifier: string, metadata?: Record<string, unknown>): Record<string, unknown>;
/**
 * NIP-05 verification cache interface
 */
export interface NIP05VerificationCache {
    /**
     * Gets cached verification result
     * @param identifier - Internet identifier
     * @param pubkey - Public key
     * @returns {NIP05VerificationResult | undefined} Cached result
     */
    get(identifier: string, pubkey: string): NIP05VerificationResult | undefined;
    /**
     * Sets verification result in cache
     * @param identifier - Internet identifier
     * @param pubkey - Public key
     * @param result - Verification result
     * @param ttl - Time to live in seconds
     */
    set(identifier: string, pubkey: string, result: NIP05VerificationResult, ttl: number): void;
    /**
     * Clears expired entries
     */
    cleanup(): void;
}
/**
 * Creates a NIP-05 verification cache
 * @param defaultTTL - Default TTL in seconds
 * @returns {NIP05VerificationCache} Verification cache
 */
export declare function createNIP05VerificationCache(defaultTTL?: number): NIP05VerificationCache;
/**
 * Batch verification interface for multiple identifiers
 */
export interface NIP05BatchVerifier {
    /**
     * Adds identifier to verification queue
     * @param identifier - Internet identifier
     * @param pubkey - Public key
     */
    addToQueue(identifier: string, pubkey: string): void;
    /**
     * Verifies all queued identifiers
     * @returns {Promise<Map<string, NIP05VerificationResult>>} Verification results
     */
    verifyAll(): Promise<Map<string, NIP05VerificationResult>>;
    /**
     * Clears verification queue
     */
    clearQueue(): void;
}
/**
 * Creates a NIP-05 batch verifier
 * @param logger - Logger instance
 * @param cache - Optional verification cache
 * @returns {NIP05BatchVerifier} Batch verifier
 */
export declare function createNIP05BatchVerifier(logger: Logger, cache?: NIP05VerificationCache): NIP05BatchVerifier;
//# sourceMappingURL=nip-05.d.ts.map