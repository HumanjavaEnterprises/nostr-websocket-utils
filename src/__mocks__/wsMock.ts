class MockWebSocket {
  static OPEN = 1;
  static CLOSED = 3;
  static CONNECTING = 0;
  static CLOSING = 2;

  url: string;
  readyState: number;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
  }

  send(_data: unknown) {
    // Implementation not needed for these tests
  }

  close() {
    this.readyState = MockWebSocket.CLOSING;
    this.simulateClose();
  }

  simulateOpen() {
    this.readyState = MockWebSocket.OPEN;
    const event = new MockEvent('open');
    if (this.onopen) this.onopen(event);
  }

  simulateMessage(data: unknown) {
    const event = new MockMessageEvent(data);
    if (this.onmessage) this.onmessage(event);
  }

  simulateClose() {
    this.readyState = MockWebSocket.CLOSED;
    const event = new MockCloseEvent('close');
    if (this.onclose) this.onclose(event);
  }

  dispatchEvent(event: Event | CloseEvent | MessageEvent): boolean {
    if (event.type === 'close' && this.onclose) {
      this.onclose(event as CloseEvent);
    } else if (event.type === 'open' && this.onopen) {
      this.onopen(event);
    } else if (event.type === 'message' && this.onmessage) {
      this.onmessage(event as MessageEvent);
    }
    return true;
  }
}

// Mock the global WebSocket
(global as any).WebSocket = MockWebSocket;

class MockEvent implements Event {
  readonly NONE = 0 as const;
  readonly CAPTURING_PHASE = 1 as const;
  readonly AT_TARGET = 2 as const;
  readonly BUBBLING_PHASE = 3 as const;
  readonly type: string;
  readonly target: EventTarget | null = null;
  readonly currentTarget: EventTarget | null = null;
  readonly eventPhase: number = 0;
  readonly bubbles: boolean = false;
  readonly cancelable: boolean = false;
  readonly defaultPrevented: boolean = false;
  readonly composed: boolean = false;
  readonly timeStamp: number = Date.now();
  readonly srcElement: EventTarget | null = null;
  readonly returnValue: boolean = true;
  readonly cancelBubble: boolean = false;
  readonly isTrusted: boolean = true;

  constructor(type: string) {
    this.type = type;
  }

  preventDefault(): void {}
  stopPropagation(): void {}
  stopImmediatePropagation(): void {}
  composedPath(): EventTarget[] { return []; }
  initEvent(_type: string, _bubbles?: boolean, _cancelable?: boolean): void {}
}

class MockCloseEvent extends MockEvent implements CloseEvent {
  readonly code: number = 1000;
  readonly reason: string = '';
  readonly wasClean: boolean = true;

  constructor(type: string) {
    super(type);
  }
}

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

// Export an instance of MockWebSocket
const mockWebSocket = new MockWebSocket('ws://test.com');
export default mockWebSocket;
