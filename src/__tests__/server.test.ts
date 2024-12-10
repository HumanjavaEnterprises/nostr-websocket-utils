import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NostrWSServer } from '../server.js';
import type { NostrWSMessage, EnhancedWebSocket } from '../types/index.js';
import { WebSocketServer } from 'ws';
import { ConnectionManager } from '../connection-manager.js';

vi.mock('ws', () => ({
  WebSocketServer: vi.fn(() => ({
    on: vi.fn(),
    close: vi.fn(),
  })),
  WebSocket: vi.fn(),
}));

vi.mock('../connection-manager.js', () => ({
  ConnectionManager: vi.fn(() => ({
    addConnection: vi.fn((ws) => ws),
    removeConnection: vi.fn(),
    broadcast: vi.fn(),
    broadcastToAuthenticated: vi.fn(),
    broadcastToSubscription: vi.fn(),
    getStats: vi.fn(() => ({
      totalConnections: 0,
      authenticatedConnections: 0,
      totalSubscriptions: 0,
      uptime: 0
    })),
  })),
}));

describe('NostrWSServer', () => {
  let server: NostrWSServer;
  let mockHttpServer: { on: (event: string, handler: () => void) => void };
  let mockWs: EnhancedWebSocket;
  let mockLogger: { info: any; error: any; warn: any; debug: any };
  let connectionHandler: (ws: WebSocket) => void;

  beforeEach(() => {
    vi.clearAllMocks();

    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    };

    mockWs = {
      on: vi.fn(),
      send: vi.fn(),
      close: vi.fn(),
      id: '123',
      isAlive: true,
      readyState: 1, // WebSocket.OPEN
    };

    mockHttpServer = {
      on: vi.fn(),
    };

    server = new NostrWSServer(mockHttpServer, {
      logger: mockLogger,
      handlers: {
        message: vi.fn(),
        error: vi.fn(),
        close: vi.fn(),
      },
    });

    // Get the connection handler from the WebSocketServer mock
    const WebSocketServerMock = vi.mocked(WebSocketServer);
    connectionHandler = WebSocketServerMock.mock.results[0].value.on.mock.calls.find(
      call => call[0] === 'connection'
    )?.[1];
  });

  describe('message handling', () => {
    it('should handle valid messages', async () => {
      const mockHandler = vi.fn();
      const event = {
        id: '123',
        pubkey: 'abc',
        created_at: 123,
        kind: 1,
        tags: [],
        content: 'test',
        sig: 'xyz',
      };
      const message = ['EVENT', event];

      // Update the server's message handler
      server.options.handlers.message = mockHandler;

      // Call the connection handler with our mock WebSocket
      connectionHandler(mockWs);

      // Get and call the message handler
      const messageHandler = mockWs.on.mock.calls.find(call => call[0] === 'message')?.[1];
      if (messageHandler) {
        await messageHandler(Buffer.from(JSON.stringify(message)));
        expect(mockHandler).toHaveBeenCalledWith(mockWs, message);
      }
    });

    it('should handle invalid messages', async () => {
      const mockHandler = vi.fn();
      server = new NostrWSServer(mockHttpServer, {
        logger: mockLogger,
        handlers: {
          message: mockHandler,
          error: vi.fn(),
          close: vi.fn(),
        },
      });

      // Get the connection handler from the WebSocketServer mock
      const WebSocketServerMock = vi.mocked(WebSocketServer);
      connectionHandler = WebSocketServerMock.mock.results[0].value.on.mock.calls.find(
        call => call[0] === 'connection'
      )?.[1];

      // Call the connection handler with our mock WebSocket
      connectionHandler(mockWs);

      // Get and call the message handler
      const messageHandler = mockWs.on.mock.calls.find(call => call[0] === 'message')?.[1];
      if (messageHandler) {
        await messageHandler(Buffer.from('invalid json'));
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining('Message error for client'),
          'invalid json'
        );
      }
    });

    it('should handle invalid message format', async () => {
      const mockHandler = vi.fn();
      server = new NostrWSServer(mockHttpServer, {
        logger: mockLogger,
        handlers: {
          message: mockHandler,
          error: vi.fn(),
          close: vi.fn(),
        },
      });

      // Get the connection handler from the WebSocketServer mock
      const WebSocketServerMock = vi.mocked(WebSocketServer);
      connectionHandler = WebSocketServerMock.mock.results[0].value.on.mock.calls.find(
        call => call[0] === 'connection'
      )?.[1];

      // Call the connection handler with our mock WebSocket
      connectionHandler(mockWs);

      // Get and call the message handler
      const messageHandler = mockWs.on.mock.calls.find(call => call[0] === 'message')?.[1];
      if (messageHandler) {
        await messageHandler(Buffer.from(JSON.stringify(['INVALID'])));
        expect(mockLogger.error).toHaveBeenCalledWith(
          expect.stringContaining('Protocol error for client')
        );
      }
    });
  });

  describe('connection handling', () => {
    it('should handle new connections', () => {
      // Call the connection handler with our mock WebSocket
      connectionHandler(mockWs);

      // Verify that all event handlers were registered
      const calls = mockWs.on.mock.calls;
      expect(calls).toContainEqual(['message', expect.any(Function)]);
      expect(calls).toContainEqual(['close', expect.any(Function)]);
      expect(calls).toContainEqual(['error', expect.any(Function)]);
    });

    it('should handle connection close', () => {
      // Call the connection handler with our mock WebSocket
      connectionHandler(mockWs);

      // Get and call the close handler
      const closeHandler = mockWs.on.mock.calls.find(call => call[0] === 'close')?.[1];
      if (closeHandler) {
        closeHandler();
        expect(server.getStats().totalConnections).toBe(0);
      }
    });
  });
});
