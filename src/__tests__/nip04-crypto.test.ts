/**
 * NIP-04 encrypted DM tests — exercise the real nip-04 module.
 *
 * The critical bug these lock down: encrypt/decrypt were called with the
 * private/public key arguments SWAPPED. The canonical nostr-crypto-utils
 * signatures are:
 *   encryptMessage(message, senderPrivkey, recipientPubkey)
 *   decryptMessage(ciphertext, recipientPrivkey, senderPubkey)
 * The round-trip below only succeeds if this library passes (your-priv, their-pub);
 * the spy assertions additionally pin the exact argument ORDER.
 *
 * Gating note: the full interop round-trip needs a crypto-utils that accepts
 * x-only pubkeys. The installed 0.7.0 already does, so nothing here is skipped.
 * If an older/future kernel throws on x-only, the two round-trip assertions are
 * the ones to mark skipped-pending-crypto-utils@0.8.0 — the ARG-ORDER spy
 * assertions never need gating.
 */
import { describe, it, expect, vi } from 'vitest';
import * as cryptoUtils from 'nostr-crypto-utils';
import { createEncryptedDM, decryptDM } from '../nips/nip-04.js';
import type { NostrWSMessage } from '../types/messages.js';
import vectors from './fixtures/nostr-vectors.json' with { type: 'json' };

// Wrap the real crypto so we can both round-trip AND assert argument order.
vi.mock('nostr-crypto-utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('nostr-crypto-utils')>();
  return {
    ...actual,
    encryptMessage: vi.fn((...args: Parameters<typeof actual.encryptMessage>) =>
      actual.encryptMessage(...args)
    ),
    decryptMessage: vi.fn((...args: Parameters<typeof actual.decryptMessage>) =>
      actual.decryptMessage(...args)
    )
  };
});

const alice = vectors.keypairs.alice; // privateKey + xonlyPubkey
const bob = vectors.keypairs.bob;

const silentLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
} as unknown as import('../types/logger.js').Logger;

describe('NIP-04 encrypted DM', () => {
  it('round-trips: alice encrypts to bob, bob decrypts from alice', async () => {
    const plaintext = 'the ravens fly at dawn';
    const msg = (await createEncryptedDM(
      plaintext,
      bob.xonlyPubkey,
      alice.privateKey
    )) as NostrWSMessage;

    // Event must be publishable: carries pubkey + created_at (regression guard).
    const event = msg[1] as Record<string, unknown>;
    expect(event.pubkey).toBe(alice.xonlyPubkey);
    expect(typeof event.created_at).toBe('number');
    expect(event.kind).toBe(4);

    const recovered = await decryptDM(msg, bob.privateKey, alice.xonlyPubkey, silentLogger);
    expect(recovered).toBe(plaintext);
  });

  it('encrypt is called as (message, senderPriv, recipientPub)', async () => {
    (cryptoUtils.encryptMessage as unknown as ReturnType<typeof vi.fn>).mockClear();
    await createEncryptedDM('hi', bob.xonlyPubkey, alice.privateKey);
    expect(cryptoUtils.encryptMessage).toHaveBeenCalledWith('hi', alice.privateKey, bob.xonlyPubkey);
  });

  it('decrypt is called as (ciphertext, recipientPriv, senderPub)', async () => {
    const msg = (await createEncryptedDM('yo', bob.xonlyPubkey, alice.privateKey)) as NostrWSMessage;
    const ciphertext = (msg[1] as Record<string, unknown>).content as string;
    (cryptoUtils.decryptMessage as unknown as ReturnType<typeof vi.fn>).mockClear();
    await decryptDM(msg, bob.privateKey, alice.xonlyPubkey, silentLogger);
    expect(cryptoUtils.decryptMessage).toHaveBeenCalledWith(
      ciphertext,
      bob.privateKey,
      alice.xonlyPubkey
    );
  });
});
