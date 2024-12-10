import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NostrWSServer } from '../server.js';
import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';
import { NostrWSError, ErrorCodes } from '../error-handler.js';
import type { NostrEvent, NostrWSMessage } from '../types/index.js';

vi.mock('ws', () => ({
  WebSocket: vi.fn(),
  WebSocketServer: vi.fn(() => ({
    on: vi.fn(),
    close: vi.fn(),
  })),
}));

describe('NostrWSServer', () => {
  let server: NostrWSServer;
  let mockWss: any;
  let mockWs: any;
  let mockLogger: any;
  let eventHandlers: Record<string, Function> = {};
  let wsEventHandlers: Record<string, Function> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    eventHandlers = {};
    wsEventHandlers = {};

    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    };

    mockWs = {
      on: vi.fn((event, handler) => {
        wsEventHandlers[event] = handler;
      }),
      send: vi.fn(),
      close: vi.fn(),
    };

    mockWss = {
      on: vi.fn((event, handler) => {
        eventHandlers[event] = handler;
      }),
      close: vi.fn(),
    };

    const WebSocketServerMock = vi.mocked(WebSocketServer);
    WebSocketServerMock.mockImplementation(() => mockWss);

    const httpServer = createServer();
    server = new NostrWSServer(httpServer, {
      logger: mockLogger,
      handlers: {
        message: vi.fn(),
        error: vi.fn(),
        close: vi.fn(),
      },
    });
  });

  describe('message handling', () => {
    it('should handle valid messages', async () => {
      const mockHandler = vi.fn();
      const event: NostrEvent = {
        id: '123',
        pubkey: 'abc',
        created_at: 123,
        kind: 1,
        tags: [],
        content: 'test',
        sig: 'xyz',
      };
      const message: NostrWSMessage = ['EVENT', event];

      server = new NostrWSServer(createServer(), {
        logger: mockLogger,
        handlers: {
          message: mockHandler,
          error: vi.fn(),
          close: vi.fn(),
        },
      });

      if (eventHandlers.connection) {
        eventHandlers.connection(mockWs);
      }

      if (wsEventHandlers.message) {
        wsEventHandlers.message(Buffer.from(JSON.stringify(message)));
      }

      expect(mockHandler).toHaveBeenCalledWith(expect.anything(), message);
    });

    it('should handle invalid messages', async () => {
      const mockHandler = vi.fn();
      server = new NostrWSServer(createServer(), {
        logger: mockLogger,
        handlers: {
          message: mockHandler,
          error: vi.fn(),
          close: vi.fn(),
        },
      });

      if (eventHandlers.connection) {
        eventHandlers.connection(mockWs);
      }

      if (wsEventHandlers.message) {
        wsEventHandlers.message(Buffer.from('invalid json'));
      }

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringMatching(/Message error for client .+: Unexpected token/),
        'invalid json'
      );
    });

    it('should handle invalid message format', async () => {
      const mockHandler = vi.fn();
      server = new NostrWSServer(createServer(), {
        logger: mockLogger,
        handlers: {
          message: mockHandler,
          error: vi.fn(),
          close: vi.fn(),
        },
      });

      if (eventHandlers.connection) {
        eventHandlers.connection(mockWs);
      }

      if (wsEventHandlers.message) {
        wsEventHandlers.message(Buffer.from(JSON.stringify(['INVALID'])));
      }

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringMatching(/Protocol error for client .+: Invalid message format/)
      );
    });
  });

  describe('connection handling', () => {
    it('should handle new connections', () => {
      if (eventHandlers.connection) {
        eventHandlers.connection(mockWs);
      }

      expect(mockWs.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(mockWs.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockWs.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should handle connection close', () => {
      if (eventHandlers.connection) {
        eventHandlers.connection(mockWs);
      }

      if (wsEventHandlers.close) {
        wsEventHandlers.close();
      }

      expect(server.getStats().totalConnections).toBe(0);
    });
  });
});
