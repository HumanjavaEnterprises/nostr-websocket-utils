"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockWebSocket {
    constructor(url, _protocols) {
        this.onopen = null;
        this.onclose = null;
        this.onmessage = null;
        this.eventListeners = {};
        this.url = typeof url === 'string' ? url : url.toString();
        this.readyState = MockWebSocket.CONNECTING;
    }
    send(_data) {
        // Implementation not needed for these tests
    }
    close() {
        this.readyState = MockWebSocket.CLOSING;
        this.simulateClose();
    }
    simulateOpen() {
        this.readyState = MockWebSocket.OPEN;
        const event = new MockEvent('open');
        if (this.onopen)
            this.onopen(event);
    }
    simulateMessage(data) {
        const messageData = Buffer.from(JSON.stringify(data));
        const listeners = this.eventListeners['message'] || [];
        listeners.forEach(listener => listener(messageData));
    }
    simulateClose() {
        this.readyState = MockWebSocket.CLOSED;
        const event = new MockCloseEvent('close');
        if (this.onclose)
            this.onclose(event);
    }
    addEventListener(type, listener) {
        if (!this.eventListeners[type]) {
            this.eventListeners[type] = [];
        }
        this.eventListeners[type].push(listener);
    }
    dispatchEvent(event) {
        if (event.type === 'close' && this.onclose) {
            this.onclose(event);
        }
        else if (event.type === 'open' && this.onopen) {
            this.onopen(event);
        }
        else if (event.type === 'message' && this.onmessage) {
            this.onmessage(event);
        }
        return true;
    }
}
MockWebSocket.OPEN = 1;
MockWebSocket.CLOSED = 3;
MockWebSocket.CONNECTING = 0;
MockWebSocket.CLOSING = 2;
// Set up the global WebSocket with proper typing
global.WebSocket = MockWebSocket;
class MockEvent {
    constructor(type) {
        this.NONE = 0;
        this.CAPTURING_PHASE = 1;
        this.AT_TARGET = 2;
        this.BUBBLING_PHASE = 3;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = 0;
        this.bubbles = false;
        this.cancelable = false;
        this.defaultPrevented = false;
        this.composed = false;
        this.timeStamp = Date.now();
        this.srcElement = null;
        this.returnValue = true;
        this.cancelBubble = false;
        this.isTrusted = true;
        this.type = type;
    }
    preventDefault() { }
    stopPropagation() { }
    stopImmediatePropagation() { }
    composedPath() { return []; }
    initEvent(_type, _bubbles, _cancelable) { }
}
class MockCloseEvent extends MockEvent {
    constructor(type) {
        super(type);
        this.code = 1000;
        this.reason = '';
        this.wasClean = true;
    }
}
/*
class MockMessageEvent extends MockEvent implements MessageEvent {
  readonly data: unknown;
  readonly origin: string = '';
  readonly lastEventId: string = '';
  readonly source: Window | MessagePort | ServiceWorker | null = null;
  readonly ports: ReadonlyArray<MessagePort> = [];

  constructor(data: unknown) {
    super('message');
    this.data = data;
  }

  initMessageEvent(
    _type: string,
    _bubbles?: boolean,
    _cancelable?: boolean,
    _data: unknown = null,
    _origin: string = '',
    _lastEventId: string = '',
    _source: Window | MessagePort | ServiceWorker | null = null,
    _ports: MessagePort[] = []
  ): void {}
}
*/
// Export an instance of MockWebSocket
const mockWebSocket = new MockWebSocket('ws://test.com');
exports.default = mockWebSocket;
//# sourceMappingURL=wsMock.js.map