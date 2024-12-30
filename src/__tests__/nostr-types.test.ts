import { NostrWSEvent, NostrWSFilter, NostrWSMessageType } from '../types/messages';
import { describe, it, expect } from '@jest/globals';

describe('Nostr Types', () => {
  describe('NostrWSEvent', () => {
    it('should validate a valid event', () => {
      const event: NostrWSEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        created_at: Math.floor(Date.now() / 1000),
        kind: 1,
        tags: [['e', 'test-event-id'], ['p', 'test-pubkey']],
        content: 'test content',
        sig: 'test-signature',
      };

      // TypeScript will ensure all required properties are present
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('pubkey');
      expect(event).toHaveProperty('created_at');
      expect(event).toHaveProperty('kind');
      expect(event).toHaveProperty('tags');
      expect(event).toHaveProperty('content');
      expect(event).toHaveProperty('sig');
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
        '#e': ['test-event-1', 'test-event-2'],
        '#p': ['test-pubkey-1', 'test-pubkey-2'],
        since: now - 3600, // 1 hour ago
        until: now,
        limit: 100,
      };

      expect(filter.ids).toBeInstanceOf(Array);
      expect(filter.authors).toBeInstanceOf(Array);
      expect(filter.kinds).toBeInstanceOf(Array);
      expect(filter['#e']).toBeInstanceOf(Array);
      expect(filter['#p']).toBeInstanceOf(Array);
      expect(typeof filter.since).toBe('number');
      expect(typeof filter.until).toBe('number');
      expect(typeof filter.limit).toBe('number');
    });
  });

  describe('NostrWSMessageType', () => {
    it('should have all required message types', () => {
      expect(NostrWSMessageType.EVENT).toBe('EVENT');
      expect(NostrWSMessageType.REQ).toBe('REQ');
      expect(NostrWSMessageType.CLOSE).toBe('CLOSE');
      expect(NostrWSMessageType.NOTICE).toBe('NOTICE');
      expect(NostrWSMessageType.OK).toBe('OK');
      expect(NostrWSMessageType.AUTH).toBe('AUTH');
      expect(NostrWSMessageType.EOSE).toBe('EOSE');
    });

    it('should use correct message types in array format', () => {
      const eventMessage = [NostrWSMessageType.EVENT, { id: 'test' }];
      const reqMessage = [NostrWSMessageType.REQ, 'sub1', { kinds: [1] }];
      const closeMessage = [NostrWSMessageType.CLOSE, 'sub1'];

      expect(eventMessage[0]).toBe('EVENT');
      expect(reqMessage[0]).toBe('REQ');
      expect(closeMessage[0]).toBe('CLOSE');
    });
  });
});
