import { vi } from 'vitest';
import { EventEmitter } from 'events';

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
  onopen: ((event: any) => void) | null = null;
  onclose: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onmessage: ((event: any) => void) | null = null;

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

  private createWsEvent(type: string, data: any): any {
    const event = {
      type,
      target: this,
      currentTarget: this,
      ...data
    };
    return event;
  }

  addEventListener(type: string, listener: (event: any) => void): void {
    const boundListener = ((event: any) => {
      listener.apply(this, [event]);
    });
    this.on(type, boundListener);
  }

  removeEventListener(type: string, listener: (event: any) => void): void {
    this.removeListener(type, listener);
  }

  public send = vi.fn((data: any): this => {
    if (this.isPaused) return this;
    
    const isBinary = !(typeof data === 'string');
    const event = this.createWsEvent('message', {
      data: data
    });
    
    this.emit('message', data, isBinary);
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
    const event = this.createWsEvent('close', {
      code,
      reason,
      wasClean: true
    });
    
    this.emit('close', code, Buffer.from(reason || ''));
    this.onclose?.apply(this, [event]);
    
    return this;
  });

  public terminate = vi.fn((): this => {
    this.readyState = this.CLOSED;
    const event = this.createWsEvent('close', {
      code: 1006,
      reason: 'Connection terminated',
      wasClean: false
    });
    
    this.emit('close', 1006, Buffer.from('Connection terminated'));
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
class MockEvent {
  readonly type: string;
  readonly target: any;
  readonly currentTarget: any;

  constructor(type: string, target?: any) {
    this.type = type;
    this.target = target || (mockWebSocket as any);
    this.currentTarget = this.target;
  }
}

class MockMessageEvent extends MockEvent {
  readonly data: any;
  readonly isBinary: boolean;

  constructor(type: string, init?: { data?: any; isBinary?: boolean; target?: any }) {
    super(type, init?.target);
    this.data = init?.data ?? '';
    this.isBinary = init?.isBinary ?? false;
  }
}

class MockCloseEvent extends MockEvent {
  readonly code: number;
  readonly reason: string;
  readonly wasClean: boolean;

  constructor(type: string, init?: { code?: number; reason?: string; wasClean?: boolean; target?: any }) {
    super(type, init?.target);
    this.code = init?.code ?? 1000;
    this.reason = init?.reason ?? '';
    this.wasClean = init?.wasClean ?? true;
  }
}

class MockErrorEvent extends MockEvent {
  readonly error: Error;
  readonly message: string;

  constructor(type: string, init?: { error?: Error; message?: string; target?: any }) {
    super(type, init?.target);
    this.error = init?.error ?? new Error('WebSocket Error');
    this.message = init?.message ?? 'WebSocket Error';
  }
}

if (typeof Event === 'undefined') {
  (global as { Event?: typeof MockEvent }).Event = MockEvent;
}
if (typeof MessageEvent === 'undefined') {
  (global as unknown as { MessageEvent: typeof MockMessageEvent }).MessageEvent = MockMessageEvent;
}
if (typeof CloseEvent === 'undefined') {
  (global as { CloseEvent?: typeof MockCloseEvent }).CloseEvent = MockCloseEvent;
}
if (typeof ErrorEvent === 'undefined') {
  (global as { ErrorEvent?: typeof MockErrorEvent }).ErrorEvent = MockErrorEvent;
}

// Export a singleton instance
export const mockWebSocket = new ExtendedWsMock();
