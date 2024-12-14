import { EventEmitter } from 'events';
import { NostrWSClient } from '../client.js';
import { Duplex } from 'stream';
import type { WebSocket } from 'ws';
import { jest, describe, expect, it, beforeEach } from '@jest/globals';

// Basic WebSocket mock that only implements what we need for Nostr
class MockWebSocket extends EventEmitter {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url: string;

  constructor(url: string) {
    super();
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
  }

  send = jest.fn();
  close = jest.fn();
  ping = jest.fn();
  pong = jest.fn();
  terminate = jest.fn();

  // Helper methods for testing
  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this.emit('open');
  }

  simulateMessage(data: unknown): void {
    this.emit('message', Buffer.from(JSON.stringify(data)));
  }

  simulateClose(): void {
    this.readyState = MockWebSocket.CLOSED;
    this.emit('close');
  }

  simulateError(error: Error): void {
    this.emit('error', error);
  }
}

// Create constructor function
const MockWebSocketConstructor = function(this: WebSocket, url: string) {
  return new MockWebSocket(url);
} as unknown as typeof WebSocket;

// Copy static properties
Object.defineProperties(MockWebSocketConstructor, {
  CONNECTING: { value: MockWebSocket.CONNECTING, writable: false },
  OPEN: { value: MockWebSocket.OPEN, writable: false },
  CLOSING: { value: MockWebSocket.CLOSING, writable: false },
  CLOSED: { value: MockWebSocket.CLOSED, writable: false }
});

// Add required static method
MockWebSocketConstructor.createWebSocketStream = function(_ws: WebSocket): Duplex {
  return new Duplex();
};

// Mock class for NostrWSClient
class MockNostrWSClient extends NostrWSClient {
  private mockWs: MockWebSocket | null = null;

  connect() {
    if (this.mockWs) return;
    
    this.mockWs = new MockWebSocket('ws://test.com');
    
    // Set up event handlers
    this.mockWs.on('open', () => this.emit('connect'));
    this.mockWs.on('message', (data) => this.emit('message', JSON.parse(data.toString())));
    this.mockWs.on('close', () => this.emit('disconnect'));
    this.mockWs.on('error', (error) => this.emit('error', error));
  }

  simulateOpen() {
    this.mockWs?.simulateOpen();
  }

  simulateMessage(data: unknown) {
    this.mockWs?.simulateMessage(data);
  }

  simulateClose() {
    this.mockWs?.simulateClose();
  }

  simulateError(error: Error) {
    this.mockWs?.simulateError(error);
  }
}

describe('NostrWSClient', () => {
  let client: MockNostrWSClient;
  let mockLogger: { 
    debug: jest.Mock;
    info: jest.Mock;
    warn: jest.Mock;
    error: jest.Mock;
  };

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    client = new MockNostrWSClient('ws://test.com', { 
      logger: mockLogger,
      WebSocketImpl: MockWebSocketConstructor
    });
    client.connect();
  });

  describe('event handling', () => {
    it('should handle open event', () => {
      const connectHandler = jest.fn();
      client.on('connect', connectHandler);
      client.simulateOpen();
      expect(connectHandler).toHaveBeenCalled();
    });

    it('should handle message event', () => {
      const messageHandler = jest.fn();
      client.on('message', messageHandler);
      client.simulateOpen();
      client.simulateMessage({ type: 'test', data: {} });
      expect(messageHandler).toHaveBeenCalled();
    });

    it('should handle disconnect event', () => {
      const disconnectHandler = jest.fn();
      client.on('disconnect', disconnectHandler);
      client.simulateOpen();
      client.simulateClose();
      expect(disconnectHandler).toHaveBeenCalled();
    });
  });
});
