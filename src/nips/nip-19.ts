/**
 * @file NIP-19: bech32-encoded entities
 * @module nips/nip-19
 */

import { getLogger } from '../utils/logger';
import { encodeToBech32, decodeFromBech32 } from '../crypto/bech32';

const logger = getLogger('NIP-19');

/**
 * Encode a public key to bech32 npub format
 */
export function encodePubkey(pubkey: string): string {
  try {
    return encodeToBech32('npub', pubkey);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to encode pubkey: ${errorMessage}`);
    throw new Error(`Failed to encode pubkey: ${errorMessage}`);
  }
}

/**
 * Encode a private key to bech32 nsec format
 */
export function encodePrivkey(privkey: string): string {
  try {
    return encodeToBech32('nsec', privkey);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to encode private key: ${errorMessage}`);
    throw new Error(`Failed to encode private key: ${errorMessage}`);
  }
}

/**
 * Decode a bech32 npub to hex pubkey
 */
export function decodePubkey(npub: string): string {
  try {
    const { prefix, hex } = decodeFromBech32(npub);
    if (prefix !== 'npub') {
      throw new Error('Invalid prefix for public key');
    }
    return hex;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to decode pubkey: ${errorMessage}`);
    throw new Error(`Failed to decode pubkey: ${errorMessage}`);
  }
}

/**
 * Decode a bech32 nsec to hex privkey
 */
export function decodePrivkey(nsec: string): string {
  try {
    const { prefix, hex } = decodeFromBech32(nsec);
    if (prefix !== 'nsec') {
      throw new Error('Invalid prefix for private key');
    }
    return hex;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to decode private key: ${errorMessage}`);
    throw new Error(`Failed to decode private key: ${errorMessage}`);
  }
}

/**
 * Process tags containing bech32-encoded entities
 */
export function processBech32Tags(tags: string[][]): string[][] {
  return tags.map(tag => {
    try {
      if (tag[0] === 'p' && tag[1].startsWith('npub')) {
        return [tag[0], decodePubkey(tag[1])];
      }
      return tag;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.debug(`Failed to decode pubkey ${tag[1]}: ${errorMessage}`);
      return tag;
    }
  });
}

/**
 * Encode tags containing hex pubkeys to bech32
 */
export function encodeBech32Tags(tags: string[][]): string[][] {
  return tags.map(tag => {
    try {
      if (tag[0] === 'p' && !tag[1].startsWith('npub')) {
        return [tag[0], encodePubkey(tag[1])];
      }
      return tag;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.debug(`Failed to encode pubkey ${tag[1]}: ${errorMessage}`);
      return tag;
    }
  });
}
