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
  on(event: string, listener: (...args: unknown[]) => void) {
    return this;
  },
  send: jest.fn(),
  close: jest.fn(),
  ping: jest.fn(),
  pong: jest.fn(),
  terminate: jest.fn(),
  removeAllListeners: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  emit: jest.fn(),
  addListener: jest.fn(),
  once: jest.fn(),
  prependListener: jest.fn(),
  prependOnceListener: jest.fn(),
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
