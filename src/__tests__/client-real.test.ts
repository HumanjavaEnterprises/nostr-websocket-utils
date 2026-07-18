/**
 * Real NostrWSClient tests — drive the shipped client (not a hand-written mock)
 * by mocking the `ws` module with a controllable fake socket. Asserts the exact
 * NIP-01 frames sent to ws.send(), plus multi-relay failover.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NostrWSMessage } from '../types/messages.js';

// Shared registry of created sockets so tests can inspect them.
const { sockets } = vi.hoisted(() => ({ sockets: [] as MockSocket[] }));

class MockSocket {
  url: string;
  send = vi.fn();
  close = vi.fn();
  private listeners: Record<string, ((...a: unknown[]) => void)[]> = {};

  constructor(url: string) {
    this.url = url;
    sockets.push(this);
    // A URL containing 'fail' errors; anything else opens — on the next tick,
    // after the client has attached its listeners.
    setTimeout(() => {
      if (url.includes('fail')) {
        this.emit('error', new Error('refused'));
        this.emit('close');
      } else {
        this.emit('open');
      }
    }, 0);
  }

  on(event: string, cb: (...a: unknown[]) => void) {
    (this.listeners[event] ??= []).push(cb);
    return this;
  }

  emit(event: string, ...args: unknown[]) {
    (this.listeners[event] ?? []).forEach(cb => cb(...args));
  }
}

vi.mock('ws', () => ({ default: MockSocket, WebSocket: MockSocket }));

// Import AFTER the mock is registered.
const { NostrWSClient } = await import('../core/client.js');
const { ConnectionState } = await import('../types/messages.js');

beforeEach(() => {
  sockets.length = 0;
});

describe('NostrWSClient (real, ws mocked)', () => {
  it('connects to the relay', async () => {
    const client = new NostrWSClient(['wss://relay.example.com']);
    await client.connect();
    expect(client.getConnectionState()).toBe(ConnectionState.CONNECTED);
  });

  it('sends an exact NIP-01 REQ frame verbatim through the queue', async () => {
    const client = new NostrWSClient(['wss://relay.example.com'], { maxRetries: 3 });
    await client.connect();

    const req: NostrWSMessage = ['REQ', 'sub1', { kinds: [1] }] as NostrWSMessage;
    await client.sendMessage(req);
    await new Promise(r => setTimeout(r, 0));

    const ws = sockets[sockets.length - 1];
    expect(ws.send).toHaveBeenCalledWith('["REQ","sub1",{"kinds":[1]}]');
  });

  it('fails over to a healthy relay when the first is down', async () => {
    const client = new NostrWSClient(['wss://fail.example.com', 'wss://ok.example.com']);
    await client.connect();

    expect(client.getConnectionState()).toBe(ConnectionState.CONNECTED);
    // Two sockets were created: the failed one and the healthy one.
    expect(sockets.map(s => s.url)).toEqual([
      'wss://fail.example.com',
      'wss://ok.example.com'
    ]);
  });

  it('rejects connect when every relay is down', async () => {
    const client = new NostrWSClient(['wss://fail-a.example.com', 'wss://fail-b.example.com']);
    await expect(client.connect()).rejects.toThrow();
  });
});
