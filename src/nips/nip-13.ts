/**
 * @file NIP-13: Proof of Work
 * @module nips/nip-13
 * @see https://github.com/nostr-protocol/nips/blob/master/13.md
 */

import { createHash } from 'crypto';
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';

/**
 * Calculates the number of leading zero bits in a hex string
 * @param hex - Hex string to check
 * @returns {number} Number of leading zero bits
 */
export function countLeadingZeroBits(hex: string): number {
  let count = 0;
  for (const char of hex) {
    const nibble = parseInt(char, 16);
    if (nibble === 0) {
      count += 4;
    } else {
      count += Math.clz32(nibble) - 28;
      break;
    }
  }
  return count;
}

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
 * Computes the NIP-01 event id (sha256 of [0,pubkey,created_at,kind,tags,content]).
 */
function computeEventId(event: {
  pubkey: unknown;
  created_at: unknown;
  kind: unknown;
  tags: unknown;
  content: unknown;
}): string {
  const serialized = JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content
  ]);
  return createHash('sha256').update(serialized).digest('hex');
}

/**
 * Mines proof of work for an event per NIP-13: the nonce lives in a
 * ["nonce", "<n>", "<target>"] tag inside the standard NIP-01 id preimage.
 * @param event - Event object without id (must have pubkey/created_at/kind/tags/content)
 * @param targetDifficulty - Target number of leading zero bits
 * @param maxAttempts - Maximum number of attempts
 * @returns {Promise<PowResult>} The mined id, winning nonce, and committed tags
 */
export async function calculatePowEventId(
  event: Record<string, unknown>,
  targetDifficulty: number,
  maxAttempts: number = 1000000
): Promise<PowResult> {
  const baseTags = Array.isArray(event.tags)
    ? (event.tags as string[][]).filter(tag => tag[0] !== 'nonce')
    : [];

  let nonce = 0;
  while (nonce < maxAttempts) {
    const tags: string[][] = [
      ...baseTags,
      ['nonce', String(nonce), String(targetDifficulty)]
    ];

    const id = computeEventId({
      pubkey: event.pubkey,
      created_at: event.created_at,
      kind: event.kind,
      tags,
      content: event.content
    });

    if (countLeadingZeroBits(id) >= targetDifficulty) {
      return { id, nonce, tags };
    }

    nonce++;
  }

  throw new Error('Failed to find proof of work within maximum attempts');
}

/**
 * Validates proof of work for an event
 * @param message - Message containing event
 * @param minDifficulty - Minimum required difficulty
 * @param logger - Logger instance
 * @returns {boolean} True if proof of work is valid
 */
export function validateEventPoW(
  message: NostrWSMessage,
  minDifficulty: number,
  logger: Logger
): boolean {
  try {
    if (!Array.isArray(message) || message[0] !== 'EVENT') {
      return true; // Not an event message
    }

    const event = message[1] as Record<string, unknown>;
    if (!event.id || typeof event.id !== 'string') {
      logger.debug('Missing event ID');
      return false;
    }

    // Recompute the id from the event's own fields — never trust a claimed id
    // (a forger could otherwise just set id="0000...").
    const recomputedId = computeEventId({
      pubkey: event.pubkey,
      created_at: event.created_at,
      kind: event.kind,
      tags: event.tags,
      content: event.content
    });

    if (recomputedId !== event.id) {
      logger.debug('Event id does not match its content');
      return false;
    }

    // Calculate difficulty from the verified id
    const difficulty = countLeadingZeroBits(recomputedId);
    return difficulty >= minDifficulty;
  } catch (error) {
    logger.error({ error }, 'Error validating proof of work');
    return false;
  }
}

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
export function createDifficultyCalculator(
  baseDifficulty: number = 8,
  contentMultiplier: number = 0.001
): DifficultyCalculator {
  return {
    calculateRequiredDifficulty(event: Record<string, unknown>): number {
      let difficulty = baseDifficulty;

      // Increase difficulty for larger content
      if (typeof event.content === 'string') {
        difficulty += Math.floor(event.content.length * contentMultiplier);
      }

      // Increase difficulty for certain event kinds
      const kind = event.kind as number;
      if (kind >= 1000) {
        difficulty += 4; // Higher difficulty for application-specific events
      }

      return difficulty;
    }
  };
}

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
export function createPowRateLimiter(
  windowSeconds: number = 3600,
  maxDifficulty: number = 100
): PowRateLimiter {
  const difficulties = new Map<string, Array<[number, number]>>();

  return {
    shouldRateLimit(pubkey: string, currentTime: number): boolean {
      const events = difficulties.get(pubkey) || [];
      
      // Remove old events
      const validEvents = events.filter(([time]) => 
        currentTime - time < windowSeconds
      );
      
      // Calculate cumulative difficulty
      const totalDifficulty = validEvents.reduce(
        (sum, [, diff]) => sum + diff,
        0
      );
      
      return totalDifficulty >= maxDifficulty;
    },

    recordEvent(pubkey: string, difficulty: number, currentTime: number): void {
      const events = difficulties.get(pubkey) || [];
      events.push([currentTime, difficulty]);
      difficulties.set(pubkey, events);
    }
  };
}
