import WebSocket from 'ws';

const extendedMockWebSocket = {
  binaryType: 'nodebuffer',
  bufferedAmount: 0,
  extensions: '',
  protocol: '',
  readyState: WebSocket.OPEN as number,
  url: 'ws://test.com',
  isPaused: false,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  on(_event: string, _listener: (...args: unknown[]) => void) {
    return this;
  },
  send: jest.fn(),
  close: jest.fn(),
  ping: jest.fn(),
  pong: jest.fn(),
  terminate: jest.fn(),
  removeAllListeners: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn((_event: string, _listener: (..._args: unknown[]) => void) => {}),
  removeEventListener: jest.fn((_event: string, _listener: (..._args: unknown[]) => void) => {}),
  emit: jest.fn((_event: string, ..._args: unknown[]) => {}),
  addListener: jest.fn((_event: string, _listener: (..._args: unknown[]) => void) => {}),
  once: jest.fn((_event: string, _listener: (..._args: unknown[]) => void) => {}),
  prependListener: jest.fn((_event: string, _listener: (..._args: unknown[]) => void) => {}),
  prependOnceListener: jest.fn((_event: string, _listener: (..._args: unknown[]) => void) => {}),
  eventNames: jest.fn(),
  listenerCount: jest.fn(),
  // Additional methods for extended behavior
  simulateOpen() {
    this.readyState = WebSocket.OPEN;
    this.emit('open');
  },
  simulateClose() {
    this.readyState = WebSocket.CLOSED;
    this.emit('close');
  },
};

export default extendedMockWebSocket;
