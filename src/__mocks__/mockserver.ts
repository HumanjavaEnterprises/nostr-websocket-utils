import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { jest } from '@jest/globals';

class MockServer extends EventEmitter {
  options: any;
  path: string;
  clients: Set<WebSocket>;
  address: string;

  constructor(options?: any) {
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

  handleUpgrade = jest.fn((request: any, socket: any, head: any, callback: (ws: WebSocket) => void) => {
    const ws = new WebSocket('ws://mock');
    this.clients.add(ws);
    callback(ws);
  });

  shouldHandle = jest.fn((request: any): boolean => {
    return true;
  });
}

export default MockServer;
