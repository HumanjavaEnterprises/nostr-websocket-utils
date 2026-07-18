/**
 * bech32 + NIP-19 known-answer tests using the shared Nostr vectors.
 */
import { describe, it, expect } from 'vitest';
import { encodeToBech32, decodeFromBech32, bech32Decode } from '../crypto/bech32.js';
import {
  encodePubkey,
  decodePubkey,
  encodePrivkey,
  decodePrivkey
} from '../nips/nip-19.js';
import vectors from './fixtures/nostr-vectors.json' with { type: 'json' };

const { npub, nsec, note } = vectors.nip19;

describe('NIP-19 known-answer vectors', () => {
  it('encodes and decodes npub', () => {
    expect(encodePubkey(npub.hex)).toBe(npub.encoded);
    expect(decodePubkey(npub.encoded)).toBe(npub.hex);
  });

  it('encodes and decodes nsec', () => {
    expect(encodePrivkey(nsec.hex)).toBe(nsec.encoded);
    expect(decodePrivkey(nsec.encoded)).toBe(nsec.hex);
  });

  it('encodes note (event id)', () => {
    expect(encodeToBech32('note', note.hex)).toBe(note.encoded);
    const { prefix, hex } = decodeFromBech32(note.encoded);
    expect(prefix).toBe('note');
    expect(hex).toBe(note.hex);
  });
});

describe('bech32 robustness', () => {
  it('decodes an all-uppercase npub (BIP-173 / QR form)', () => {
    const upper = npub.encoded.toUpperCase();
    const { hrp } = bech32Decode(upper);
    expect(hrp).toBe('npub');
    expect(decodeFromBech32(upper).hex).toBe(npub.hex);
  });

  it('round-trips a >90-char nprofile TLV payload (limit lifted for NIP-19)', () => {
    const tlvHex = 'ab'.repeat(70); // 140 hex chars -> encoded string > 90 chars
    const encoded = encodeToBech32('nprofile', tlvHex);
    expect(encoded.length).toBeGreaterThan(90);
    expect(decodeFromBech32(encoded).hex).toBe(tlvHex);
  });

  it('throws on odd-length hex input', () => {
    expect(() => encodeToBech32('npub', 'aabbc')).toThrow();
  });

  it('throws on non-hex input', () => {
    expect(() => encodeToBech32('npub', 'zzzz')).toThrow();
  });

  it('encodePubkey rejects a non-64-char key', () => {
    expect(() => encodePubkey('deadbeef')).toThrow();
  });

  it('decodePubkey rejects a note (wrong prefix)', () => {
    expect(() => decodePubkey(note.encoded)).toThrow();
  });
});
