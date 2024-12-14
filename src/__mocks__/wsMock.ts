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
  eventListeners: { [type: string]: ((data: Buffer) => void)[] } = {};

  constructor(url: string | URL, _protocols?: string | string[]) {
    this.url = typeof url === 'string' ? url : url.toString();
    this.readyState = MockWebSocket.CONNECTING;
  }

  send(_data: unknown): void {
    // Implementation not needed for these tests
  }

  close(): void {
    this.readyState = MockWebSocket.CLOSING;
    this.simulateClose();
  }

  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    const event = new MockEvent('open');
    if (this.onopen) this.onopen(event);
  }

  simulateMessage(data: unknown): void {
    const messageData = Buffer.from(JSON.stringify(data));
    const listeners = this.eventListeners['message'] || [];
    listeners.forEach(listener => listener(messageData));
  }

  simulateClose(): void {
    this.readyState = MockWebSocket.CLOSED;
    const event = new MockCloseEvent('close');
    if (this.onclose) this.onclose(event);
  }

  addEventListener(type: string, listener: (data: Buffer) => void): void {
    if (!this.eventListeners[type]) {
      this.eventListeners[type] = [];
    }
    this.eventListeners[type].push(listener);
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

// Set up the global WebSocket with proper typing
(global as { WebSocket: typeof WebSocket }).WebSocket = MockWebSocket as unknown as typeof WebSocket;

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
export default mockWebSocket;
