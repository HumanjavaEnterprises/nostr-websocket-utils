// Mock WebSocket implementation
class MockWebSocketImpl implements WebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;

  binaryType: BinaryType = 'blob';
  bufferedAmount = 0;
  extensions = '';
  protocol = '';
  readyState = MockWebSocketImpl.OPEN;
  url = 'ws://test.com';
  onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
  onerror: ((this: WebSocket, ev: Event) => any) | null = null;

  private eventListeners: { [key: string]: Array<(...args: any[]) => void> } = {
    open: [],
    message: [],
    close: [],
    error: []
  };

  send = jest.fn();
  close = jest.fn();
  addListener = jest.fn();
  addEventListener = jest.fn((event: string, listener: (...args: any[]) => void) => {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
  });
  removeEventListener = jest.fn();
  dispatchEvent = jest.fn((event: Event) => {
    const listeners = this.eventListeners[event.type] || [];
    listeners.forEach(listener => listener(event));
    return true;
  });

  on(event: string, listener: (data: any) => void): this {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
    return this;
  }

  // Method to simulate open event
  simulateOpen() {
    this.readyState = MockWebSocketImpl.OPEN;
    const event = new Event('open');
    if (this.onopen) {
      this.onopen(event);
    }
    this.emit('open', event);
  }

  // Method to simulate message event
  simulateMessage(data: any) {
    const messageEvent = new MessageEvent('message', { data: JSON.stringify(data) });
    if (this.onmessage) {
      this.onmessage(messageEvent);
    }
    this.emit('message', Buffer.from(JSON.stringify(data)));
  }

  // Method to simulate close event
  simulateClose() {
    this.readyState = MockWebSocketImpl.CLOSED;
    const event = {
      type: 'close',
      code: 1000,
      reason: '',
      wasClean: true
    } as CloseEvent;
    if (this.onclose) {
      this.onclose(event);
    }
    this.emit('close', event);
  }

  // Method to simulate error event
  simulateError() {
    const event = new Event('error');
    if (this.onerror) {
      this.onerror(event);
    }
    this.emit('error', event);
  }

  emit(event: string, ...args: any[]): boolean {
    const listeners = this.eventListeners[event] || [];
    listeners.forEach(listener => listener(...args));
    return true;
  }
}

// Mock the 'ws' module
const mockWebSocket = jest.fn().mockImplementation(() => {
  return new MockWebSocketImpl();
}) as jest.MockedFunction<() => MockWebSocketImpl>;

jest.mock('ws', () => mockWebSocket);

// Get the mocked WebSocket constructor
const mockWebSocketConstructor = jest.requireMock('ws');

// Add static properties to mockWebSocket constructor
Object.defineProperties(mockWebSocketConstructor, {
  CONNECTING: { value: MockWebSocketImpl.CONNECTING },
  OPEN: { value: MockWebSocketImpl.OPEN },
  CLOSING: { value: MockWebSocketImpl.CLOSING },
  CLOSED: { value: MockWebSocketImpl.CLOSED }
});

// Set the mock as the global WebSocket
global.WebSocket = mockWebSocketConstructor as unknown as typeof WebSocket;

import { NostrWSClient } from '../client.js';
import type { NostrWSMessage, Logger } from '../types/index.js';
import { jest, describe, expect, it, beforeEach, afterEach } from '@jest/globals';

let client: NostrWSClient;
let eventHandlers: Record<string, ((...args: any[]) => void) | undefined>;

