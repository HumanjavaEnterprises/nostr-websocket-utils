/**
 * @file NIP-13: Proof of Work
 * @module nips/nip-13
 * @see https://github.com/nostr-protocol/nips/blob/master/13.md
 */
import { createHash } from 'crypto';
/**
 * Calculates the number of leading zero bits in a hex string
 * @param hex - Hex string to check
 * @returns {number} Number of leading zero bits
 */
export function countLeadingZeroBits(hex) {
    let count = 0;
    for (const char of hex) {
        const nibble = parseInt(char, 16);
        if (nibble === 0) {
            count += 4;
        }
        else {
            count += Math.clz32(nibble) - 28;
            break;
        }
    }
    return count;
}
/**
 * Calculates event ID with proof of work
 * @param event - Event object without ID
 * @param targetDifficulty - Target number of leading zero bits
 * @param maxAttempts - Maximum number of attempts
 * @returns {Promise<string>} Event ID with sufficient proof of work
 */
export async function calculatePowEventId(event, targetDifficulty, maxAttempts = 1000000) {
    let nonce = 0;
    const eventCopy = { ...event };
    while (nonce < maxAttempts) {
        eventCopy.nonce = nonce.toString();
        const serialized = JSON.stringify([
            0,
            eventCopy.pubkey,
            eventCopy.created_at,
            eventCopy.kind,
            eventCopy.tags,
            eventCopy.content,
            eventCopy.nonce
        ]);
        const hash = createHash('sha256').update(serialized).digest('hex');
        const difficulty = countLeadingZeroBits(hash);
        if (difficulty >= targetDifficulty) {
            return hash;
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
export function validateEventPoW(message, minDifficulty, logger) {
    try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') {
            return true; // Not an event message
        }
        const event = message[1];
        if (!event.id || typeof event.id !== 'string') {
            logger.debug('Missing event ID');
            return false;
        }
        // Calculate difficulty
        const difficulty = countLeadingZeroBits(event.id);
        return difficulty >= minDifficulty;
    }
    catch (error) {
        logger.error('Error validating proof of work:', error);
        return false;
    }
}
/**
 * Creates a default difficulty calculator
 * @param baseDifficulty - Base difficulty for all events
 * @param contentMultiplier - Multiplier based on content length
 * @returns {DifficultyCalculator} Difficulty calculator
 */
export function createDifficultyCalculator(baseDifficulty = 8, contentMultiplier = 0.001) {
    return {
        calculateRequiredDifficulty(event) {
            let difficulty = baseDifficulty;
            // Increase difficulty for larger content
            if (typeof event.content === 'string') {
                difficulty += Math.floor(event.content.length * contentMultiplier);
            }
            // Increase difficulty for certain event kinds
            const kind = event.kind;
            if (kind >= 1000) {
                difficulty += 4; // Higher difficulty for application-specific events
            }
            return difficulty;
        }
    };
}
/**
 * Creates a default PoW rate limiter
 * @param windowSeconds - Time window for rate limiting
 * @param maxDifficulty - Maximum cumulative difficulty per window
 * @returns {PowRateLimiter} Rate limiter
 */
export function createPowRateLimiter(windowSeconds = 3600, maxDifficulty = 100) {
    const difficulties = new Map();
    return {
        shouldRateLimit(pubkey, currentTime) {
            const events = difficulties.get(pubkey) || [];
            // Remove old events
            const validEvents = events.filter(([time]) => currentTime - time < windowSeconds);
            // Calculate cumulative difficulty
            const totalDifficulty = validEvents.reduce((sum, [, diff]) => sum + diff, 0);
            return totalDifficulty >= maxDifficulty;
        },
        recordEvent(pubkey, difficulty, currentTime) {
            const events = difficulties.get(pubkey) || [];
            events.push([currentTime, difficulty]);
            difficulties.set(pubkey, events);
        }
    };
}
//# sourceMappingURL=nip-13.js.map