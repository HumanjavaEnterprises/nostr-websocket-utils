[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / QueueItem

# Interface: QueueItem

Defined in: [types/messages.ts:49](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L49)

Queue item interface for message queue

## Extends

- `NostrWSMessageBase`

## Properties

### type

> **type**: `"EVENT"` \| `"REQ"` \| `"CLOSE"` \| `"CLOSED"` \| `"NOTICE"` \| `"EOSE"` \| `"OK"` \| `"AUTH"` \| `"COUNT"` \| `"PING"` \| `"PONG"` \| `"ERROR"`

Defined in: [types/messages.ts:33](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L33)

#### Inherited from

`NostrWSMessageBase.type`

***

### data?

> `optional` **data?**: `unknown`

Defined in: [types/messages.ts:34](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L34)

#### Inherited from

`NostrWSMessageBase.data`

***

### message

> **message**: [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [types/messages.ts:55](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L55)

The original, verbatim wire tuple. This is what gets sent — the queue must
never destructure/rebuild the message, or valid >2-element NIP-01 tuples
(e.g. ["REQ", subId, filter]) are corrupted.

***

### priority

> **priority**: [`MessagePriority`](../enumerations/MessagePriority.md)

Defined in: [types/messages.ts:56](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L56)

#### Overrides

`NostrWSMessageBase.priority`

***

### queuedAt

> **queuedAt**: `number`

Defined in: [types/messages.ts:57](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L57)

#### Overrides

`NostrWSMessageBase.queuedAt`

***

### retryCount

> **retryCount**: `number`

Defined in: [types/messages.ts:58](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L58)

#### Overrides

`NostrWSMessageBase.retryCount`
