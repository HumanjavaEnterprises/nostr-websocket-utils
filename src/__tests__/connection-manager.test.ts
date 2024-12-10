import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConnectionManager } from '../connection-manager.js';
import { mockLogger } from './mocks/logger.js';
import { WebSocket } from 'ws';
import type { EnhancedWebSocket, Logger } from '../types/index.js';

describe('ConnectionManager', () => {
  let connectionManager: ConnectionManager;
  let mockLogger: Logger;
  let mockWebSocket: EnhancedWebSocket;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn()
    };

    mockWebSocket = {
      id: 'test-id',
      authenticated: false,
      subscriptions: new Set(),
      readyState: 1,
      send: vi.fn(),
      close: vi.fn(),
      on: vi.fn(),
      once: vi.fn(),
      emit: vi.fn(),
      removeListener: vi.fn()
    } as unknown as EnhancedWebSocket;

    connectionManager = new ConnectionManager(mockLogger);
  });

  describe('connection management', () => {
    it('should add a connection', () => {
      const extWs = connectionManager.addConnection(mockWebSocket as WebSocket);
      expect(extWs.id).toBeDefined();
      expect(extWs.authenticated).toBe(false);
      expect(extWs.subscriptions).toBeInstanceOf(Set);
      expect(extWs.connectedAt).toBeInstanceOf(Date);
    });

    it('should remove a connection', () => {
      const extWs = connectionManager.addConnection(mockWebSocket as WebSocket);
      connectionManager.removeConnection(extWs);
      expect(connectionManager.getConnection(extWs.id)).toBeUndefined();
    });
  });

  describe('message handling', () => {
    let extWs: EnhancedWebSocket;

    beforeEach(() => {
      extWs = connectionManager.addConnection(mockWebSocket as WebSocket);
    });

    it('should handle unauthenticated messages', async () => {
      await connectionManager.handleMessage(extWs, ['EVENT', {}]);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Unauthenticated client'));
    });

    it('should allow AUTH messages when unauthenticated', async () => {
      await connectionManager.handleMessage(extWs, ['AUTH', { pubkey: 'test' }]);
      expect(extWs.authenticated).toBe(true);
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('authenticated with pubkey'));
    });

    it('should handle subscriptions when authenticated', async () => {
      extWs.authenticated = true;
      await connectionManager.handleMessage(extWs, ['SUB', 'test-channel']);
      expect(extWs.subscriptions.has('test-channel')).toBe(true);
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('subscribed to'));
    });

    it('should handle unsubscriptions', async () => {
      extWs.authenticated = true;
      extWs.subscriptions.add('test-channel');
      await connectionManager.handleMessage(extWs, ['UNSUB', 'test-channel']);
      expect(extWs.subscriptions.has('test-channel')).toBe(false);
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('unsubscribed from'));
    });

    it('should handle unknown message types', async () => {
      extWs.authenticated = true;
      await connectionManager.handleMessage(extWs, ['UNKNOWN', {}]);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Unknown message type'));
    });
  });

  describe('broadcasting', () => {
    let extWs: EnhancedWebSocket;
    const testMessage = ['EVENT', { id: 'test' }];

    beforeEach(() => {
      extWs = connectionManager.addConnection(mockWebSocket as WebSocket);
    });

    it('should broadcast to all connected clients', async () => {
      await connectionManager.broadcast(testMessage);
      expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(testMessage));
    });

    it('should broadcast to authenticated clients only', async () => {
      extWs.authenticated = true;
      await connectionManager.broadcastToAuthenticated(testMessage);
      expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(testMessage));
    });

    it('should not broadcast to unauthenticated clients', async () => {
      extWs.authenticated = false;
      await connectionManager.broadcastToAuthenticated(testMessage);
      expect(mockWebSocket.send).not.toHaveBeenCalled();
    });

    it('should broadcast to subscribed clients', async () => {
      extWs.authenticated = true;
      extWs.subscriptions.add('test-channel');
      await connectionManager.broadcastToSubscription('test-channel', testMessage);
      expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(testMessage));
    });

    it('should handle broadcast errors', async () => {
      mockWebSocket.send.mockImplementation(() => {
        throw new Error('Send error');
      });
      await connectionManager.broadcast(testMessage);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Error broadcasting to client'), expect.any(Error));
    });
  });

  describe('stats', () => {
    it('should return connection statistics', () => {
      const extWs = connectionManager.addConnection(mockWebSocket as WebSocket);
      extWs.authenticated = true;
      extWs.subscriptions.add('test-channel');

      const stats = connectionManager.getStats();
      expect(stats.totalConnections).toBe(1);
      expect(stats.authenticatedConnections).toBe(1);
      expect(stats.totalSubscriptions).toBe(1);
      expect(stats.uptime).toBeGreaterThanOrEqual(0);
    });
  });
});
