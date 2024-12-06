import { NostrWSClient } from '../client.js';
import WebSocket from 'ws';
import type { NostrWSMessage, Logger } from '../types/index.js';
import { jest, describe, expect, it, beforeEach, afterEach } from '@jest/globals';

// Mock WebSocket
jest.mock('ws');

describe('NostrWSClient', () => {
  let client: NostrWSClient;
  let mockWs: WebSocket;
  let eventHandlers: { [key: string]: ((...args: unknown[]) => void) } = {};
  let mockLogger: Logger;

  beforeEach(() => {
    eventHandlers = {};

    mockLogger = {
      debug: jest.fn((_message: string, ..._args: unknown[]) => {}),
      info: jest.fn((_message: string, ..._args: unknown[]) => {}),
      error: jest.fn((_message: string, ..._args: unknown[]) => {})
    };

    const mockWebSocket = {
      binaryType: 'nodebuffer' as const,
      bufferedAmount: 0,
      extensions: '',
      protocol: '',
      readyState: WebSocket.OPEN,
      url: 'ws://test.com',
      isPaused: false,
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3,
      on(event: string, listener: (...args: unknown[]) => void) {
        eventHandlers[event] = listener;
        return this;
      },
      send: jest.fn(),
      close: jest.fn(),
      ping: jest.fn(),
      pong: jest.fn(),
      terminate: jest.fn(),
      removeAllListeners: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      emit: jest.fn(),
      addListener: jest.fn(),
      once: jest.fn(),
      prependListener: jest.fn(),
      prependOnceListener: jest.fn(),
      eventNames: jest.fn(),
      listenerCount: jest.fn(),
      listeners: jest.fn(),
      rawListeners: jest.fn(),
      getMaxListeners: jest.fn(),
      setMaxListeners: jest.fn(),
      off: jest.fn()
    };

    mockWs = mockWebSocket as unknown as WebSocket;
    (WebSocket as unknown as jest.Mock).mockImplementation(() => mockWs);
    client = new NostrWSClient('ws://test.com', { logger: mockLogger });
  });

  afterEach(() => {
    if (client) {
      client.close();
    }
    // Clear any pending timers
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('connect', () => {
    it('should create a WebSocket connection', () => {
      client.connect();
      expect(WebSocket).toHaveBeenCalledWith('ws://test.com');
    });

    it('should not create multiple connections if already connected', () => {
      client.connect();
      client.connect();
      expect(WebSocket).toHaveBeenCalledTimes(1);
    });
  });

  describe('send', () => {
    it('should send message when connected', () => {
      client.connect();
      const message: NostrWSMessage = { type: 'event', data: { foo: 'bar' } };
      client.send(message);
      expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('should queue message when not connected', () => {
      Object.defineProperty(mockWs, 'readyState', { value: WebSocket.CLOSED });
      const message: NostrWSMessage = { type: 'event', data: { foo: 'bar' } };
      client.send(message);
      expect(mockWs.send).not.toHaveBeenCalled();
    });
  });

  describe('subscribe/unsubscribe', () => {
    it('should send subscribe message', () => {
      client.connect();
      client.subscribe('test-channel');
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'subscribe',
          data: { channel: 'test-channel' }
        })
      );
    });

    it('should send unsubscribe message', () => {
      client.connect();
      client.unsubscribe('test-channel');
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'unsubscribe',
          data: { channel: 'test-channel' }
        })
      );
    });
  });

  describe('event handling', () => {
    beforeEach(() => {
      client.connect();
    });

    it('should handle open event', () => {
      const connectHandler = jest.fn();
      client.on('connect', connectHandler);
      eventHandlers['open']?.();
      expect(connectHandler).toHaveBeenCalled();
    });

    it('should handle message event', () => {
      const messageHandler = jest.fn();
      client.on('message', messageHandler);
      const testMessage: NostrWSMessage = { type: 'event', data: { test: true } };
      eventHandlers['message']?.(JSON.stringify(testMessage));
      expect(messageHandler).toHaveBeenCalledWith(testMessage);
    });

    it('should handle close event', () => {
      const disconnectHandler = jest.fn();
      client.on('disconnect', disconnectHandler);
      eventHandlers['close']?.();
      expect(disconnectHandler).toHaveBeenCalled();
    });
  });
});
