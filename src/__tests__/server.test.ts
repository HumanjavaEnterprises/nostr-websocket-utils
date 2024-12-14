import { NostrWSServer } from '../server.js';
import WebSocket, { WebSocketServer } from 'ws';
import type { NostrWSMessage, ExtendedWebSocket } from '../types/index.js';
import { jest, describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { EventEmitter } from 'events';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

jest.mock('ws');

describe('NostrWSServer', () => {
  let server: NostrWSServer;
  let mockWsServer: WebSocketServer;
  let mockClient: WebSocket & Partial<ExtendedWebSocket>;
  let clientEventHandlers: { [key: string]: ((...args: unknown[]) => void) } = {};
  let messageHandler: jest.Mock<(ws: ExtendedWebSocket, message: NostrWSMessage) => void>;
  let closeHandler: jest.Mock<(ws: ExtendedWebSocket) => void>;
  let errorHandler: jest.Mock<(ws: ExtendedWebSocket, error: Error) => void>;

  beforeEach(() => {
    clientEventHandlers = {};
    messageHandler = jest.fn<(ws: ExtendedWebSocket, message: NostrWSMessage) => void>();
    closeHandler = jest.fn<(ws: ExtendedWebSocket) => void>();
    errorHandler = jest.fn<(ws: ExtendedWebSocket, error: Error) => void>();

    // Create mock client first
    mockClient = {
      isAlive: true,
      subscriptions: new Set<string>(),
      clientId: 'test-client-id',
      CONNECTING: WebSocket.CONNECTING,
      OPEN: WebSocket.OPEN,
      CLOSING: WebSocket.CLOSING,
      CLOSED: WebSocket.CLOSED,
      readyState: WebSocket.OPEN,
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
      binaryType: 'arraybuffer' as const,
      bufferedAmount: 0,
      extensions: '',
      isPaused: false,
      protocol: '',
      url: 'ws://localhost:8080',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getMaxListeners: jest.fn().mockReturnValue(10),
      on: jest.fn((event: string, listener: (...args: any[]) => void) => {
        clientEventHandlers[event] = listener;
        return mockClient;
      }) as jest.MockedFunction<(event: string, listener: (...args: any[]) => void) => WebSocket & Partial<ExtendedWebSocket>>,
      send: jest.fn(),
      close: jest.fn(),
      ping: jest.fn(),
      pong: jest.fn(),
      terminate: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      removeAllListeners: jest.fn().mockReturnThis(),
      removeListener: jest.fn().mockReturnThis(),
      addListener: jest.fn().mockReturnThis(),
      once: jest.fn().mockReturnThis(),
      emit: jest.fn().mockReturnValue(true),
      eventNames: jest.fn().mockReturnValue([]),
      listenerCount: jest.fn().mockReturnValue(0),
      listeners: jest.fn().mockReturnValue([]),
      off: jest.fn().mockReturnThis(),
      prependListener: jest.fn().mockReturnThis(),
      prependOnceListener: jest.fn().mockReturnThis(),
      rawListeners: jest.fn().mockReturnValue([]),
      setMaxListeners: jest.fn().mockReturnThis(),
    } as unknown as WebSocket & Partial<ExtendedWebSocket>;

    // Create mock WebSocket server
    mockWsServer = new MockServer() as unknown as WebSocketServer;

    // Create NostrWSServer instance
    server = new NostrWSServer(mockWsServer, {
      logger: console,
      handlers: {
        message: messageHandler,
        close: closeHandler,
        error: errorHandler
      }
    });

    // Simulate client connection
    server['handleConnection'](mockClient as ExtendedWebSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
    server.close();
  });

  describe('constructor', () => {
    it('should create WebSocket server', () => {
      const wsServer = new WebSocketServer({ noServer: true });
      const nostrServer = new NostrWSServer(wsServer, {
        logger: console,
        handlers: {
          message: async () => {},
          error: () => {},
          close: () => {},
        },
      });
      expect(nostrServer).toBeInstanceOf(NostrWSServer);
    });
  });

  describe('client handling', () => {
    it('should handle client connection', () => {
      expect(mockClient.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockClient.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should handle message events', async () => {
      const message: NostrWSMessage = {
        type: 'EVENT',
        data: { id: '123', kind: 1, content: 'test', created_at: 123, pubkey: 'abc', sig: 'def', tags: [] },
      };
      const messageData = Buffer.from(JSON.stringify(message));

      // Get the message handler from clientEventHandlers and call it
      const handler = clientEventHandlers['message'];
      await handler(messageData);

      expect(messageHandler).toHaveBeenCalledWith(mockClient, message);
    });

    it('should handle client disconnection', () => {
      // Get the close handler from clientEventHandlers and call it
      const handler = clientEventHandlers['close'];
      handler();
      
      // Check if the client was removed from the server's clients map
      expect(server.clients.has(mockClient.clientId!)).toBe(false);
    });
  });
});

class MockServer extends EventEmitter {
  options: Record<string, unknown>;
  path: string;
  clients: Set<WebSocket & Partial<ExtendedWebSocket>>;
  address: string;

  constructor(options?: Record<string, unknown>) {
    super();
    this.options = options || {};
    this.path = '/';
    this.clients = new Set();
    this.address = 'localhost';
  }

  close() {
    // Mock close implementation
  }

  handleUpgrade(request: IncomingMessage, socket: Socket, head: Buffer, callback: (ws: WebSocket) => void) {
    // Mock handleUpgrade implementation
    callback(new WebSocket('ws://mock')); // Example callback
  }

  shouldHandle(_request: IncomingMessage): boolean {
    // Mock shouldHandle implementation
    return true; // Example logic
  }
}
