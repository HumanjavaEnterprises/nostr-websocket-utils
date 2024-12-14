// Mock WebSocket implementation
class MockWebSocketImpl {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = MockWebSocketImpl.CONNECTING;
  readonly OPEN = MockWebSocketImpl.OPEN;
  readonly CLOSING = MockWebSocketImpl.CLOSING;
  readonly CLOSED = MockWebSocketImpl.CLOSED;

  binaryType: BinaryType = 'blob';
  bufferedAmount = 0;
  extensions = '';
  protocol = '';
  readyState = MockWebSocketImpl.OPEN;
  url = 'ws://test.com';

  onopen: ((this: WebSocket, ev: Event) => void) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => void) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => void) | null = null;
  onerror: ((this: WebSocket, ev: Event) => void) | null = null;

  private eventListeners: { [key: string]: Array<(...args: unknown[]) => void> } = {
    open: [],
    message: [],
    close: [],
    error: []
  };

  send = jest.fn();
  close = jest.fn();
  ping = jest.fn();

  on = jest.fn((_event: string, listener: (...args: unknown[]) => void) => {
    if (!this.eventListeners[_event]) {
      this.eventListeners[_event] = [];
    }
    this.eventListeners[_event].push(listener);
    return this;
  });

  addEventListener = jest.fn((_event: string, listener: (...args: unknown[]) => void) => {
    if (!this.eventListeners[_event]) {
      this.eventListeners[_event] = [];
    }
    this.eventListeners[_event].push(listener);
  });

  removeEventListener = jest.fn();

  dispatchEvent = jest.fn((event: Event) => {
    const type = event.type;
    if (type === 'open' && this.onopen) {
      this.onopen.call(this as any, event);
    } else if (type === 'message' && this.onmessage) {
      this.onmessage.call(this as any, event as MessageEvent);
    } else if (type === 'close' && this.onclose) {
      this.onclose.call(this as any, event as CloseEvent);
    } else if (type === 'error' && this.onerror) {
      this.onerror.call(this as any, event);
    }

    const listeners = this.eventListeners[type] || [];
    listeners.forEach(listener => listener.call(this as any, event));
    return true;
  });

  simulateOpen() {
    this.readyState = MockWebSocketImpl.OPEN;
    const event = new MockEvent('open');
    this.dispatchEvent(event);
  }

  simulateMessage(data: unknown) {
    const messageData = Buffer.from(JSON.stringify(data));
    const listeners = this.eventListeners['message'] || [];
    listeners.forEach(listener => listener(messageData));
  }

  simulateClose() {
    this.readyState = MockWebSocketImpl.CLOSED;
    const event = new MockCloseEvent('close');
    this.dispatchEvent(event);
  }

  simulateError() {
    const event = new MockEvent('error');
    this.dispatchEvent(event);
  }
}

// Mock Event classes
class MockEvent implements Event {
  readonly NONE = 0 as const;
  readonly CAPTURING_PHASE = 1 as const;
  readonly AT_TARGET = 2 as const;
  readonly BUBBLING_PHASE = 3 as const;
  readonly type: string;
  readonly target: EventTarget | null = null;
  readonly currentTarget: EventTarget | null = null;
  readonly eventPhase: number = 0;
  readonly bubbles: boolean = false;
  readonly cancelable: boolean = false;
  readonly defaultPrevented: boolean = false;
  readonly composed: boolean = false;
  readonly timeStamp: number = Date.now();
  readonly srcElement: EventTarget | null = null;
  readonly returnValue: boolean = true;
  readonly cancelBubble: boolean = false;
  readonly isTrusted: boolean = true;

  constructor(type: string) {
    this.type = type;
  }

  preventDefault(): void {}
  stopPropagation(): void {}
  stopImmediatePropagation(): void {}
  composedPath(): EventTarget[] { return []; }
  initEvent(_type: unknown, _bubbles?: unknown, _cancelable?: unknown): void {}
}

class MockMessageEvent extends MockEvent {
  readonly data: unknown;
  readonly origin: string = '';
  readonly lastEventId: string = '';
  readonly source: null = null;
  readonly ports: ReadonlyArray<MessagePort> = [];

  constructor(type: string, init?: { data: unknown }) {
    super(type);
    this.data = init?.data;
  }

  initMessageEvent(_type: unknown, _bubbles?: unknown, _cancelable?: unknown, _data?: unknown, _origin?: unknown, _lastEventId?: unknown, _source?: unknown, _ports?: unknown): void {}
}

class MockCloseEvent extends MockEvent implements CloseEvent {
  readonly code: number = 1000;
  readonly reason: string = '';
  readonly wasClean: boolean = true;

  constructor(type: string) {
    super(type);
  }
}

// Define a type for the mock WebSocket that includes static properties
type MockWebSocketConstructor = {
  new (url: string | URL, protocols?: string | string[]): MockWebSocketImpl;
  CONNECTING: number;
  OPEN: number;
  CLOSING: number;
  CLOSED: number;
};

// Mock the 'ws' module
const mockWebSocketClass = jest.fn((url: string | URL, _protocols?: string | string[]) => new MockWebSocketImpl());

Object.assign(mockWebSocketClass, {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
});

(global as any).WebSocket = mockWebSocketClass;

import { NostrWSClient } from '../client.js';
import type { NostrWSMessage, Logger } from '../types/index.js';
import { jest, describe, expect, it, beforeEach } from '@jest/globals';

let client: NostrWSClient;

describe('NostrWSClient', () => {
  let mockWs: MockWebSocketImpl;
  let mockLogger: Logger;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockLogger = {
      debug: jest.fn((_message: string, ..._args: unknown[]) => {}),
      info: jest.fn((_message: string, ..._args: unknown[]) => {}),
      warn: jest.fn((_message: string, ..._args: unknown[]) => {}),
      error: jest.fn((_message: string, ..._args: unknown[]) => {})
    };

    mockWs = new MockWebSocketImpl();
    mockWebSocketClass.mockImplementation(() => mockWs);
    client = new NostrWSClient('ws://test.com', { 
      logger: mockLogger,
      WebSocketImpl: mockWebSocketClass as any
    });
  });

  describe('event handling', () => {
    it('should handle open event', () => {
      const connectHandler = jest.fn((_args: unknown[]) => {});
      client.on('connect', connectHandler);
      client.connect();
      mockWs.simulateOpen();
      expect(connectHandler).toHaveBeenCalled();
    });

    it('should handle message event', () => {
      const messageHandler = jest.fn((_args: unknown[]) => {});
      client.on('message', messageHandler);
      const testMessage = { type: 'event', data: { test: true } };
      client.connect();
      mockWs.simulateOpen(); // Ensure the connection is established before simulating the message
      mockWs.simulateMessage(testMessage);
      expect(messageHandler).toHaveBeenCalledWith(testMessage);
    });

    it('should handle disconnect event', () => {
      const disconnectHandler = jest.fn((_args: unknown[]) => {});
      client.on('disconnect', disconnectHandler);
      client.connect();
      mockWs.simulateOpen();
      mockWs.simulateClose();
      expect(disconnectHandler).toHaveBeenCalled();
    });
  });
});
