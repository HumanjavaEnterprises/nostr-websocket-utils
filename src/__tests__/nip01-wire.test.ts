/**
 * NIP-01 wire-protocol round-trip tests.
 * These drive the real exported builders/validators and assert the exact
 * JSON that goes on the wire against known-good NIP-01 spec strings.
 */
import { describe, it, expect } from 'vitest';
import {
  createEventMessage,
  createReqMessage,
  createCloseMessage,
  createNoticeMessage,
  validateMessage,
  validateEvent
} from '../nips/nip-01.js';
import { createOkMessage } from '../nips/nip-20.js';
import type { NostrEvent, NostrWSMessage } from '../types/messages.js';
import vectors from './fixtures/nostr-vectors.json' with { type: 'json' };

const validEvent: NostrEvent = {
  id: vectors.nip01_events.example.id,
  pubkey: vectors.nip01_events.example.pubkey,
  created_at: vectors.nip01_events.example.created_at,
  kind: vectors.nip01_events.example.kind,
  tags: vectors.nip01_events.example.tags,
  content: vectors.nip01_events.example.content,
  // a syntactically valid 128-char hex sig (validateEvent only checks format)
  sig: 'a'.repeat(128)
};

describe('NIP-01 wire builders emit spec positional arrays', () => {
  it('REQ serializes to ["REQ", subId, ...filters]', () => {
    const msg = createReqMessage('sub1', [{ kinds: [1] }]);
    expect(JSON.stringify(msg)).toBe('["REQ","sub1",{"kinds":[1]}]');
  });

  it('REQ supports multiple filters positionally', () => {
    const msg = createReqMessage('s', [{ kinds: [1] }, { authors: ['ab'] }]);
    expect(JSON.stringify(msg)).toBe('["REQ","s",{"kinds":[1]},{"authors":["ab"]}]');
  });

  it('CLOSE serializes to ["CLOSE", subId]', () => {
    expect(JSON.stringify(createCloseMessage('sub1'))).toBe('["CLOSE","sub1"]');
  });

  it('NOTICE serializes to ["NOTICE", message]', () => {
    expect(JSON.stringify(createNoticeMessage('hello'))).toBe('["NOTICE","hello"]');
  });

  it('OK serializes to ["OK", eventId, bool, message]', () => {
    expect(JSON.stringify(createOkMessage('deadbeef', true, 'ok')))
      .toBe('["OK","deadbeef",true,"ok"]');
    expect(JSON.stringify(createOkMessage('deadbeef', false, 'blocked')))
      .toBe('["OK","deadbeef",false,"blocked"]');
  });

  it('EVENT serializes to ["EVENT", event]', () => {
    const msg = createEventMessage(validEvent);
    expect(msg[0]).toBe('EVENT');
    expect(msg[1]).toEqual(validEvent);
  });
});

describe('NIP-01 validateMessage', () => {
  it('accepts a positional REQ', () => {
    expect(validateMessage(['REQ', 'sub1', { kinds: [1] }] as NostrWSMessage)).toBe(true);
  });

  it('rejects a REQ with a non-string sub id', () => {
    expect(validateMessage(['REQ', { kinds: [1] }] as unknown as NostrWSMessage)).toBe(false);
  });

  it('accepts a positional CLOSE', () => {
    expect(validateMessage(['CLOSE', 'sub1'] as NostrWSMessage)).toBe(true);
  });

  it('accepts string-payload control messages NOTICE / EOSE', () => {
    expect(validateMessage(['NOTICE', 'server maintenance'] as NostrWSMessage)).toBe(true);
    expect(validateMessage(['EOSE', 'sub1'] as NostrWSMessage)).toBe(true);
  });

  it('accepts OK and CLOSED control messages', () => {
    expect(validateMessage(['OK', 'evid', true, 'stored'] as unknown as NostrWSMessage)).toBe(true);
    expect(validateMessage(['CLOSED', 'sub1', 'error: bad'] as NostrWSMessage)).toBe(true);
  });

  it('rejects an unknown message type', () => {
    expect(validateMessage(['BOGUS', 'x'] as unknown as NostrWSMessage)).toBe(false);
  });
});

describe('NIP-01 validateEvent (strict type checks)', () => {
  it('accepts a valid event', () => {
    expect(validateEvent(validEvent).valid).toBe(true);
  });

  it('accepts kind:0 metadata events (not falsy-rejected)', () => {
    expect(validateEvent({ ...validEvent, kind: 0 }).valid).toBe(true);
  });

  it('accepts empty content', () => {
    expect(validateEvent({ ...validEvent, content: '' }).valid).toBe(true);
  });

  it('accepts created_at:0', () => {
    expect(validateEvent({ ...validEvent, created_at: 0 }).valid).toBe(true);
  });

  it('rejects a non-hex id like "abc"', () => {
    expect(validateEvent({ ...validEvent, id: 'abc' }).valid).toBe(false);
  });

  it('rejects a malformed pubkey', () => {
    expect(validateEvent({ ...validEvent, pubkey: 'not-hex' }).valid).toBe(false);
  });

  it('rejects a short sig', () => {
    expect(validateEvent({ ...validEvent, sig: 'deadbeef' }).valid).toBe(false);
  });

  it('rejects a non-integer created_at', () => {
    expect(validateEvent({ ...validEvent, created_at: 1.5 }).valid).toBe(false);
  });
});
