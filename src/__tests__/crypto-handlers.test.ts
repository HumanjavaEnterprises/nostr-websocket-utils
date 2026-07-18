/**
 * Signature-validation tests.
 * Locks down the security fix: validateSignature must perform real BIP-340
 * verification (it previously returned true for any event with a string sig).
 */
import { describe, it, expect, vi } from 'vitest';
import { finalizeEvent } from 'nostr-crypto-utils';
import { validateSignature, validateSignedMessage } from '../crypto/handlers.js';
import type { NostrWSMessage } from '../types/messages.js';
import vectors from './fixtures/nostr-vectors.json' with { type: 'json' };

const alice = vectors.keypairs.alice;

const silentLogger = { debug: vi.fn(), error: vi.fn() };

async function signedEvent() {
  return await finalizeEvent(
    {
      kind: 1,
      created_at: 1700000000,
      tags: [],
      content: 'authentic message'
    },
    alice.privateKey
  );
}

describe('validateSignature (real BIP-340 verification)', () => {
  it('accepts a validly signed EVENT', async () => {
    const event = await signedEvent();
    const ok = await validateSignature(['EVENT', event] as NostrWSMessage, silentLogger);
    expect(ok).toBe(true);
  });

  it('rejects a forged EVENT (tampered sig)', async () => {
    const event = await signedEvent();
    const forged = { ...event, sig: 'd'.repeat(128) };
    const ok = await validateSignature(['EVENT', forged] as NostrWSMessage, silentLogger);
    expect(ok).toBe(false);
  });

  it('rejects a forged EVENT (tampered content, stale sig)', async () => {
    const event = await signedEvent();
    const forged = { ...event, content: 'malicious override' };
    const ok = await validateSignature(['EVENT', forged] as NostrWSMessage, silentLogger);
    expect(ok).toBe(false);
  });

  it('returns false for non-EVENT messages (not "not applicable => valid")', async () => {
    expect(await validateSignature(['NOTICE', 'hi'] as NostrWSMessage, silentLogger)).toBe(false);
    expect(await validateSignature(['REQ', 'sub'] as NostrWSMessage, silentLogger)).toBe(false);
  });
});

describe('validateSignedMessage', () => {
  it('accepts a validly signed EVENT', async () => {
    const event = await signedEvent();
    expect(await validateSignedMessage(['EVENT', event] as NostrWSMessage)).toBe(true);
  });

  it('rejects a forged EVENT', async () => {
    const event = await signedEvent();
    const forged = { ...event, sig: '0'.repeat(128) };
    expect(await validateSignedMessage(['EVENT', forged] as NostrWSMessage)).toBe(false);
  });
});
