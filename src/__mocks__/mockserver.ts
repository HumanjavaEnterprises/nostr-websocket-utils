import { vi } from 'vitest';
import { EventEmitter } from 'events';
import type { NostrWSMessage } from '../types/messages.js';
import type { NostrWSSocket } from '../types/socket.js';
import type { IncomingMessage } from 'http';
import type { Socket } from 'net';
import type { WebSocket } from 'ws';
import { ExtendedWsMock } from './extendedWsMock.js';

interface MockServerOptions {
  port?: number;
  host?: string;
  [key: string]: unknown;
}

export class MockServer extends EventEmitter {
  clients: Set<NostrWSSocket> = new Set();
  options: MockServerOptions;
  path: string;
  address: string;

  constructor(options?: MockServerOptions) {
    super();
    this.options = options || {};
    this.path = '/';
    this.address = 'localhost';
  }

  listen(port: number, cb?: () => void): void {
    if (cb) cb();
  }

  handleConnection = vi.fn((socket: NostrWSSocket) => {
    this.clients.add(socket);
    this.emit('connection', socket);
  });

  handleMessage = vi.fn((socket: NostrWSSocket, message: NostrWSMessage) => {
    this.emit('message', socket, message);
  });

  handleClose = vi.fn((socket: NostrWSSocket) => {
    this.clients.delete(socket);
    this.emit('close', socket);
  });

  broadcast = vi.fn((message: NostrWSMessage) => {
    this.clients.forEach(client => {
      client.send(JSON.stringify(message));
    });
  });

  handleUpgrade = vi.fn((request: IncomingMessage, socket: Socket, head: Buffer, callback: (ws: WebSocket) => void) => {
    const ws: WebSocket = new ExtendedWsMock() as unknown as WebSocket;
    callback(ws);
  });

  shouldHandle = vi.fn((_request: IncomingMessage): boolean => {
    return true;
  });
}