describe('NostrWSClient', () => {
  let mockWs: any;
  let mockLogger: Logger;

  interface MockWebSocket {
    binaryType: string;
    bufferedAmount: number;
    extensions: string;
    protocol: string;
    readyState: number;
    url: string;
    isPaused: boolean;
    CONNECTING: number;
    OPEN: number;
    CLOSING: number;
    CLOSED: number;
    on(event: string, listener: (...args: unknown[]) => void): this;
    send: jest.Mock;
    close: jest.Mock;
    ping: jest.Mock;
    pong: jest.Mock;
    terminate: jest.Mock;
    removeAllListeners: jest.Mock;
    removeListener: jest.Mock;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    emit: jest.Mock;
    addListener: jest.Mock;
    once: jest.Mock;
    prependListener: jest.Mock;
    prependOnceListener: jest.Mock;
    eventNames: jest.Mock;
    listenerCount: jest.Mock;
    rawListeners: jest.Mock;
    getMaxListeners: jest.Mock;
    setMaxListeners: jest.Mock;
    off: jest.Mock;
  }

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    eventHandlers = {};
    mockLogger = {
      debug: jest.fn((_message: string, ..._args: unknown[]) => {}),
      info: jest.fn((_message: string, ..._args: unknown[]) => {}),
      error: jest.fn((_message: string, ..._args: unknown[]) => {})
    };

    mockWs = new MockWebSocketImpl();
    mockWebSocket.mockImplementation(() => mockWs);

    client = new NostrWSClient('ws://test.com', {
      logger: mockLogger,
      WebSocketImpl: mockWebSocket as any
    });
  });

  afterEach(() => {
    if (client) {
      client.close();
    }
    // Clear any pending timers
    jest.clearAllTimers();
  });

  describe('connect', () => {
    it('should create a WebSocket connection', () => {
      client.connect();
      expect(mockWebSocket).toHaveBeenCalled(); // Check if mockWebSocket was called
      expect(mockWs).toBeDefined(); // Ensure wsInstance is defined
      mockWs.simulateOpen();
      expect(mockWebSocket).toHaveBeenCalledWith('ws://test.com');
    });

    it('should not create multiple connections if already connected', () => {
      client.connect();
      client.connect();
      expect(mockWebSocket).toHaveBeenCalledTimes(1); // Check if mockWebSocket was called only once
      expect(mockWs).toBeDefined(); // Ensure wsInstance is defined
      mockWs.simulateOpen();
    });
  });

  describe('send', () => {
    it('should send message when connected', () => {
      const message: NostrWSMessage = { type: 'event', data: { foo: 'bar' } };
      client.connect();
      mockWs.simulateOpen();
      client.send(message);
      expect(mockWs.send).toHaveBeenCalledWith(expect.stringContaining('"type":"event"'));
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
      mockWs.simulateOpen();
      client.subscribe('test-channel');
      const sentMessage = JSON.parse((mockWs.send as jest.Mock).mock.calls[0][0] as string);
      expect(sentMessage).toMatchObject({
        type: 'subscribe',
        data: { channel: 'test-channel' }
      });
    });

    it('should send unsubscribe message', () => {
      client.connect();
      mockWs.simulateOpen();
      client.unsubscribe('test-channel');
      const sentMessage = JSON.parse((mockWs.send as jest.Mock).mock.calls[0][0] as string);
      expect(sentMessage).toMatchObject({
        type: 'unsubscribe',
        data: { channel: 'test-channel' }
      });
    });
  });

  describe('event handling', () => {
    it('should handle open event', () => {
      const connectHandler = jest.fn();
      client.on('connect', connectHandler);
      client.connect();
      mockWs.simulateOpen();
      expect(connectHandler).toHaveBeenCalled();
    });

    it('should handle message event', () => {
      const messageHandler = jest.fn();
      client.on('message', messageHandler);
      const testMessage: NostrWSMessage = { type: 'event', data: { test: true } };
      client.connect();
      mockWs.simulateOpen();
      mockWs.simulateMessage(testMessage);
      expect(messageHandler).toHaveBeenCalledWith(testMessage);
    });

    it('should handle disconnect event', () => {
      const disconnectHandler = jest.fn();
      client.on('disconnect', disconnectHandler);
      client.connect();
      mockWs.simulateOpen();
      mockWs.simulateClose();
      expect(disconnectHandler).toHaveBeenCalled();
    });
  });
});
