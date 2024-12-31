[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSOptions

# Interface: NostrWSOptions

WebSocket client options

## Properties

### WebSocketImpl

> **WebSocketImpl**: *typeof* `WebSocket`

#### Defined in

[types/index.ts:73](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L73)

***

### handlers

> **handlers**: [`NostrWSClientEvents`](NostrWSClientEvents.md)

#### Defined in

[types/index.ts:74](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L74)

***

### retry?

> `optional` **retry**: `Partial`\<[`RetryConfig`](RetryConfig.md)\>

#### Defined in

[types/index.ts:75](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L75)

***

### queue?

> `optional` **queue**: `Partial`\<[`QueueConfig`](QueueConfig.md)\>

#### Defined in

[types/index.ts:76](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L76)

***

### heartbeat?

> `optional` **heartbeat**: `Partial`\<[`HeartbeatConfig`](HeartbeatConfig.md)\>

#### Defined in

[types/index.ts:77](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L77)

***

### autoReconnect?

> `optional` **autoReconnect**: `boolean`

#### Defined in

[types/index.ts:78](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L78)

***

### bufferMessages?

> `optional` **bufferMessages**: `boolean`

#### Defined in

[types/index.ts:79](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L79)

***

### cleanStaleMessages?

> `optional` **cleanStaleMessages**: `boolean`

#### Defined in

[types/index.ts:80](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L80)

***

### logger

> **logger**: [`Logger`](../type-aliases/Logger.md)

#### Defined in

[types/index.ts:81](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L81)
