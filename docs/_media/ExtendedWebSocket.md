[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ExtendedWebSocket

# Interface: ExtendedWebSocket

Extended WebSocket interface with client ID

## Extends

- `WebSocket`

## Properties

### clientId?

> `optional` **clientId**: `string`

#### Defined in

[types/index.ts:21](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L21)

***

### isAlive?

> `optional` **isAlive**: `boolean`

#### Defined in

[types/index.ts:22](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L22)

***

### subscriptions?

> `optional` **subscriptions**: `Set`\<`string`\>

#### Defined in

[types/index.ts:23](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L23)

***

### lastPing?

> `optional` **lastPing**: `number`

#### Defined in

[types/index.ts:24](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L24)

***

### reconnectAttempts?

> `optional` **reconnectAttempts**: `number`

#### Defined in

[types/index.ts:25](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L25)

***

### messageQueue?

> `optional` **messageQueue**: [`NostrWSMessage`](NostrWSMessage.md)[]

#### Defined in

[types/index.ts:26](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L26)
