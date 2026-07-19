/**
 * NIP-13 proof-of-work tests.
 * Locks down the rewrite: mining commits the nonce in a ["nonce", n, target]
 * tag inside the standard NIP-01 id preimage, and validateEventPoW recomputes
 * the id (never trusts a claimed one).
 */
import { describe, it, expect, vi } from 'vitest';
import { createHash } from 'crypto';
import {
  calculatePowEventId,
  validateEventPoW,
  countLeadingZeroBits
} from '../nips/nip-13.js';
import type { NostrWSMessage } from '../types/messages.js';

const silentLogger = { debug: vi.fn(), error: vi.fn() } as unknown as import('../types/logger.js').Logger;

const baseEvent = {
  pubkey: '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
  created_at: 1700000000,
  kind: 1,
  tags: [['t', 'nostr']],
  content: 'proof of work test'
};

function recomputeId(ev: { pubkey: unknown; created_at: unknown; kind: unknown; tags: unknown; content: unknown }): string {
  return createHash('sha256')
    .update(JSON.stringify([0, ev.pubkey, ev.created_at, ev.kind, ev.tags, ev.content]))
    .digest('hex');
}

describe('NIP-13 proof of work', () => {
  it('mined id equals the recomputed id of the returned event', async () => {
    const target = 8;
    const { id, nonce, tags } = await calculatePowEventId(baseEvent, target);

    // The nonce tag is committed inside the id preimage.
    const nonceTag = tags.find(t => t[0] === 'nonce');
    expect(nonceTag).toEqual(['nonce', String(nonce), String(target)]);

    const recomputed = recomputeId({ ...baseEvent, tags });
    expect(id).toBe(recomputed);
    expect(countLeadingZeroBits(id)).toBeGreaterThanOrEqual(target);
  });

  it('validateEventPoW accepts a genuinely mined event', async () => {
    const target = 8;
    const { id, tags } = await calculatePowEventId(baseEvent, target);
    const event = { ...baseEvent, tags, id, sig: 'a'.repeat(128) };
    expect(validateEventPoW(['EVENT', event] as unknown as NostrWSMessage, target, silentLogger)).toBe(true);
  });

  it('rejects a forged id of "0000..." that does not match the content', () => {
    const event = { ...baseEvent, id: '0'.repeat(64), sig: 'a'.repeat(128) };
    expect(validateEventPoW(['EVENT', event] as unknown as NostrWSMessage, 8, silentLogger)).toBe(false);
  });

  it('rejects a real id whose difficulty is below the minimum', () => {
    // id computed correctly but with no PoW -> very unlikely to have 32 leading zero bits.
    const id = recomputeId({ ...baseEvent, tags: baseEvent.tags });
    const event = { ...baseEvent, id, sig: 'a'.repeat(128) };
    expect(validateEventPoW(['EVENT', event] as unknown as NostrWSMessage, 32, silentLogger)).toBe(false);
  });
});
