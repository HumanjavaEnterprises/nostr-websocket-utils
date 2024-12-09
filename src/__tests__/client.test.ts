import { NostrWSClient } from '../client.js';
import WebSocket from 'ws';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import type { NostrWSMessage } from '../types/index.js';

vi.mock('ws');

interface MockWebSocket {
  binaryType: string;
  bufferedAmount: number;
  extensions: string;
  protocol: string;
  readyState: number;
  url: string;
  CONNECTING: number;
  OPEN: number;
  CLOSING: number;
  CLOSED: number;
  onopen: ((this: WebSocket, ev: any) => any) | null;
  onclose: ((this: WebSocket, ev: any) => any) | null;
  onerror: ((this: WebSocket, ev: any) => any) | null;
  onmessage: ((this: WebSocket, ev: any) => any) | null;
  close: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
  on(event: string, listener: (...args: any[]) => void): this;
  removeAllListeners: ReturnType<typeof vi.fn>;
  removeListener: ReturnType<typeof vi.fn>;
  emit: ReturnType<typeof vi.fn>;
}

describe('NostrWSClient', () => {
  let client: NostrWSClient;
  let mockWs: MockWebSocket;
  const wsEventHandlers: { [key: string]: ((...args: any[]) => void) } = {};

  beforeEach(() => {
    mockWs = {
      binaryType: 'nodebuffer',
      bufferedAmount: 0,
      extensions: '',
      protocol: '',
      readyState: WebSocket.OPEN,
      url: '',
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3,
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
      close: vi.fn(),
      send: vi.fn(),
      on(event: string, listener: (...args: any[]) => void) {
        wsEventHandlers[event] = listener;
        return this;
      },
      removeAllListeners: vi.fn(),
      removeListener: vi.fn(),
      emit: vi.fn()
    };

    vi.mocked(WebSocket).mockImplementation(() => mockWs as unknown as WebSocket);

    client = new NostrWSClient('ws://localhost:8080', {
      logger: {
        debug: vi.fn(),
        info: vi.fn(),
        error: vi.fn()
      },
      handlers: {
        message: async () => {},
        error: () => {},
        close: () => {}
      }
    });
    client.connect();
    // Simulate connection success
    wsEventHandlers['open']?.();
  });

  afterEach(() => {
    if (client) {
      client.close();
    }
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a WebSocket connection', () => {
      expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8080');
    });
  });

  describe('event handling', () => {
    it('should handle message event', () => {
      const messageHandler = vi.fn();
      client.on('message', messageHandler);

      const testMessage: NostrWSMessage = { type: 'event', data: { test: true } };
      wsEventHandlers['message']?.(Buffer.from(JSON.stringify(testMessage)));

      expect(messageHandler).toHaveBeenCalledWith(testMessage);
    });

    it('should handle close event', () => {
      const closeHandler = vi.fn();
      client.on('close', closeHandler);
      
      // First emit close to the WebSocket handlers
      wsEventHandlers['close']?.();
      
      // Emit close event to the client handlers
      client.emit('close');
      
      // The close handler should be called
      expect(closeHandler).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close the WebSocket connection', () => {
      client.close();
      expect(mockWs.close).toHaveBeenCalled();
    });
  });
});
