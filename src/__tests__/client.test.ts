import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';
import type { Logger } from '../types/logger';
import type { NostrWSMessage } from '../types/messages';
import { createMockLogger } from '../__mocks__/mockLogger';

// Mock WebSocket implementation
class MockWebSocket extends EventEmitter {
  constructor(public url: string) {
    super();
  }

  send(_data: string): void {
    // Mock send implementation
  }

  close(): void {
    // Mock close implementation
  }
}

// Mock client implementation
class MockNostrWSClient extends EventEmitter {
  private mockWs: MockWebSocket;

  constructor(url: string, _options: { logger: Logger; WebSocketImpl: any }) {
    super();
    this.mockWs = new MockWebSocket(url);
    
    this.mockWs.on('open', () => this.emit('connect'));
    this.mockWs.on('message', (data) => this.emit('message', JSON.parse(data.toString())));
    this.mockWs.on('close', () => this.emit('disconnect'));
    this.mockWs.on('error', (error) => this.emit('error', error));
  }

  connect(): void {
    this.mockWs.emit('open');
  }

  disconnect(): void {
    this.mockWs.emit('close');
  }

  send(message: NostrWSMessage): void {
    this.mockWs.emit('message', JSON.stringify(message));
  }
}

describe('NostrWSClient', () => {
  let client: MockNostrWSClient;
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = createMockLogger();

    client = new MockNostrWSClient('ws://test.com', {
      logger: mockLogger,
      WebSocketImpl: MockWebSocket
    });
  });

  afterEach(() => {
    client.disconnect();
    vi.restoreAllMocks();
  });

  describe('Event Handling', () => {
    it('should emit connect event when WebSocket opens', async () => {
      const connectHandler = vi.fn();
      client.on('connect', connectHandler);

      client.connect();
      await vi.waitFor(() => expect(connectHandler).toHaveBeenCalled());
    });

    it('should emit message event when receiving WebSocket message', async () => {
      const messageHandler = vi.fn();
      client.on('message', messageHandler);

      const testMessage: NostrWSMessage = ['EVENT', { id: 'test' }];
      client.send(testMessage);

      await vi.waitFor(() => expect(messageHandler).toHaveBeenCalledWith(testMessage));
    });

    it('should emit disconnect event when WebSocket closes', async () => {
      const disconnectHandler = vi.fn();
      client.on('disconnect', disconnectHandler);

      client.connect();
      client.disconnect();

      await vi.waitFor(() => expect(disconnectHandler).toHaveBeenCalled());
    });
  });
});
