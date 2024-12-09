import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocket } from 'ws';
import { NostrWSClient } from '../client.js';
import { mockLogger } from './mocks/logger.js';
import type { NostrWSMessage, NostrEvent } from '../types/index.js';

// Define WebSocket mock types
interface MockWebSocketInstance {
  readyState: number;
  CONNECTING: number;
  OPEN: number;
  CLOSING: number;
  CLOSED: number;
  send: ReturnType<typeof vi.fn>;
  ping: ReturnType<typeof vi.fn>;
  terminate: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  removeAllListeners: ReturnType<typeof vi.fn>;
  subscriptions: Set<string>;
  isAlive: boolean;
  on: ReturnType<typeof vi.fn>;
  once: ReturnType<typeof vi.fn>;
  emit: ReturnType<typeof vi.fn>;
  authenticated?: boolean;
}

interface MockWebSocketConstructor {
  new (): MockWebSocketInstance;
  CONNECTING: number;
  OPEN: number;
  CLOSING: number;
  CLOSED: number;
}

type MockCallArray = [string, (...args: any[]) => void];

// Mock WebSocket
vi.mock('ws', () => {
  const WebSocketStates = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
  } as const;

  const MockWebSocket = vi.fn(() => ({
    readyState: WebSocketStates.OPEN,
    CONNECTING: WebSocketStates.CONNECTING,
    OPEN: WebSocketStates.OPEN,
    CLOSING: WebSocketStates.CLOSING,
    CLOSED: WebSocketStates.CLOSED,
    send: vi.fn(),
    ping: vi.fn(),
    terminate: vi.fn(),
    close: vi.fn(),
    removeAllListeners: vi.fn(),
    subscriptions: new Set<string>(),
    isAlive: true,
    on: vi.fn(),
    once: vi.fn(),
    emit: vi.fn()
  })) as unknown as MockWebSocketConstructor;

  MockWebSocket.CONNECTING = WebSocketStates.CONNECTING;
  MockWebSocket.OPEN = WebSocketStates.OPEN;
  MockWebSocket.CLOSING = WebSocketStates.CLOSING;
  MockWebSocket.CLOSED = WebSocketStates.CLOSED;

  return { WebSocket: MockWebSocket, default: MockWebSocket };
});

