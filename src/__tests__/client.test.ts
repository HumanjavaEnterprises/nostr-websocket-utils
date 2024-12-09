import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NostrWSClient } from '../client.js';
import WebSocket from 'ws';
import { EventEmitter } from 'events';

// Mock WebSocket
vi.mock('ws', () => {
  const MockWebSocket = vi.fn(() => {
    const instance = new EventEmitter();
    instance.readyState = WebSocket.OPEN;
    instance.CONNECTING = WebSocket.CONNECTING;
    instance.OPEN = WebSocket.OPEN;
    instance.CLOSING = WebSocket.CLOSING;
    instance.CLOSED = WebSocket.CLOSED;
    instance.send = vi.fn();
    instance.ping = vi.fn();
    instance.terminate = vi.fn();
    instance.close = vi.fn();
    instance.removeAllListeners = vi.fn();
    instance.subscriptions = new Set();
    instance.isAlive = true;
    return instance;
  });
  MockWebSocket.CONNECTING = 0;
  MockWebSocket.OPEN = 1;
  MockWebSocket.CLOSING = 2;
  MockWebSocket.CLOSED = 3;
  return { WebSocket: MockWebSocket, default: MockWebSocket };
});

// Mock logger
const mockLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe('NostrWSClient', () => {
  let client: NostrWSClient;
  let mockWs: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    client = new NostrWSClient('ws://localhost:8080', {
      logger: mockLogger,
      handlers: {
        message: async () => {},
        error: () => {},
        close: () => {},
      },
    });
  });

  afterEach(() => {
    client.close();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('connection management', () => {
    it('should connect successfully', () => {
      client.connect();
      mockWs = (client as any).ws;
      mockWs.emit('open');
      expect(mockLogger.info).toHaveBeenCalledWith('WebSocket connection established');
    });

    it('should handle reconnection', () => {
      client.connect();
      mockWs = (client as any).ws;
      mockWs.emit('close');
      vi.advanceTimersByTime(1000);
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Attempting to reconnect'));
    });

    it('should handle max reconnection attempts', () => {
      const maxReconnectSpy = vi.fn();
      client.on('max_reconnects', maxReconnectSpy);
      
      client.connect();
      mockWs = (client as any).ws;
      
      // Simulate 5 failed reconnection attempts
      for (let i = 0; i < 6; i++) {
        mockWs.emit('close');
        vi.advanceTimersByTime(1000 * Math.pow(2, i));
      }
      
      expect(maxReconnectSpy).toHaveBeenCalled();
    });
  });

  describe('authentication', () => {
    beforeEach(() => {
      client.connect();
      mockWs = (client as any).ws;
      mockWs.emit('open');
    });

    it('should send authentication event', () => {
      const authEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        sig: 'test-sig'
      };
      
      client.authenticate(authEvent);
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(['AUTH', authEvent]));
    });

    it('should track authentication state', () => {
      expect(client.isAuthenticated()).toBe(false);
      (client as any).ws.authenticated = true;
      expect(client.isAuthenticated()).toBe(true);
    });
  });

  describe('subscription management', () => {
    beforeEach(() => {
      client.connect();
      mockWs = (client as any).ws;
      mockWs.emit('open');
    });

    it('should handle subscriptions', () => {
      const channel = 'test-channel';
      client.subscribe(channel);
      expect(mockWs.subscriptions?.has(channel)).toBe(true);
    });

    it('should handle unsubscriptions', () => {
      const channel = 'test-channel';
      client.subscribe(channel);
      client.unsubscribe(channel);
      expect(mockWs.subscriptions?.has(channel)).toBe(false);
    });
  });

  describe('message handling', () => {
    let messageHandler: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      messageHandler = vi.fn();
      client = new NostrWSClient('ws://localhost:8080', {
        logger: mockLogger,
        handlers: {
          message: messageHandler,
          error: () => {},
          close: () => {},
        },
      });
      client.connect();
      mockWs = (client as any).ws;
      mockWs.emit('open');
    });

    it('should handle incoming messages', async () => {
      const message = { type: 'test', data: 'test-data' };
      mockWs.isAlive = true;  // Ensure WebSocket is alive
      mockWs.emit('message', JSON.stringify(message));
      await vi.runAllTimersAsync();
      expect(messageHandler).toHaveBeenCalledWith(mockWs, message);
    });

    it('should queue messages when not connected', () => {
      const message = { type: 'test', data: 'test-data' };
      mockWs.readyState = WebSocket.CLOSING;
      client.send(message);
      expect(mockWs.send).not.toHaveBeenCalled();
      expect((client as any).messageQueue).toContainEqual(message);
    });

    it('should process queued messages after reconnection', () => {
      const message = { type: 'test', data: 'test-data' };
      mockWs.readyState = WebSocket.CLOSING;
      client.send(message);
      mockWs.readyState = WebSocket.OPEN;
      mockWs.emit('open');
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(message));
    });
  });

  describe('heartbeat', () => {
    beforeEach(() => {
      client.connect();
      mockWs = (client as any).ws;
      mockWs.emit('open');
    });

    it('should handle pong messages', () => {
      mockWs.isAlive = false;
      mockWs.emit('pong');
      expect(mockWs.isAlive).toBe(true);
    });

    it('should terminate connection if no pong received', () => {
      mockWs.isAlive = false;
      // Store reference to terminate spy before cleanup
      const terminateSpy = mockWs.terminate;
      vi.advanceTimersByTime(31000);
      expect(terminateSpy).toHaveBeenCalled();
    });
  });
});
