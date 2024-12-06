import { NostrWSServer } from '../server.js';
import { Server } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import type { NostrWSMessage, ExtendedWebSocket } from '../types/index.js';
import { jest, describe, expect, it, beforeEach, afterEach } from '@jest/globals';

jest.mock('ws');
jest.mock('http');

describe('NostrWSServer', () => {
  let server: NostrWSServer;
  let mockHttpServer: Server;
  let mockWsServer: WebSocketServer;
  let mockClient: WebSocket & Partial<ExtendedWebSocket>;
  const serverEventHandlers: { [key: string]: ((...args: unknown[]) => void) } = {};
  const clientEventHandlers: { [key: string]: ((...args: unknown[]) => void) } = {};

  beforeEach(() => {
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
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
      on: jest.fn(function(this: WebSocket, event: string, listener: (...args: unknown[]) => void) {
        clientEventHandlers[event] = listener;
        return this;
      }),
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
      off: jest.fn(),
      isAlive: true,
      subscriptions: new Set(['test-channel']),
      pause: jest.fn(),
      resume: jest.fn()
    };

    mockClient = mockWebSocket as WebSocket & Partial<ExtendedWebSocket>;

    const mockServer = {
      options: {
        path: '/',
        clientTracking: true,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: false,
        handleProtocols: null,
        verifyClient: null,
        noServer: false,
        backlog: null,
        server: null,
        webSocket: null
      },
      clients: new Set([mockClient]),
      on(event: string, listener: (...args: unknown[]) => void) {
        serverEventHandlers[event] = listener;
        return this;
      },
      close: jest.fn(),
      handleUpgrade: jest.fn(),
      shouldHandle: jest.fn(),
      removeAllListeners: jest.fn(),
      removeListener: jest.fn(),
      address: jest.fn(),
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

    mockWsServer = mockServer as unknown as WebSocketServer;
    (WebSocketServer as unknown as jest.Mock).mockImplementation(() => mockWsServer);

    mockHttpServer = new Server();
    server = new NostrWSServer(mockHttpServer, {
      logger: {
        debug: jest.fn(),
        info: jest.fn(),
        error: jest.fn()
      },
      handlers: {
        message: async () => {},
        error: () => {},
        close: () => {}
      }
    });
  });

  afterEach(() => {
    if (server) {
      // Close the server and all its clients
      server.close();
    }
    // Clear any pending timers
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create WebSocket server', () => {
      expect(WebSocketServer).toHaveBeenCalledWith({ server: mockHttpServer });
    });
  });

  describe('broadcast', () => {
    it('should send message to all connected clients', () => {
      const message: NostrWSMessage = { type: 'event', data: { foo: 'bar' } };
      server.broadcast(message);
      expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('should not send to clients that are not open', () => {
      Object.defineProperty(mockClient, 'readyState', { value: WebSocket.CLOSED });
      const message: NostrWSMessage = { type: 'event', data: { foo: 'bar' } };
      server.broadcast(message);
      expect(mockClient.send).not.toHaveBeenCalled();
    });
  });

  describe('broadcastToChannel', () => {
    it('should send message only to clients subscribed to channel', () => {
      const message: NostrWSMessage = { type: 'event', data: { foo: 'bar' } };
      server.broadcastToChannel('test-channel', message);
      expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('should not send to clients not subscribed to channel', () => {
      mockClient.subscriptions = new Set(['other-channel']);
      const message: NostrWSMessage = { type: 'event', data: { foo: 'bar' } };
      server.broadcastToChannel('test-channel', message);
      expect(mockClient.send).not.toHaveBeenCalled();
    });
  });

  describe('client handling', () => {
    beforeEach(() => {
      // Simulate client connection
      serverEventHandlers['connection']?.(mockClient);
    });

    it('should handle client connection', () => {
      expect(mockClient.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockClient.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should handle client messages', () => {
      const message: NostrWSMessage = { type: 'event', data: { test: true } };
      clientEventHandlers['message']?.(JSON.stringify(message));
      // Add your message handling expectations here
    });

    it('should handle client disconnection', () => {
      clientEventHandlers['close']?.();
      expect(mockClient.isAlive).toBe(false);
    });
  });
});
