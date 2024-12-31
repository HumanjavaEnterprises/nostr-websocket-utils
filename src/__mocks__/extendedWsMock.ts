import { vi } from 'vitest';
import { EventEmitter } from 'events';

// WebSocket event interfaces
interface WebSocketEventBase {
  type: string;
  target: WebSocket;
  currentTarget: WebSocket;
}

interface WebSocketMessageEvent extends WebSocketEventBase {
  data: string | Buffer;
  isBinary: boolean;
}

interface WebSocketCloseEvent extends WebSocketEventBase {
  code: number;
  reason: string;
  wasClean: boolean;
}

interface WebSocketErrorEvent extends WebSocketEventBase {
  error: Error;
  message: string;
}

export class ExtendedWsMock extends EventEmitter {
  // WebSocket state constants
  public readonly CONNECTING = 0 as const;
  public readonly OPEN = 1 as const;
  public readonly CLOSING = 2 as const;
  public readonly CLOSED = 3 as const;

  // Required WebSocket properties
  public readyState: 0 | 1 | 2 | 3 = 1;
  public protocol = '';
  public url = 'ws://test.com';
  public bufferedAmount = 0;
  public extensions = '';
  public binaryType: 'nodebuffer' | 'arraybuffer' | 'fragments' = 'nodebuffer';
  public isPaused = false;

  // Event handlers
  onopen: ((event: WebSocketEventBase) => void) | null = null;
  onclose: ((event: WebSocketCloseEvent) => void) | null = null;
  onerror: ((event: WebSocketErrorEvent) => void) | null = null;
  onmessage: ((event: WebSocketMessageEvent) => void) | null = null;

  constructor() {
    super();
    this.bindMethods();
  }

  private bindMethods(): void {
    // Bind all methods that need 'this' context
    this.send = this.send.bind(this);
    this.ping = this.ping.bind(this);
    this.pong = this.pong.bind(this);
    this.close = this.close.bind(this);
    this.terminate = this.terminate.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
  }

  private createWsEvent<T extends WebSocketEventBase>(type: string, data: Partial<T>): T {
    return {
      type,
      target: this as unknown as WebSocket,
      currentTarget: this as unknown as WebSocket,
      ...data
    } as T;
  }

  addEventListener(type: string, listener: (event: WebSocketEventBase) => void): void {
    const boundListener = ((event: WebSocketEventBase) => {
      listener.apply(this, [event]);
    });
    this.on(type, boundListener);
  }

  removeEventListener(type: string, listener: (event: WebSocketEventBase) => void): void {
    this.removeListener(type, listener);
  }

  public send = vi.fn((data: string | Buffer): this => {
    if (this.isPaused) return this;
    
    const isBinary = !(typeof data === 'string');
    const event = this.createWsEvent<WebSocketMessageEvent>('message', {
      data: data,
      isBinary: isBinary
    });
    
    this.emit('message', event);
    this.onmessage?.apply(this, [event]);
    
    return this;
  });

  public ping = vi.fn((data?: Buffer | Uint8Array): this => {
    if (!this.isPaused) {
      this.emit('ping', data);
    }
    return this;
  });

  public pong = vi.fn((data?: Buffer | Uint8Array): this => {
    if (!this.isPaused) {
      this.emit('pong', data);
    }
    return this;
  });

  public close = vi.fn((code?: number, reason?: string): this => {
    this.readyState = this.CLOSED;
    const event = this.createWsEvent<WebSocketCloseEvent>('close', {
      code,
      reason,
      wasClean: true
    });
    
    this.emit('close', event);
    this.onclose?.apply(this, [event]);
    
    return this;
  });

  public terminate = vi.fn((): this => {
    this.readyState = this.CLOSED;
    const event = this.createWsEvent<WebSocketCloseEvent>('close', {
      code: 1006,
      reason: 'Connection terminated',
      wasClean: false
    });
    
    this.emit('close', event);
    this.onclose?.apply(this, [event]);
    
    return this;
  });

  public pause(): this {
    this.isPaused = true;
    return this;
  }

  public resume(): this {
    this.isPaused = false;
    return this;
  }

  // Additional required methods
  setMaxListeners(n: number): this {
    super.setMaxListeners(n);
    return this;
  }
}

// Create mock event classes for Node.js environment
class MockEvent implements WebSocketEventBase {
  readonly type: string;
  readonly target: WebSocket;
  readonly currentTarget: WebSocket;

  constructor(type: string, target?: WebSocket) {
    this.type = type;
    this.target = target || (mockWebSocket as unknown as WebSocket);
    this.currentTarget = this.target;
  }
}

class MockMessageEvent extends MockEvent implements WebSocketMessageEvent {
  readonly data: string | Buffer;
  readonly isBinary: boolean;

  constructor(type: string, init?: { data?: string | Buffer; isBinary?: boolean; target?: WebSocket }) {
    super(type, init?.target);
    this.data = init?.data ?? '';
    this.isBinary = init?.isBinary ?? false;
  }
}

class MockCloseEvent extends MockEvent implements WebSocketCloseEvent {
  readonly code: number;
  readonly reason: string;
  readonly wasClean: boolean;

  constructor(type: string, init?: { code?: number; reason?: string; wasClean?: boolean; target?: WebSocket }) {
    super(type, init?.target);
    this.code = init?.code ?? 1000;
    this.reason = init?.reason ?? '';
    this.wasClean = init?.wasClean ?? true;
  }
}

class MockErrorEvent extends MockEvent implements WebSocketErrorEvent {
  readonly error: Error;
  readonly message: string;

  constructor(type: string, init?: { error?: Error; message?: string; target?: WebSocket }) {
    super(type, init?.target);
    this.error = init?.error ?? new Error('WebSocket Error');
    this.message = init?.message ?? 'WebSocket Error';
  }
}

if (typeof Event === 'undefined') {
  (global as any).Event = MockEvent;
}
if (typeof MessageEvent === 'undefined') {
  (global as any).MessageEvent = MockMessageEvent;
}
if (typeof CloseEvent === 'undefined') {
  (global as any).CloseEvent = MockCloseEvent;
}
if (typeof ErrorEvent === 'undefined') {
  (global as any).ErrorEvent = MockErrorEvent;
}

// Export a singleton instance
export const mockWebSocket = new ExtendedWsMock();
