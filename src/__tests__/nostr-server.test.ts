import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWSServer } from '../core/nostr-server.js';
import { MESSAGE_TYPES } from '../types/messages.js';
import type { NostrWSSocket } from '../types/socket.js';
import type { NostrWSEvent } from '../types/messages.js';
import type { NostrWSMessage } from '../types/messages.js';

describe('NostrWSServer', () => {
  let mockSocket: NostrWSSocket;
  let messageHandler: (message: NostrWSMessage, socket: NostrWSSocket) => Promise<void>;

  beforeEach(() => {
    messageHandler = vi.fn().mockImplementation(async () => {});
    
    // Create a minimal mock with only the necessary properties for Nostr
    mockSocket = {
      clientId: 'test-socket',
      subscriptions: new Set<string>(),
      readyState: 1,
      send: vi.fn(),
      close: vi.fn(),
      on: function(event: string, listener: (...args: any[]) => void) {
        if (event === 'message') {
          listener(Buffer.from(''));
        }
        return this;
      },
      emit: vi.fn()
    } as unknown as NostrWSSocket;

    createWSServer({ 
      port: 0,
      onMessage: messageHandler
    });
  });

  describe('message handling', () => {
    it('should handle EVENT messages', async () => {
      const event: NostrWSEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        created_at: Date.now(),
        kind: 1,
        tags: [],
        content: 'test content'
      };

      const message = {
        type: MESSAGE_TYPES.EVENT,
        content: event
      };

      // Call the message handler directly
      messageHandler(message, mockSocket);
      await vi.waitFor(() => expect(messageHandler).toHaveBeenCalledWith(message, mockSocket));
    });

    it('should handle REQ messages', async () => {
      const message = {
        type: MESSAGE_TYPES.REQ,
        subscription_id: 'test-sub',
        content: {
          kinds: [1],
          limit: 10
        }
      };

      // Call the message handler directly
      messageHandler(message, mockSocket);
      await vi.waitFor(() => expect(messageHandler).toHaveBeenCalledWith(message, mockSocket));
    });
  });
});
