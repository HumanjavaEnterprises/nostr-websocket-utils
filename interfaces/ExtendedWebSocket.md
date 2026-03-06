[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ExtendedWebSocket

# Interface: ExtendedWebSocket

Defined in: [types/index.ts:24](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L24)

Extended WebSocket interface with client ID

## Extends

- `WebSocket`

## Properties

### clientId?

> `optional` **clientId**: `string`

Defined in: [types/index.ts:25](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L25)

***

### isAlive?

> `optional` **isAlive**: `boolean`

Defined in: [types/index.ts:26](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L26)

***

### subscriptions?

> `optional` **subscriptions**: `Set`\<`string`\>

Defined in: [types/index.ts:27](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L27)

***

### lastPing?

> `optional` **lastPing**: `number`

Defined in: [types/index.ts:28](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L28)

***

### reconnectAttempts?

> `optional` **reconnectAttempts**: `number`

Defined in: [types/index.ts:29](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L29)

***

### messageQueue?

> `optional` **messageQueue**: [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)[]

Defined in: [types/index.ts:30](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L30)