describe('NostrWSClient', () => {
  let client: NostrWSClient;
  let mockWs: MockWebSocketInstance;
  const messageHandler = vi.fn();
  const errorHandler = vi.fn();
  const closeHandler = vi.fn();

  const findMockCall = (calls: MockCallArray[], eventName: string): MockCallArray | undefined => {
    return calls.find(call => call[0] === eventName);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    client = new NostrWSClient('ws://localhost:8080', {
      logger: mockLogger,
      handlers: {
        message: messageHandler,
        error: errorHandler,
        close: closeHandler,
      },
    });
    client.connect();
    mockWs = (client as any).ws;
    // Simulate WebSocket connection
    const openCall = findMockCall(mockWs.on.mock.calls, 'open');
    if (openCall?.[1]) {
      openCall[1]();
    }
  });

  afterEach(() => {
    vi.clearAllTimers();
    client.close();
  });

  describe('connection management', () => {
    it('should connect successfully', () => {
      expect(mockLogger.info).toHaveBeenCalledWith('WebSocket connection established');
    });

    it('should attempt to reconnect on close', () => {
      const closeCall = findMockCall(mockWs.on.mock.calls, 'close');
      if (closeCall?.[1]) {
        closeCall[1]();
      }
      vi.advanceTimersByTime(1000);
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Attempting to reconnect'));
    });

    it('should handle max reconnection attempts', () => {
      const maxReconnectSpy = vi.fn();
      client.on('max_reconnects', maxReconnectSpy);
      
      // Simulate 5 failed reconnection attempts with exponential backoff
      for (let i = 0; i < 5; i++) {
        // Close the connection
        const closeCall = findMockCall(mockWs.on.mock.calls, 'close');
        if (closeCall?.[1]) {
          closeCall[1]();
        }

        // Wait for reconnection attempt with exponential backoff
        const backoffTime = Math.min(1000 * Math.pow(2, i), 30000);
        vi.advanceTimersByTime(backoffTime);

        // Get the new WebSocket instance after reconnection attempt
        mockWs = (client as any).ws;
      }

      // Close one more time to trigger max reconnects
      const finalCloseCall = findMockCall(mockWs.on.mock.calls, 'close');
      if (finalCloseCall?.[1]) {
        finalCloseCall[1]();
      }
      vi.advanceTimersByTime(1000 * Math.pow(2, 5));
      
      expect(maxReconnectSpy).toHaveBeenCalled();
    });
  });

  describe('authentication', () => {
    it('should send auth message', () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        kind: 1,
        content: 'test',
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        sig: 'test-sig'
      };
      const authMessage: NostrWSMessage = ['AUTH', event];
      client.authenticate(authMessage);
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(['AUTH', authMessage]));
    });

    it('should track authentication state', () => {
      expect(client.isAuthenticated()).toBe(false);
      mockWs.authenticated = true;
      expect(client.isAuthenticated()).toBe(true);
    });
  });

  describe('subscription management', () => {
    beforeEach(() => {
      mockWs.authenticated = true;
    });

    it('should handle subscriptions', () => {
      client.subscribe('test-channel');
      expect(mockWs.subscriptions?.has('test-channel')).toBe(true);
    });

    it('should handle unsubscriptions', () => {
      client.subscribe('test-channel');
      client.unsubscribe('test-channel');
      expect(mockWs.subscriptions?.has('test-channel')).toBe(false);
    });
  });

  describe('message handling', () => {
    it('should handle incoming messages', async () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        kind: 1,
        content: 'test',
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        sig: 'test-sig'
      };
      const message: NostrWSMessage = ['EVENT', event];
      mockWs.isAlive = true;

      // Add message listener
      client.on('message', messageHandler);

      // Simulate receiving message
      const messageCall = findMockCall(mockWs.on.mock.calls, 'message');
      if (messageCall?.[1]) {
        await messageCall[1](Buffer.from(JSON.stringify(message)));
        expect(client.listenerCount('message')).toBeGreaterThan(0);
        expect(messageHandler).toHaveBeenCalledWith(message);
      }
    });

    it('should queue messages when not connected', () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        kind: 1,
        content: 'test',
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        sig: 'test-sig'
      };
      const message: NostrWSMessage = ['EVENT', event];
      Object.defineProperty(mockWs, 'readyState', { value: WebSocket.CLOSING });
      client.send(message);
      expect(mockWs.send).not.toHaveBeenCalled();
    });

    it('should process queued messages after reconnection', () => {
      const event: NostrEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        kind: 1,
        content: 'test',
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        sig: 'test-sig'
      };
      const message: NostrWSMessage = ['EVENT', event];
      Object.defineProperty(mockWs, 'readyState', { value: WebSocket.CLOSING });
      client.send(message);
      Object.defineProperty(mockWs, 'readyState', { value: WebSocket.OPEN });
      const openCall = findMockCall(mockWs.on.mock.calls, 'open');
      if (openCall?.[1]) {
        openCall[1]();
      }
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(message));
    });
  });

  describe('heartbeat', () => {
    beforeEach(() => {
      const openCall = findMockCall(mockWs.on.mock.calls, 'open');
      if (openCall?.[1]) {
        openCall[1]();
      }
    });

    it('should handle pong messages', () => {
      const pongCall = findMockCall(mockWs.on.mock.calls, 'pong');
      if (pongCall?.[1]) {
        pongCall[1]();
      }
      expect(mockWs.isAlive).toBe(true);
    });

    it('should terminate connection if no pong received', () => {
      mockWs.isAlive = false;
      vi.advanceTimersByTime(31000);
      expect(mockWs.terminate).toHaveBeenCalled();
    });
  });
});
