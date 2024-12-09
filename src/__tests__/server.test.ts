import { NostrWSServer } from '../server.js';
import { Server, createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import type { NostrWSMessage } from '../types/index.js';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

vi.mock('ws');
vi.mock('http');

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
  subscriptions?: Set<string>;
  isAlive?: boolean;
  ping: ReturnType<typeof vi.fn>;
  terminate: ReturnType<typeof vi.fn>;
}

interface MockWebSocketServer {
  clients: Set<WebSocket>;
  on(event: string, listener: (...args: any[]) => void): this;
  close: ReturnType<typeof vi.fn>;
  handleUpgrade: ReturnType<typeof vi.fn>;
  shouldHandle: ReturnType<typeof vi.fn>;
  removeAllListeners: ReturnType<typeof vi.fn>;
  removeListener: ReturnType<typeof vi.fn>;
  emit: ReturnType<typeof vi.fn>;
}

describe('NostrWSServer', () => {
  let server: NostrWSServer;
  let mockHttpServer: Server;
  let mockWsServer: MockWebSocketServer;
  let mockClient: MockWebSocket;
  const serverEventHandlers: { [key: string]: ((...args: any[]) => void) } = {};
  const clientEventHandlers: { [key: string]: ((...args: any[]) => void) } = {};

  beforeEach(() => {
    vi.useFakeTimers();
    
    mockClient = {
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
        clientEventHandlers[event] = listener;
        return this;
      },
      removeAllListeners: vi.fn(),
      removeListener: vi.fn(),
      emit: vi.fn(),
      subscriptions: new Set(),
      isAlive: true,
      ping: vi.fn(),
      terminate: vi.fn()
    };

    mockWsServer = {
      clients: new Set([mockClient as unknown as WebSocket]),
      on(event: string, listener: (...args: any[]) => void) {
        serverEventHandlers[event] = listener;
        return this;
      },
      close: vi.fn(),
      handleUpgrade: vi.fn(),
      shouldHandle: vi.fn(),
      removeAllListeners: vi.fn(),
      removeListener: vi.fn(),
      emit: vi.fn()
    };

    vi.mocked(WebSocketServer).mockImplementation(() => mockWsServer as unknown as WebSocketServer);

    mockHttpServer = createServer();
    server = new NostrWSServer(mockHttpServer, {
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

    // Simulate the connection event after registering handlers
    serverEventHandlers['connection']?.(mockClient);
  });

  afterEach(() => {
    if (server) {
      server.close();
    }
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should create a WebSocket server', () => {
      expect(WebSocketServer).toHaveBeenCalledWith({ server: mockHttpServer });
    });
  });

  describe('event handling', () => {
    it('should handle connection event', () => {
      const connectHandler = vi.fn();
      server.on('connect', connectHandler);
      
      // Emit connect event
      server.emit('connect', mockClient);
      
      expect(connectHandler).toHaveBeenCalledWith(mockClient);
    });

    it('should handle client message event', () => {
      const messageHandler = vi.fn();
      server.on('message', messageHandler);
      
      const testMessage: NostrWSMessage = { type: 'event', data: { test: true } };
      clientEventHandlers['message']?.(Buffer.from(JSON.stringify(testMessage)));
      
      // Emit message event
      server.emit('message', testMessage, mockClient);
      
      expect(messageHandler).toHaveBeenCalledWith(testMessage, mockClient);
    });

    it('should handle client close event', () => {
      const disconnectHandler = vi.fn();
      server.on('disconnect', disconnectHandler);
      
      clientEventHandlers['close']?.();
      
      // Emit disconnect event
      server.emit('disconnect', mockClient);
      
      expect(disconnectHandler).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('close', () => {
    it('should close the WebSocket server', () => {
      server.close();
      expect(mockWsServer.close).toHaveBeenCalled();
    });
  });
});
