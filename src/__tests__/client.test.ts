import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NostrWSClient } from '../client.js';
import WebSocket from 'ws';
import { NostrWSError, ErrorCodes } from '../error-handler.js';
import type { NostrEvent, NostrWSMessage } from '../types/index.js';

// Mock WebSocket module
vi.mock('ws', () => ({
  default: vi.fn(() => ({
    readyState: 1,
    send: vi.fn(),
    on: vi.fn(),
    close: vi.fn(),
  })),
  WebSocket: {
    OPEN: 1,
    CLOSED: 3,
  },
}));

describe('NostrWSClient', () => {
  let client: NostrWSClient;
  let mockWs: WebSocket;
  let eventHandlers: Record<string, (event?: Error | string) => void> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    eventHandlers = {};
    
    mockWs = {
      readyState: WebSocket.OPEN,
      send: vi.fn(),
      on: vi.fn((event, handler) => {
        eventHandlers[event] = handler;
      }),
      close: vi.fn(),
    };

    // Update the WebSocket mock
    const WebSocketMock = vi.mocked(WebSocket);
    WebSocketMock.mockImplementation(() => mockWs);

    client = new NostrWSClient('ws://localhost:8080');
  });

  describe('connection handling', () => {
    it('should handle connection errors', async () => {
      const error = new Error('Connection error');

      // Mock WebSocket implementation to throw error immediately
      const WebSocketMock = vi.mocked(WebSocket);
      WebSocketMock.mockImplementationOnce(() => {
        throw error;
      });

      await expect(client.connect()).rejects.toThrow(
        expect.objectContaining({
          message: 'Failed to establish connection',
          code: ErrorCodes.CONNECTION_ERROR,
          details: error,
        })
      );
    });

    it('should handle WebSocket error events', async () => {
      const connectPromise = client.connect();
      const errorHandler = vi.fn();
      client.on('error', errorHandler);

      // Wait for the next tick to ensure connection is initiated
      await new Promise(resolve => process.nextTick(resolve));

      // Simulate error event
      if (eventHandlers.error) {
        eventHandlers.error(new Error('WebSocket error'));
      }

      await expect(connectPromise).rejects.toMatchObject({
        message: 'WebSocket error',
        code: ErrorCodes.CONNECTION_ERROR
      });

      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'WebSocket error',
          code: ErrorCodes.CONNECTION_ERROR
        })
      );
    }, 10000); // Increase timeout to 10 seconds
  });

  describe('message handling', () => {
    it('should handle message events', async () => {
      const message: NostrEvent = {
        id: '123',
        pubkey: 'abc',
        created_at: 123,
        kind: 1,
        tags: [],
        content: 'test',
        sig: 'xyz',
      };

      const connectPromise = client.connect();
      
      // Simulate successful connection
      if (eventHandlers.open) {
        eventHandlers.open();
      }
      await connectPromise;

      // Set up message handler
      const messageHandler = vi.fn();
      client.on('message', messageHandler);

      // Simulate message event
      if (eventHandlers.message) {
        eventHandlers.message(JSON.stringify(['EVENT', message]));
      }

      expect(messageHandler).toHaveBeenCalledWith(['EVENT', message]);
    });

    it('should handle invalid message format', async () => {
      // Connect first
      const connectPromise = client.connect();
      await new Promise(resolve => process.nextTick(resolve));
      
      // Simulate successful connection
      if (eventHandlers.open) {
        eventHandlers.open();
      }
      await connectPromise;

      // Set up error handler and send invalid message
      const errorPromise = new Promise<void>((resolve) => {
        const errorHandler = (error: NostrWSError) => {
          expect(error).toBeInstanceOf(NostrWSError);
          expect(error.message).toBe('Failed to parse message');
          expect(error.code).toBe(ErrorCodes.MESSAGE_PARSE_ERROR);
          client.off('error', errorHandler);
          resolve();
        };

        client.on('error', errorHandler);

        // Simulate invalid message
        if (eventHandlers.message) {
          eventHandlers.message('invalid json');
        }
      });

      await errorPromise;
    }, 10000); // Increase timeout to 10 seconds
  });

  describe('sending messages', () => {
    it('should send messages when connected', async () => {
      const event: NostrEvent = {
        id: '123',
        pubkey: 'abc',
        created_at: 123,
        kind: 1,
        tags: [],
        content: 'test',
        sig: 'xyz',
      };
      const message: NostrWSMessage = ['EVENT', event];

      const connectPromise = client.connect();
      
      // Simulate successful connection
      if (eventHandlers.open) {
        eventHandlers.open();
      }
      await connectPromise;

      client.send(message);

      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('should throw error when not connected', () => {
      const event: NostrEvent = {
        id: '123',
        pubkey: 'abc',
        created_at: 123,
        kind: 1,
        tags: [],
        content: 'test',
        sig: 'xyz',
      };
      const message: NostrWSMessage = ['EVENT', event];
      mockWs.readyState = WebSocket.CLOSED;

      expect(() => client.send(message)).toThrow(
        expect.objectContaining({
          message: 'WebSocket is not connected',
          code: ErrorCodes.CONNECTION_ERROR,
        })
      );
    });
  });
});
