/**
 * @file NIP-05: DNS-Based Verification
 * @module nips/nip-05
 * @see https://github.com/nostr-protocol/nips/blob/master/05.md
 */
import { fetchJson } from '../utils/http.js';
/**
 * Verifies a NIP-05 identifier
 * @param identifier - Internet identifier (user@domain.com)
 * @param pubkey - Public key to verify
 * @param logger - Logger instance
 * @returns {Promise<NIP05VerificationResult>} Verification result
 */
export async function verifyNIP05Identifier(identifier, pubkey, logger) {
    try {
        // Parse identifier
        const [name, domain] = identifier.split('@');
        if (!name || !domain) {
            return {
                valid: false,
                error: 'Invalid identifier format'
            };
        }
        // Fetch well-known URL
        const url = `https://${domain}/.well-known/nostr.json?name=${name}`;
        const response = await fetchJson(url);
        if (!response || !response.names || !response.names[name]) {
            return {
                valid: false,
                error: 'Name not found in well-known file'
            };
        }
        // Verify name matches pubkey
        const verifiedPubkey = response.names[name];
        if (!verifiedPubkey) {
            return {
                valid: false,
                error: 'Name not found'
            };
        }
        if (verifiedPubkey !== pubkey) {
            return {
                valid: false,
                error: 'Public key mismatch'
            };
        }
        // Get associated relays if available
        const relays = response.relays?.[verifiedPubkey];
        return {
            valid: true,
            pubkey: verifiedPubkey,
            relays
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`NIP-05 verification failed: ${errorMessage}`);
        return {
            valid: false,
            error: errorMessage
        };
    }
}
/**
 * Creates metadata event with NIP-05 identifier
 * @param identifier - Internet identifier
 * @param metadata - Additional metadata
 * @returns {Record<string, unknown>} Metadata event content
 */
export function createNIP05Metadata(identifier, metadata = {}) {
    return {
        ...metadata,
        nip05: identifier
    };
}
/**
 * Creates a NIP-05 verification cache
 * @param defaultTTL - Default TTL in seconds
 * @returns {NIP05VerificationCache} Verification cache
 */
export function createNIP05VerificationCache(defaultTTL = 3600) {
    const cache = new Map();
    function getCacheKey(identifier, pubkey) {
        return `${identifier}:${pubkey}`;
    }
    return {
        get(identifier, pubkey) {
            const key = getCacheKey(identifier, pubkey);
            const entry = cache.get(key);
            if (!entry)
                return undefined;
            if (Date.now() > entry.expiresAt) {
                cache.delete(key);
                return undefined;
            }
            return entry.result;
        },
        set(identifier, pubkey, result, ttl = defaultTTL) {
            const key = getCacheKey(identifier, pubkey);
            cache.set(key, {
                result,
                expiresAt: Date.now() + (ttl * 1000)
            });
        },
        cleanup() {
            const now = Date.now();
            for (const [key, entry] of cache.entries()) {
                if (now > entry.expiresAt) {
                    cache.delete(key);
                }
            }
        }
    };
}
/**
 * Creates a NIP-05 batch verifier
 * @param logger - Logger instance
 * @param cache - Optional verification cache
 * @returns {NIP05BatchVerifier} Batch verifier
 */
export function createNIP05BatchVerifier(logger, cache) {
    const queue = new Map();
    return {
        addToQueue(identifier, pubkey) {
            queue.set(identifier, pubkey);
        },
        async verifyAll() {
            const results = new Map();
            for (const [identifier, pubkey] of queue.entries()) {
                // Check cache first
                if (cache) {
                    const cached = cache.get(identifier, pubkey);
                    if (cached) {
                        results.set(identifier, cached);
                        continue;
                    }
                }
                // Verify and cache result
                const result = await verifyNIP05Identifier(identifier, pubkey, logger);
                results.set(identifier, result);
                if (cache) {
                    cache.set(identifier, pubkey, result, 3600);
                }
            }
            return results;
        },
        clearQueue() {
            queue.clear();
        }
    };
}
//# sourceMappingURL=nip-05.js.map