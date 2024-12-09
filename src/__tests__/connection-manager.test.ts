import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConnectionManager } from '../connection-manager.js';
import type { EnhancedWebSocket } from '../types/enhanced-websocket.js';
import { EventEmitter } from 'events';
import WebSocket from 'ws';

// Mock logger
const mockLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock WebSocket class
class MockWebSocket extends EventEmitter {
  public readyState = WebSocket.OPEN;
  public OPEN = WebSocket.OPEN;  
  public send = vi.fn();
  public ping = vi.fn();
  public terminate = vi.fn();
  public close = vi.fn();
  public subscriptions = new Set<string>();
  public isAlive = true;
  public authenticated = false;
  public id?: string;
  public pubkey?: string;
  public connectedAt?: Date;

  constructor() {
    super();
  }
}

describe('ConnectionManager', () => {
  let connectionManager: ConnectionManager;
  let mockWs: EnhancedWebSocket;

  beforeEach(() => {
    connectionManager = new ConnectionManager(mockLogger);
    mockWs = new MockWebSocket() as unknown as EnhancedWebSocket;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('registerConnection', () => {
    it('should register a new connection with generated ID', () => {
      connectionManager.registerConnection(mockWs);
      expect(mockWs.id).toBeDefined();
      expect(mockWs.connectedAt).toBeInstanceOf(Date);
      expect(mockWs.authenticated).toBe(false);
      expect(mockWs.isAlive).toBe(true);
      expect(mockWs.subscriptions).toBeInstanceOf(Set);
    });

    it('should keep existing ID if provided', () => {
      const existingId = 'test-id';
      mockWs.id = existingId;
      connectionManager.registerConnection(mockWs);
      expect(mockWs.id).toBe(existingId);
    });

    it('should emit connect event', () => {
      const spy = vi.fn();
      connectionManager.on('connect', spy);
      connectionManager.registerConnection(mockWs);
      expect(spy).toHaveBeenCalledWith(mockWs);
    });
  });

  describe('removeConnection', () => {
    it('should remove an existing connection', () => {
      connectionManager.registerConnection(mockWs);
      const id = mockWs.id!;
      connectionManager.removeConnection(mockWs);
      expect(connectionManager.getConnection(id)).toBeUndefined();
    });

    it('should emit disconnect event', () => {
      const spy = vi.fn();
      connectionManager.on('disconnect', spy);
      connectionManager.registerConnection(mockWs);
      connectionManager.removeConnection(mockWs);
      expect(spy).toHaveBeenCalledWith(mockWs);
    });
  });

  describe('handleAuth', () => {
    it('should authenticate a client with valid auth event', async () => {
      const authEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        sig: 'test-sig'
      };
      connectionManager.registerConnection(mockWs);
      await connectionManager.handleAuth(mockWs, ['AUTH', authEvent]);
      expect(mockWs.authenticated).toBe(true);
      expect(mockWs.pubkey).toBe(authEvent.pubkey);
    });

    it('should emit auth event on successful authentication', async () => {
      const spy = vi.fn();
      connectionManager.on('auth', spy);
      const authEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        sig: 'test-sig'
      };
      connectionManager.registerConnection(mockWs);
      await connectionManager.handleAuth(mockWs, ['AUTH', authEvent]);
      expect(spy).toHaveBeenCalledWith(mockWs);
    });
  });

  describe('broadcast methods', () => {
    let mockWs1: EnhancedWebSocket;
    let mockWs2: EnhancedWebSocket;

    beforeEach(() => {
      mockWs1 = new MockWebSocket() as unknown as EnhancedWebSocket;
      mockWs2 = new MockWebSocket() as unknown as EnhancedWebSocket;
      connectionManager.registerConnection(mockWs1);
      connectionManager.registerConnection(mockWs2);
    });

    it('should broadcast message to all connected clients', () => {
      const message = { type: 'test' };
      connectionManager.broadcast(message);
      expect(mockWs1.send).toHaveBeenCalledWith(JSON.stringify(message));
      expect(mockWs2.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('should broadcast only to authenticated clients', async () => {
      const message = { type: 'test' };
      mockWs1.authenticated = true;
      mockWs1.pubkey = 'test-pubkey';
      connectionManager.broadcastAuthenticated(message);
      expect(mockWs1.send).toHaveBeenCalledWith(JSON.stringify(message));
      expect(mockWs2.send).not.toHaveBeenCalled();
    });

    it('should broadcast only to subscribed clients', () => {
      const message = { type: 'test' };
      const channel = 'test-channel';
      mockWs1.subscriptions.add(channel);
      connectionManager.broadcastToChannel(channel, message);
      expect(mockWs1.send).toHaveBeenCalledWith(JSON.stringify(message));
      expect(mockWs2.send).not.toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('should return correct connection stats', async () => {
      connectionManager.registerConnection(mockWs);
      const authEvent = {
        id: 'test-id',
        pubkey: 'test-pubkey',
        sig: 'test-sig'
      };
      await connectionManager.handleAuth(mockWs, ['AUTH', authEvent]);
      
      const stats = connectionManager.getStats();
      expect(stats).toEqual({
        total: 1,
        authenticated: 1
      });
    });
  });
});
