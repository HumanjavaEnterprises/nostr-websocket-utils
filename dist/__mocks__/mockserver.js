import { vi } from 'vitest';
import { EventEmitter } from 'events';
import { ExtendedWsMock } from './extendedWsMock.js';
export class MockServer extends EventEmitter {
    constructor(options) {
        super();
        this.clients = new Set();
        this.handleConnection = vi.fn((socket) => {
            this.clients.add(socket);
            this.emit('connection', socket);
        });
        this.handleMessage = vi.fn((socket, message) => {
            this.emit('message', socket, message);
        });
        this.handleClose = vi.fn((socket) => {
            this.clients.delete(socket);
            this.emit('close', socket);
        });
        this.broadcast = vi.fn((message) => {
            this.clients.forEach(client => {
                client.send(JSON.stringify(message));
            });
        });
        this.handleUpgrade = vi.fn((request, socket, head, callback) => {
            const ws = new ExtendedWsMock();
            callback(ws);
        });
        this.shouldHandle = vi.fn((_request) => {
            return true;
        });
        this.options = options || {};
        this.path = '/';
        this.address = 'localhost';
    }
    listen(port, cb) {
        if (cb)
            cb();
    }
}
//# sourceMappingURL=mockserver.js.map