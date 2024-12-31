import { describe, it, expect } from 'vitest';
import { NostrEvent, NostrWSFilter, NostrWSMessage } from '../types/messages';
import { MESSAGE_TYPES } from '../types/messages';

describe('Nostr WebSocket Types', () => {
  describe('NostrEvent', () => {
    it('should validate a valid event', () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        created_at: Date.now(),
        kind: 1,
        tags: [],
        content: 'test content',
        sig: 'test-sig'
      };
      expect(event).toBeDefined();
    });
  });

  describe('NostrWSFilter', () => {
    it('should allow all optional properties', () => {
      const filter: NostrWSFilter = {};
      expect(filter).toBeDefined();
    });

    it('should validate a filter with all properties', () => {
      const now = Math.floor(Date.now() / 1000);
      const filter: NostrWSFilter = {
        ids: ['test-id-1', 'test-id-2'],
        authors: ['test-pubkey-1', 'test-pubkey-2'],
        kinds: [1, 2, 3],
        tags: {
          'e': ['test-event-1', 'test-event-2'],
          'p': ['test-pubkey-1', 'test-pubkey-2']
        },
        since: now - 3600, // 1 hour ago
        until: now,
        limit: 100,
      };

      expect(filter.ids).toBeInstanceOf(Array);
      expect(filter.authors).toBeInstanceOf(Array);
      expect(filter.kinds).toBeInstanceOf(Array);
      expect(filter.tags?.e).toBeInstanceOf(Array);
      expect(filter.tags?.p).toBeInstanceOf(Array);
      expect(typeof filter.since).toBe('number');
      expect(typeof filter.until).toBe('number');
      expect(typeof filter.limit).toBe('number');
    });
  });

  describe('NostrWSMessage', () => {
    it('should validate a valid message', () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        created_at: Date.now(),
        kind: 1,
        tags: [],
        content: 'test content'
      };
      const message: NostrWSMessage = [MESSAGE_TYPES.EVENT, event];
      expect(message[0]).toBe(MESSAGE_TYPES.EVENT);
      expect(message[1]).toEqual(event);
    });
  });

  describe('Message Types', () => {
    it('should have all required message types', () => {
      expect(MESSAGE_TYPES.EVENT).toBe('EVENT');
      expect(MESSAGE_TYPES.REQ).toBe('REQ');
      expect(MESSAGE_TYPES.CLOSE).toBe('CLOSE');
      expect(MESSAGE_TYPES.NOTICE).toBe('NOTICE');
      expect(MESSAGE_TYPES.OK).toBe('OK');
      expect(MESSAGE_TYPES.AUTH).toBe('AUTH');
      expect(MESSAGE_TYPES.EOSE).toBe('EOSE');
    });

    it('should use correct message types in array format', () => {
      const eventMessage = [MESSAGE_TYPES.EVENT, { id: 'test' }];
      const reqMessage = [MESSAGE_TYPES.REQ, 'sub1', { kinds: [1] }];
      const closeMessage = [MESSAGE_TYPES.CLOSE, 'sub1'];

      expect(eventMessage[0]).toBe('EVENT');
      expect(reqMessage[0]).toBe('REQ');
      expect(closeMessage[0]).toBe('CLOSE');
    });
  });
});
