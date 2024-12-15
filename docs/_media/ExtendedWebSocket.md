[**nostr-websocket-utils v0.2.5**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ExtendedWebSocket

# Interface: ExtendedWebSocket

Extended WebSocket interface with additional properties
 ExtendedWebSocket

## Extends

- `WebSocket`

## Extended by

- [`NostrSocket`](NostrSocket.md)

## Properties

### isAlive?

> `optional` **isAlive**: `boolean`

Whether the WebSocket connection is alive

#### Defined in

[types/index.ts:180](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L180)

***

### subscriptions?

> `optional` **subscriptions**: `Set`\<`string`\>

Set of subscription channels

#### Defined in

[types/index.ts:185](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L185)

***

### clientId?

> `optional` **clientId**: `string`

Unique client identifier

#### Defined in

[types/index.ts:190](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L190)

***

### messageQueue?

> `optional` **messageQueue**: [`NostrWSMessage`](NostrWSMessage.md)[]

Queue of messages to be sent

#### Defined in

[types/index.ts:195](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L195)

***

### lastPing?

> `optional` **lastPing**: `number`

Timestamp of the last ping message

#### Defined in

[types/index.ts:200](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L200)

***

### reconnectAttempts?

> `optional` **reconnectAttempts**: `number`

Number of reconnect attempts

#### Defined in

[types/index.ts:205](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L205)
