import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { jest } from '@jest/globals';

interface MockServerOptions {
  port?: number;
  host?: string;
  [key: string]: unknown;
}

class MockServer extends EventEmitter {
  options: MockServerOptions;
  path: string;
  clients: Set<WebSocket>;
  address: string;

  constructor(options?: MockServerOptions) {
    super();
    this.options = options || {};
    this.path = '/';
    this.clients = new Set();
    this.address = 'localhost';
  }

  close(cb?: (err?: Error) => void): void {
    this.clients.clear();
    if (cb) cb();
  }

  handleUpgrade = jest.fn((request: IncomingMessage, socket: Socket, head: Buffer, callback: (ws: WebSocket) => void) => {
    const ws = new WebSocket('ws://mock');
    this.clients.add(ws);
    callback(ws);
  });

  shouldHandle = jest.fn((_request: IncomingMessage): boolean => {
    return true;
  });
}

export default MockServer;
