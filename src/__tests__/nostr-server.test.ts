import WebSocket from 'ws';
import { NostrWSServer, createWSServer } from '../nostr-server';
import { NostrWSMessageType } from '../types/messages';
import { NostrWSSocket, NostrWSEvent } from '../types/nostr';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Define base handler types
type MessageHandlerFn = (socket: NostrWSSocket, message: any[]) => void | Promise<void>;
type ErrorHandlerFn = (socket: NostrWSSocket, error: Error) => void;
type CloseHandlerFn = (socket: NostrWSSocket) => void;

// Create jest mock types that extend the base handlers
type MessageHandler = jest.MockedFunction<MessageHandlerFn>;
type ErrorHandler = jest.MockedFunction<ErrorHandlerFn>;
type CloseHandler = jest.MockedFunction<CloseHandlerFn>;

describe('NostrWSServer', () => {
  let server: NostrWSServer;
  let client: WebSocket;
  const PORT = 8888;
  
  beforeEach((done) => {
    server = createWSServer({
      port: PORT,
      heartbeatInterval: 1000,
      handlers: {
        message: jest.fn() as MessageHandler,
        error: jest.fn() as ErrorHandler,
        close: jest.fn() as CloseHandler,
      },
    });
    
    // Wait a bit for the server to start
    setTimeout(() => {
      client = new WebSocket(`ws://localhost:${PORT}`);
      client.on('open', () => {
        done();
      });
    }, 300);
  });
  
  afterEach((done) => {
    client.close();
    server.close();
    setTimeout(done, 300);
  });

  it('should create a server instance', () => {
    expect(server).toBeInstanceOf(NostrWSServer);
  });

  it('should handle client connections', (done) => {
    const onConnection = jest.fn();
    const testServer = createWSServer({
      port: PORT + 1,
      onConnection,
      handlers: {
        message: jest.fn() as MessageHandler,
      },
    });

    const testClient = new WebSocket(`ws://localhost:${PORT + 1}`);
    
    testClient.on('open', () => {
      expect(onConnection).toHaveBeenCalled();
      const socket = onConnection.mock.calls[0][0] as NostrWSSocket;
      expect(socket).toHaveProperty('subscriptions');
      expect(socket.subscriptions).toBeInstanceOf(Set);
      expect(socket.isAlive).toBe(true);
      
      testClient.close();
      testServer.close();
      done();
    });
  });

  it('should handle Nostr EVENT messages', (done) => {
    const messageHandler = jest.fn() as MessageHandler;
    const testServer = createWSServer({
      port: PORT + 2,
      handlers: {
        message: messageHandler,
      },
    });

    const testClient = new WebSocket(`ws://localhost:${PORT + 2}`);
    
    const testEvent: NostrWSEvent = {
      id: 'test-id',
      pubkey: 'test-pubkey',
      created_at: Math.floor(Date.now() / 1000),
      kind: 1,
      tags: [],
      content: 'test content',
      sig: 'test-sig',
    };

    testClient.on('open', () => {
      testClient.send(JSON.stringify([NostrWSMessageType.EVENT, testEvent]));

      // Give time for the message to be processed
      setTimeout(() => {
        expect(messageHandler).toHaveBeenCalled();
        const message = messageHandler.mock.calls[0][1];
        expect(message[0]).toBe(NostrWSMessageType.EVENT);
        expect(message[1]).toEqual(testEvent);
        
        testClient.close();
        testServer.close();
        done();
      }, 100);
    });
  });

  it('should handle Nostr REQ messages', (done) => {
    const messageHandler = jest.fn() as MessageHandler;
    const testServer = createWSServer({
      port: PORT + 3,
      handlers: {
        message: messageHandler,
      },
    });

    const testClient = new WebSocket(`ws://localhost:${PORT + 3}`);
    
    const testFilter = {
      kinds: [1],
      authors: ['test-pubkey'],
      limit: 10,
    };

    testClient.on('open', () => {
      testClient.send(JSON.stringify([NostrWSMessageType.REQ, 'subscription-id', testFilter]));

      // Give time for the message to be processed
      setTimeout(() => {
        expect(messageHandler).toHaveBeenCalled();
        const message = messageHandler.mock.calls[0][1];
        expect(message[0]).toBe(NostrWSMessageType.REQ);
        expect(message[1]).toBe('subscription-id');
        expect(message[2]).toEqual(testFilter);
        
        testClient.close();
        testServer.close();
        done();
      }, 100);
    });
  });

  it('should handle connection errors', (done) => {
    const errorHandler = jest.fn() as ErrorHandler;
    const testServer = createWSServer({
      port: PORT + 5,
      handlers: {
        message: jest.fn() as MessageHandler,
        error: errorHandler,
      },
    });

    const testClient = new WebSocket(`ws://localhost:${PORT + 5}`);
    
    testClient.on('open', () => {
      // Send invalid JSON to trigger an error
      testClient.send('invalid json');

      // Give time for error to be processed
      setTimeout(() => {
        expect(errorHandler).toHaveBeenCalled();
        testClient.close();
        testServer.close();
        done();
      }, 100);
    });
  }, 10000);

  it('should handle client disconnections', (done) => {
    const closeHandler = jest.fn() as CloseHandler;
    const testServer = createWSServer({
      port: PORT + 6,
      handlers: {
        message: jest.fn() as MessageHandler,
        close: closeHandler,
      },
    });

    const testClient = new WebSocket(`ws://localhost:${PORT + 6}`);
    
    testClient.on('open', () => {
      testClient.close();

      // Give time for close event to be processed
      setTimeout(() => {
        expect(closeHandler).toHaveBeenCalled();
        testServer.close();
        done();
      }, 100);
    });
  });
});
