/**
 * @file NIP-11: Relay Information Document
 * @module nips/nip-11
 * @see https://github.com/nostr-protocol/nips/blob/master/11.md
 */

import { getLogger } from '../utils/logger.js';
import { fetchJson } from '../utils/http.js';

const logger = getLogger('NIP-11');

/**
 * Relay information document structure
 */
export interface RelayInformation {
  name?: string;
  description?: string;
  pubkey?: string;
  contact?: string;
  supported_nips?: number[];
  software?: string;
  version?: string;
  limitation?: {
    max_message_length?: number;
    max_subscriptions?: number;
    max_filters?: number;
    max_limit?: number;
    max_subid_length?: number;
    min_prefix?: number;
    max_event_tags?: number;
    max_content_length?: number;
    min_pow_difficulty?: number;
    auth_required?: boolean;
    payment_required?: boolean;
  };
}

/**
 * Fetches relay information document
 * @param url - Relay URL (ws:// or wss://)
 * @returns {Promise<RelayInformation>} Relay information
 */
export async function getRelayInformation(url: string): Promise<RelayInformation> {
  try {
    const relayUrl = url.replace('ws://', 'http://').replace('wss://', 'https://');
    const response = await fetchJson<RelayInformation>(`${relayUrl}/.well-known/nostr.json`);
    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to fetch relay information: ${errorMessage}`);
    throw new Error(`Failed to fetch relay information: ${errorMessage}`);
  }
}

/**
 * Checks if relay meets requirements
 * @param relay - Relay information
 * @param requirements - Required relay features
 * @returns {boolean} True if relay meets all requirements
 */
export function checkRelayRequirements(
  relay: RelayInformation,
  requirements: Partial<RelayInformation>
): boolean {
  try {
    // Check supported NIPs
    if (requirements.supported_nips && relay.supported_nips) {
      const missingNips = requirements.supported_nips.filter(
        nip => !relay.supported_nips?.includes(nip)
      );
      if (missingNips.length > 0) {
        logger.debug(`Missing required NIPs: ${missingNips.join(', ')}`);
        return false;
      }
    }

    // Check limitations
    if (requirements.limitation && relay.limitation) {
      for (const [key, value] of Object.entries(requirements.limitation)) {
        const relayValue = relay.limitation[key as keyof typeof relay.limitation];
        
        // Skip if relay doesn't specify this limitation
        if (relayValue === undefined) continue;

        // For maximum values, relay should support at least the required value
        if (key.startsWith('max_') && typeof relayValue === 'number' && typeof value === 'number') {
          if (relayValue < value) {
            logger.debug(`Relay ${key} too low: ${relayValue} < ${value}`);
            return false;
          }
        }

        // For minimum values, relay should not require more than specified
        if (key.startsWith('min_') && typeof relayValue === 'number' && typeof value === 'number') {
          if (relayValue > value) {
            logger.debug(`Relay ${key} too high: ${relayValue} > ${value}`);
            return false;
          }
        }

        // For boolean flags, values must match if specified
        if (typeof relayValue === 'boolean' && typeof value === 'boolean') {
          if (relayValue !== value) {
            logger.debug(`Relay ${key} mismatch: ${relayValue} !== ${value}`);
            return false;
          }
        }
      }
    }

    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error checking relay requirements: ${errorMessage}`);
    return false;
  }
}

/**
 * Validates relay capabilities against required features
 * @param info - Relay information
 * @param requiredNips - Required NIPs
 * @param requiredFeatures - Required relay features
 * @returns {boolean} True if relay supports all required features
 */
export function validateRelayCapabilities(
  info: RelayInformation,
  requiredNips: number[] = [],
  requiredFeatures: Partial<RelayInformation['limitation']> = {}
): boolean {
  // Check NIP support
  if (requiredNips.length > 0) {
    if (!info.supported_nips) return false;
    if (!requiredNips.every(nip => info.supported_nips?.includes(nip))) {
      return false;
    }
  }

  // Check limitations
  if (info.limitation) {
    for (const [key, value] of Object.entries(requiredFeatures)) {
      const relayValue = info.limitation[key as keyof RelayInformation['limitation']];
      if (relayValue === undefined) return false;
      
      // For maximum values, relay limit should be higher
      if (key.startsWith('max_') && typeof relayValue === 'number' && typeof value === 'number') {
        if (relayValue < value) return false;
      }
      
      // For minimum values, relay limit should be lower
      if (key.startsWith('min_') && typeof relayValue === 'number' && typeof value === 'number') {
        if (relayValue > value) return false;
      }
      
      // For boolean flags, must match exactly
      if (typeof relayValue === 'boolean' && typeof value === 'boolean') {
        if (relayValue !== value) return false;
      }
    }
  }

  return true;
}

/**
 * Creates a relay selection score based on capabilities
 * @param info - Relay information
 * @param preferences - Scoring preferences
 * @returns {number} Relay score (higher is better)
 */
export function scoreRelayCapabilities(
  info: RelayInformation,
  preferences: {
    preferredNips?: number[];
    minMessageLength?: number;
    minSubscriptions?: number;
    requireAuth?: boolean;
    requirePayment?: boolean;
  } = {}
): number {
  let score = 0;

  // Score NIP support
  if (info.supported_nips && preferences.preferredNips) {
    score += preferences.preferredNips.filter(nip => 
      info.supported_nips?.includes(nip)
    ).length * 10;
  }

  // Score limitations
  if (info.limitation) {
    const limits = info.limitation;
    
    // Message length
    if (limits.max_message_length && preferences.minMessageLength) {
      score += limits.max_message_length >= preferences.minMessageLength ? 5 : -5;
    }
    
    // Subscriptions
    if (limits.max_subscriptions && preferences.minSubscriptions) {
      score += limits.max_subscriptions >= preferences.minSubscriptions ? 5 : -5;
    }
    
    // Auth requirements
    if (preferences.requireAuth !== undefined) {
      score += (limits.auth_required === preferences.requireAuth) ? 5 : -10;
    }
    
    // Payment requirements
    if (preferences.requirePayment !== undefined) {
      score += (limits.payment_required === preferences.requirePayment) ? 5 : -10;
    }
  }

  return score;
}
