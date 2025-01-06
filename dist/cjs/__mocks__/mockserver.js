"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockServer = void 0;
const vitest_1 = require("vitest");
const events_1 = require("events");
const extendedWsMock_js_1 = require("./extendedWsMock.js");
class MockServer extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.clients = new Set();
        this.handleConnection = vitest_1.vi.fn((socket) => {
            this.clients.add(socket);
            this.emit('connection', socket);
        });
        this.handleMessage = vitest_1.vi.fn((socket, message) => {
            this.emit('message', socket, message);
        });
        this.handleClose = vitest_1.vi.fn((socket) => {
            this.clients.delete(socket);
            this.emit('close', socket);
        });
        this.broadcast = vitest_1.vi.fn((message) => {
            this.clients.forEach(client => {
                client.send(JSON.stringify(message));
            });
        });
        this.handleUpgrade = vitest_1.vi.fn((request, socket, head, callback) => {
            const ws = new extendedWsMock_js_1.ExtendedWsMock();
            callback(ws);
        });
        this.shouldHandle = vitest_1.vi.fn((_request) => {
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
exports.MockServer = MockServer;
//# sourceMappingURL=mockserver.js.map