/**
 * @file NIP-05: DNS-Based Verification
 * @module nips/nip-05
 * @see https://github.com/nostr-protocol/nips/blob/master/05.md
 */

import { fetchJson } from '../utils/http';

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
 * NIP-05 verification response
 */
interface NIP05Response {
  names: Record<string, string>;
  relays?: Record<string, string[]>;
}

/**
 * Verifies a NIP-05 identifier
 * @param identifier - Internet identifier (user@domain.com)
 * @param pubkey - Public key to verify
 * @param logger - Logger instance
 * @returns {Promise<NIP05VerificationResult>} Verification result
 */
export async function verifyNIP05Identifier(
  identifier: string,
  pubkey: string,
  logger: any
): Promise<NIP05VerificationResult> {
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
    const response = await fetchJson<NIP05Response>(url);
    
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
  } catch (error: unknown) {
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
export function createNIP05Metadata(
  identifier: string,
  metadata: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    ...metadata,
    nip05: identifier
  };
}

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
  set(
    identifier: string,
    pubkey: string,
    result: NIP05VerificationResult,
    ttl: number
  ): void;

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
export function createNIP05VerificationCache(
  defaultTTL: number = 3600
): NIP05VerificationCache {
  interface CacheEntry {
    result: NIP05VerificationResult;
    expiresAt: number;
  }

  const cache = new Map<string, CacheEntry>();

  function getCacheKey(identifier: string, pubkey: string): string {
    return `${identifier}:${pubkey}`;
  }

  return {
    get(identifier: string, pubkey: string): NIP05VerificationResult | undefined {
      const key = getCacheKey(identifier, pubkey);
      const entry = cache.get(key);
      
      if (!entry) return undefined;
      
      if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return undefined;
      }
      
      return entry.result;
    },

    set(
      identifier: string,
      pubkey: string,
      result: NIP05VerificationResult,
      ttl: number = defaultTTL
    ): void {
      const key = getCacheKey(identifier, pubkey);
      cache.set(key, {
        result,
        expiresAt: Date.now() + (ttl * 1000)
      });
    },

    cleanup(): void {
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
export function createNIP05BatchVerifier(
  logger: any,
  cache?: NIP05VerificationCache
): NIP05BatchVerifier {
  const queue = new Map<string, string>();

  return {
    addToQueue(identifier: string, pubkey: string): void {
      queue.set(identifier, pubkey);
    },

    async verifyAll(): Promise<Map<string, NIP05VerificationResult>> {
      const results = new Map<string, NIP05VerificationResult>();
      
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

    clearQueue(): void {
      queue.clear();
    }
  };
}
