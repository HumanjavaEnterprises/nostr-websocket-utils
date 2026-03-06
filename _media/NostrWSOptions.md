[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSOptions

# Interface: NostrWSOptions

Defined in: [types/index.ts:76](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L76)

WebSocket client options

## Properties

### WebSocketImpl?

> `optional` **WebSocketImpl**: *typeof* `WebSocket`

Defined in: [types/index.ts:77](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L77)

***

### connectionTimeout?

> `optional` **connectionTimeout**: `number`

Defined in: [types/index.ts:78](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L78)

***

### retryAttempts?

> `optional` **retryAttempts**: `number`

Defined in: [types/index.ts:79](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L79)

***

### retryDelay?

> `optional` **retryDelay**: `number`

Defined in: [types/index.ts:80](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L80)

***

### onMessage()?

> `optional` **onMessage**: (`message`) => `void`

Defined in: [types/index.ts:81](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L81)

#### Parameters

##### message

`string`

#### Returns

`void`

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [types/index.ts:82](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L82)

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### retry?

> `optional` **retry**: `Partial`\<[`RetryConfig`](RetryConfig.md)\>

Defined in: [types/index.ts:83](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L83)

***

### queue?

> `optional` **queue**: `Partial`\<[`QueueConfig`](QueueConfig.md)\>

Defined in: [types/index.ts:84](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L84)

***

### heartbeat?

> `optional` **heartbeat**: `Partial`\<[`HeartbeatConfig`](HeartbeatConfig.md)\>

Defined in: [types/index.ts:85](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L85)

***

### autoReconnect?

> `optional` **autoReconnect**: `boolean`

Defined in: [types/index.ts:86](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L86)

***

### bufferMessages?

> `optional` **bufferMessages**: `boolean`

Defined in: [types/index.ts:87](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L87)

***

### cleanStaleMessages?

> `optional` **cleanStaleMessages**: `boolean`

Defined in: [types/index.ts:88](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L88)

***

### logger?

> `optional` **logger**: [`Logger`](../type-aliases/Logger.md)

Defined in: [types/index.ts:89](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L89)
