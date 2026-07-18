/**
 * MessageQueue regression test.
 * Locks down the fix: the queue must send the ORIGINAL wire tuple verbatim.
 * Previously it destructured [type, ...data] and rebuilt [type, data], turning
 * a valid ["REQ","sub1",{...}] into ["REQ",["sub1",{...}]].
 */
import { describe, it, expect } from 'vitest';
import { MessageQueue } from '../core/queue.js';
import type { NostrWSMessage } from '../types/messages.js';

async function flush() {
  // let the queue's async processing loop run
  await new Promise(resolve => setTimeout(resolve, 0));
}

describe('MessageQueue preserves wire tuples verbatim', () => {
  it('sends a 3-element REQ unchanged', async () => {
    const sent: NostrWSMessage[] = [];
    const queue = new MessageQueue(async m => {
      sent.push(m);
    });

    const req: NostrWSMessage = ['REQ', 'sub1', { kinds: [1] }] as NostrWSMessage;
    await queue.enqueue(req);
    await flush();

    expect(sent).toHaveLength(1);
    expect(sent[0]).toEqual(['REQ', 'sub1', { kinds: [1] }]);
    expect(JSON.stringify(sent[0])).toBe('["REQ","sub1",{"kinds":[1]}]');
  });

  it('sends a multi-filter REQ unchanged', async () => {
    const sent: NostrWSMessage[] = [];
    const queue = new MessageQueue(async m => {
      sent.push(m);
    });

    const req: NostrWSMessage = ['REQ', 's', { kinds: [1] }, { authors: ['ab'] }] as NostrWSMessage;
    await queue.enqueue(req);
    await flush();

    expect(JSON.stringify(sent[0])).toBe('["REQ","s",{"kinds":[1]},{"authors":["ab"]}]');
  });

  it('sends a 2-element EVENT unchanged', async () => {
    const sent: NostrWSMessage[] = [];
    const queue = new MessageQueue(async m => {
      sent.push(m);
    });

    const evt: NostrWSMessage = ['EVENT', { id: 'x', kind: 1 }] as unknown as NostrWSMessage;
    await queue.enqueue(evt);
    await flush();

    expect(sent[0]).toEqual(['EVENT', { id: 'x', kind: 1 }]);
  });
});
