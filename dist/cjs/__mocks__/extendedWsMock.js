"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockWebSocket = exports.ExtendedWsMock = void 0;
const vitest_1 = require("vitest");
const events_1 = require("events");
class ExtendedWsMock extends events_1.EventEmitter {
    constructor() {
        super();
        // WebSocket state constants
        this.CONNECTING = 0;
        this.OPEN = 1;
        this.CLOSING = 2;
        this.CLOSED = 3;
        // Required WebSocket properties
        this.readyState = 1;
        this.protocol = '';
        this.url = 'ws://test.com';
        this.bufferedAmount = 0;
        this.extensions = '';
        this.binaryType = 'nodebuffer';
        this.isPaused = false;
        // Event handlers
        this.onopen = null;
        this.onclose = null;
        this.onerror = null;
        this.onmessage = null;
        this.send = vitest_1.vi.fn((data) => {
            if (this.isPaused)
                return this;
            const isBinary = !(typeof data === 'string');
            const event = this.createWsEvent('message', {
                data: data,
                isBinary: isBinary
            });
            this.emit('message', event);
            this.onmessage?.apply(this, [event]);
            return this;
        });
        this.ping = vitest_1.vi.fn((data) => {
            if (!this.isPaused) {
                this.emit('ping', data);
            }
            return this;
        });
        this.pong = vitest_1.vi.fn((data) => {
            if (!this.isPaused) {
                this.emit('pong', data);
            }
            return this;
        });
        this.close = vitest_1.vi.fn((code, reason) => {
            this.readyState = this.CLOSED;
            const event = this.createWsEvent('close', {
                code,
                reason,
                wasClean: true
            });
            this.emit('close', event);
            this.onclose?.apply(this, [event]);
            return this;
        });
        this.terminate = vitest_1.vi.fn(() => {
            this.readyState = this.CLOSED;
            const event = this.createWsEvent('close', {
                code: 1006,
                reason: 'Connection terminated',
                wasClean: false
            });
            this.emit('close', event);
            this.onclose?.apply(this, [event]);
            return this;
        });
        this.bindMethods();
    }
    bindMethods() {
        // Bind all methods that need 'this' context
        this.send = this.send.bind(this);
        this.ping = this.ping.bind(this);
        this.pong = this.pong.bind(this);
        this.close = this.close.bind(this);
        this.terminate = this.terminate.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
    }
    createWsEvent(type, data) {
        return {
            type,
            target: this,
            currentTarget: this,
            ...data
        };
    }
    addEventListener(type, listener) {
        const boundListener = ((event) => {
            listener.apply(this, [event]);
        });
        this.on(type, boundListener);
    }
    removeEventListener(type, listener) {
        this.removeListener(type, listener);
    }
    pause() {
        this.isPaused = true;
        return this;
    }
    resume() {
        this.isPaused = false;
        return this;
    }
    // Additional required methods
    setMaxListeners(n) {
        super.setMaxListeners(n);
        return this;
    }
}
exports.ExtendedWsMock = ExtendedWsMock;
// Create mock event classes for Node.js environment
class MockEvent {
    constructor(type, target) {
        this.type = type;
        this.target = target || exports.mockWebSocket;
        this.currentTarget = this.target;
    }
}
class MockMessageEvent extends MockEvent {
    constructor(type, init) {
        super(type, init?.target);
        this.data = init?.data ?? '';
        this.isBinary = init?.isBinary ?? false;
    }
}
class MockCloseEvent extends MockEvent {
    constructor(type, init) {
        super(type, init?.target);
        this.code = init?.code ?? 1000;
        this.reason = init?.reason ?? '';
        this.wasClean = init?.wasClean ?? true;
    }
}
class MockErrorEvent extends MockEvent {
    constructor(type, init) {
        super(type, init?.target);
        this.error = init?.error ?? new Error('WebSocket Error');
        this.message = init?.message ?? 'WebSocket Error';
    }
}
if (typeof Event === 'undefined') {
    global.Event = MockEvent;
}
if (typeof MessageEvent === 'undefined') {
    global.MessageEvent = MockMessageEvent;
}
if (typeof CloseEvent === 'undefined') {
    global.CloseEvent = MockCloseEvent;
}
if (typeof ErrorEvent === 'undefined') {
    global.ErrorEvent = MockErrorEvent;
}
// Export a singleton instance
exports.mockWebSocket = new ExtendedWsMock();
//# sourceMappingURL=extendedWsMock.js.map