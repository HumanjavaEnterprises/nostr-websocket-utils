import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocket } from 'ws';
import { NostrWSServer } from '../server.js';
import { mockLogger } from './mocks/logger.js';

// Mock logger

describe('NostrWSServer', () => {
  let server: NostrWSServer;
  let httpServer: ReturnType<typeof createServer>;
  let client: WebSocket;
  const mockMessageHandler = vi.fn();
  const mockErrorHandler = vi.fn();
  const mockCloseHandler = vi.fn();

  beforeEach(async () => {
    httpServer = createServer();
    server = new NostrWSServer(httpServer, {
      logger: mockLogger,
      handlers: {
        message: mockMessageHandler,
        error: mockErrorHandler,
        close: mockCloseHandler,
      },
    });

    await new Promise<void>((resolve) => {
      httpServer.listen(0, 'localhost', resolve);
    });
  });

  afterEach(async () => {
    if (client) {
      client.close();
    }
    server.close();
    await new Promise<void>((resolve) => {
      httpServer.close(() => resolve());
    });
    vi.clearAllMocks();
  });

  const connectClient = async (): Promise<WebSocket> => {
    const port = (httpServer.address() as { port: number }).port;
    const ws = new WebSocket(`ws://localhost:${port}`);
    await new Promise<void>((resolve) => {
      ws.on('open', resolve);
    });
    return ws;
  };

  describe('connection handling', () => {
    it('should handle new connections with enhanced features', async () => {
      client = await connectClient();
      const stats = server.getStats();
      expect(stats.total).toBe(1);
      expect(stats.authenticated).toBe(0);
    });

    it('should handle client authentication', async () => {
      client = await connectClient();
      const authEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        sig: 'test-sig'
      };
      client.send(JSON.stringify(['AUTH', authEvent]));
      
      // Wait for authentication to process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const stats = server.getStats();
      expect(stats.authenticated).toBe(1);
    });

    it('should track client subscriptions', async () => {
      client = await connectClient();
      const message = { type: 'test', data: 'test-data' };
      
      // Send a test message
      client.send(JSON.stringify(message));
      
      // Wait for message processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(mockMessageHandler).toHaveBeenCalled();
    });
  });

  describe('broadcasting', () => {
    let client1: WebSocket;
    let client2: WebSocket;

    beforeEach(async () => {
      client1 = await connectClient();
      client2 = await connectClient();
    });

    afterEach(() => {
      client1.close();
      client2.close();
    });

    it('should broadcast to all clients', async () => {
      const message = { type: 'broadcast', data: 'test' };
      const messagePromise = Promise.all([
        new Promise(resolve => client1.once('message', resolve)),
        new Promise(resolve => client2.once('message', resolve))
      ]);

      server.broadcast(message);
      await messagePromise;
    });

    it('should broadcast only to authenticated clients', async () => {
      const authEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        sig: 'test-sig'
      };
      
      // Authenticate client1
      client1.send(JSON.stringify(['AUTH', authEvent]));
      await new Promise(resolve => setTimeout(resolve, 100));

      const message = { type: 'authenticated', data: 'test' };
      let client1Received = false;
      let client2Received = false;

      client1.on('message', () => { client1Received = true; });
      client2.on('message', () => { client2Received = true; });

      server.broadcastAuthenticated(message);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(client1Received).toBe(true);
      expect(client2Received).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle client errors', async () => {
      client = await connectClient();
      const errorSpy = vi.fn();
      server.on('error', errorSpy);
      
      // Wait for the connection to be established on the server side
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the server's WebSocket instance and emit error
      server['wss'].clients.forEach((ws: WebSocket) => {
        ws.emit('error', new Error('test error'));
      });
      
      // Wait for error to be processed
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should handle client disconnection', async () => {
      client = await connectClient();
      client.close();
      
      // Wait for close event to process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const stats = server.getStats();
      expect(stats.total).toBe(0);
    });
  });
});
