[**nostr-websocket-utils v0.2.4**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrSocket

# Interface: NostrSocket

Extended WebSocket interface with additional properties
 ExtendedWebSocket

## Extends

- [`ExtendedWebSocket`](ExtendedWebSocket.md)

## Properties

### isAlive?

> `optional` **isAlive**: `boolean`

Whether the WebSocket connection is alive

#### Inherited from

[`ExtendedWebSocket`](ExtendedWebSocket.md).[`isAlive`](ExtendedWebSocket.md#isalive)

#### Defined in

[types/index.ts:180](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L180)

***

### clientId?

> `optional` **clientId**: `string`

Unique client identifier

#### Inherited from

[`ExtendedWebSocket`](ExtendedWebSocket.md).[`clientId`](ExtendedWebSocket.md#clientid)

#### Defined in

[types/index.ts:190](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L190)

***

### messageQueue?

> `optional` **messageQueue**: [`NostrWSMessage`](NostrWSMessage.md)[]

Queue of messages to be sent

#### Inherited from

[`ExtendedWebSocket`](ExtendedWebSocket.md).[`messageQueue`](ExtendedWebSocket.md#messagequeue)

#### Defined in

[types/index.ts:195](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L195)

***

### lastPing?

> `optional` **lastPing**: `number`

Timestamp of the last ping message

#### Inherited from

[`ExtendedWebSocket`](ExtendedWebSocket.md).[`lastPing`](ExtendedWebSocket.md#lastping)

#### Defined in

[types/index.ts:200](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L200)

***

### reconnectAttempts?

> `optional` **reconnectAttempts**: `number`

Number of reconnect attempts

#### Inherited from

[`ExtendedWebSocket`](ExtendedWebSocket.md).[`reconnectAttempts`](ExtendedWebSocket.md#reconnectattempts)

#### Defined in

[types/index.ts:205](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L205)

***

### subscriptions?

> `optional` **subscriptions**: `Set`\<`string`\>

Set of subscription channels

#### Overrides

[`ExtendedWebSocket`](ExtendedWebSocket.md).[`subscriptions`](ExtendedWebSocket.md#subscriptions)

#### Defined in

[types/nostr.ts:25](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L25)

***

### authenticated?

> `optional` **authenticated**: `boolean`

#### Defined in

[types/nostr.ts:26](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L26)

***

### pubkey?

> `optional` **pubkey**: `string`

#### Defined in

[types/nostr.ts:27](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L27)
