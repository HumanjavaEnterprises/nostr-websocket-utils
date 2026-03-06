[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / QueueItem

# Interface: QueueItem

Defined in: [types/messages.ts:48](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L48)

Queue item interface for message queue

## Extends

- `NostrWSMessageBase`

## Properties

### type

> **type**: `"EVENT"` \| `"REQ"` \| `"CLOSE"` \| `"NOTICE"` \| `"EOSE"` \| `"OK"` \| `"AUTH"` \| `"COUNT"` \| `"PING"` \| `"PONG"` \| `"ERROR"`

Defined in: [types/messages.ts:32](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L32)

#### Inherited from

`NostrWSMessageBase.type`

***

### data?

> `optional` **data**: `unknown`

Defined in: [types/messages.ts:33](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L33)

#### Inherited from

`NostrWSMessageBase.data`

***

### priority

> **priority**: [`MessagePriority`](../enumerations/MessagePriority.md)

Defined in: [types/messages.ts:49](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L49)

#### Overrides

`NostrWSMessageBase.priority`

***

### queuedAt

> **queuedAt**: `number`

Defined in: [types/messages.ts:50](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L50)

#### Overrides

`NostrWSMessageBase.queuedAt`

***

### retryCount

> **retryCount**: `number`

Defined in: [types/messages.ts:51](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L51)

#### Overrides

`NostrWSMessageBase.retryCount`
