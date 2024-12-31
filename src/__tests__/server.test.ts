import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { NostrWSServer } from '../core/nostr-server';
import type { NostrWSMessage } from '../types/messages';
import type { NostrWSServerSocket } from '../types/websocket';
import { EventEmitter } from 'events';

// Mock uuid to return consistent IDs
vi.mock('uuid', () => ({
  v4: vi.fn().mockReturnValue('test-client-id')
}));

// Mock the entire ws module
vi.mock('ws', () => ({
  WebSocket: vi.fn(),
  WebSocketServer: vi.fn().mockImplementation(() => {
    const server = new EventEmitter();
    Object.assign(server, { 
      close: vi.fn((callback?: () => void) => {
        if (callback) callback();
      }),
      clients: new Set()
    });
    return server;
  })
}));

describe('NostrWSServer', () => {
  let server: NostrWSServer;
  let mockClient: NostrWSServerSocket & EventEmitter;
  let messageHandler: (message: NostrWSMessage, socket: NostrWSServerSocket) => Promise<void>;
  let closeHandler: (socket: NostrWSServerSocket) => void;
  let errorHandler: (error: Error, socket: NostrWSServerSocket) => void;

  beforeEach(() => {
    messageHandler = vi.fn().mockImplementation(async (message, _socket) => {
      console.log('Message handler called with:', message);
    });
    closeHandler = vi.fn().mockImplementation((socket) => {
      console.log('Close handler called with:', socket);
    });
    errorHandler = vi.fn();

    // Create mock client with all required WebSocket properties
    const emitter = new EventEmitter();
    mockClient = Object.assign(emitter, {
      isAlive: false,
      subscriptions: new Set<string>(),
      clientId: 'test-client-id',
      readyState: 1,
      send: vi.fn(),
      close: vi.fn(),
      ping: vi.fn(),
      // WebSocket required properties
      binaryType: 'nodebuffer',
      bufferedAmount: 0,
      extensions: '',
      protocol: '',
      url: 'ws://localhost:0',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      terminate: vi.fn(),
      // EventEmitter methods
      on: emitter.on.bind(emitter),
      off: emitter.off.bind(emitter),
      emit: emitter.emit.bind(emitter)
    }) as unknown as NostrWSServerSocket;

    // Create server with handlers
    server = new NostrWSServer({ 
      port: 0,
      onMessage: messageHandler,
      onClose: closeHandler,
      onError: errorHandler
    });

    // Add client to server's client set
    server['server'].emit('connection', mockClient);
  });

  afterEach(() => {
    // Clean up the server
    server.stop();
    // Clean up all mocks
    vi.clearAllMocks();
    // Reset all event listeners
    mockClient.removeAllListeners();
  });

  describe('constructor', () => {
    it('should create WebSocket server', { timeout: 5000 }, () => {
      expect(server).toBeInstanceOf(NostrWSServer);
    });
  });

  describe('client handling', () => {
    it('should handle client connection', { timeout: 5000 }, () => {
      // Trigger connection event
      server['server'].emit('connection', mockClient);
      
      // Verify client setup
      expect(mockClient.clientId).toBe('test-client-id');
      expect(mockClient.subscriptions).toBeDefined();
      expect(mockClient.isAlive).toBe(true);
    });

    it('should handle message events', async () => {
      const message: NostrWSMessage = {
        type: 'EVENT',
        data: {
          id: 'test',
          pubkey: 'test',
          created_at: 123,
          kind: 1,
          tags: [],
          content: 'test'
        }
      };

      // Emit the message event directly on the mock client
      mockClient.emit('message', Buffer.from(JSON.stringify(message)));

      // Wait for async operations with timeout
      try {
        await vi.waitFor(() => {
          expect(messageHandler).toHaveBeenCalledWith(message, mockClient);
        }, { timeout: 1000 });
      } catch (error) {
        console.error('Message handler was not called within timeout');
        throw error;
      }
    });

    it('should handle client disconnection', async () => {
      // Emit the close event directly on the mock client
      mockClient.emit('close');

      // Wait for async operations with timeout
      try {
        await vi.waitFor(() => {
          expect(closeHandler).toHaveBeenCalledWith(mockClient);
        }, { timeout: 1000 });
      } catch (error) {
        console.error('Close handler was not called within timeout');
        throw error;
      }
    });
  });

  describe('connection handling', () => {
    it('should create a new server instance', { timeout: 5000 }, () => {
      expect(server).toBeInstanceOf(NostrWSServer);
      expect(server['server']).toBeDefined();
    });
  });
});
