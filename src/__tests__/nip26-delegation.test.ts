/**
 * NIP-26 delegation tests.
 * Locks down the rewrite: a token is schnorr(sha256("nostr:delegation:...")),
 * so create -> verify round-trips deterministically (no event-sig, no
 * created_at drift at verify time).
 */
import { describe, it, expect } from 'vitest';
import {
  createDelegation,
  verifyDelegation,
  addDelegationTag,
  extractDelegation,
  validateDelegatedEvent
} from '../nips/nip-26.js';
import type { NostrEvent } from '../types/events.js';
import vectors from './fixtures/nostr-vectors.json' with { type: 'json' };

const delegator = vectors.keypairs.alice; // signs the delegation
const delegatee = vectors.keypairs.bob; // acts under the delegation
const conditions = { kind: 1, since: 1600000000, until: 1900000000 };

describe('NIP-26 delegation token', () => {
  it('create -> verify round-trips', async () => {
    const token = await createDelegation(delegator.privateKey, delegatee.xonlyPubkey, conditions);
    expect(token).toMatch(/^[0-9a-f]{128}$/);

    const ok = await verifyDelegation(
      delegator.xonlyPubkey,
      delegatee.xonlyPubkey,
      token,
      conditions
    );
    expect(ok).toBe(true);
  });

  it('rejects a tampered token', async () => {
    const token = await createDelegation(delegator.privateKey, delegatee.xonlyPubkey, conditions);
    const bad = token.slice(0, -2) + (token.endsWith('0') ? '1' : '0');
    expect(
      await verifyDelegation(delegator.xonlyPubkey, delegatee.xonlyPubkey, bad, conditions)
    ).toBe(false);
  });

  it('rejects verification against the wrong delegator pubkey', async () => {
    const token = await createDelegation(delegator.privateKey, delegatee.xonlyPubkey, conditions);
    expect(
      await verifyDelegation(delegatee.xonlyPubkey, delegatee.xonlyPubkey, token, conditions)
    ).toBe(false);
  });

  it('rejects when conditions are altered after signing', async () => {
    const token = await createDelegation(delegator.privateKey, delegatee.xonlyPubkey, conditions);
    expect(
      await verifyDelegation(delegator.xonlyPubkey, delegatee.xonlyPubkey, token, {
        ...conditions,
        kind: 7
      })
    ).toBe(false);
  });

  it('add/extract delegation tag preserves the NIP-26 conditions string', async () => {
    const token = await createDelegation(delegator.privateKey, delegatee.xonlyPubkey, conditions);
    const base: NostrEvent = {
      id: '',
      pubkey: delegatee.xonlyPubkey,
      created_at: 1700000000,
      kind: 1,
      tags: [],
      content: 'delegated post',
      sig: ''
    };
    const tagged = addDelegationTag(base, {
      pubkey: delegator.xonlyPubkey,
      conditions,
      token
    });
    const delegationTag = tagged.tags.find(t => t[0] === 'delegation');
    expect(delegationTag?.[2]).toBe('kind=1&created_at>1600000000&created_at<1900000000');

    const extracted = extractDelegation(tagged);
    expect(extracted?.conditions).toEqual(conditions);
    expect(extracted?.token).toBe(token);
  });

  it('validateDelegatedEvent accepts an in-window delegated event and rejects a wrong-kind one', async () => {
    const token = await createDelegation(delegator.privateKey, delegatee.xonlyPubkey, conditions);
    const good = addDelegationTag(
      {
        id: '',
        pubkey: delegatee.xonlyPubkey,
        created_at: 1700000000,
        kind: 1,
        tags: [],
        content: 'ok',
        sig: ''
      },
      { pubkey: delegator.xonlyPubkey, conditions, token }
    );
    expect(await validateDelegatedEvent(good)).toBe(true);

    const wrongKind = { ...good, kind: 7 };
    expect(await validateDelegatedEvent(wrongKind)).toBe(false);
  });
});
