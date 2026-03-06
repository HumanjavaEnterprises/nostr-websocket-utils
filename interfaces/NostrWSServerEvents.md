[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSServerEvents

# Interface: NostrWSServerEvents

Defined in: [types/index.ts:145](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L145)

Events emitted by the NostrWSServer

## Properties

### connection()

> **connection**: (`client`) => `void`

Defined in: [types/index.ts:150](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L150)

Emitted when a client connects

#### Parameters

##### client

[`ExtendedWebSocket`](ExtendedWebSocket.md)

The connected client

#### Returns

`void`

***

### message()

> **message**: (`message`, `client`) => `void`

Defined in: [types/index.ts:157](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L157)

Emitted when a message is received from a client

#### Parameters

##### message

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

The received message

##### client

[`ExtendedWebSocket`](ExtendedWebSocket.md)

The client that sent the message

#### Returns

`void`

***

### error()

> **error**: (`error`) => `void`

Defined in: [types/index.ts:163](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L163)

Emitted when an error occurs

#### Parameters

##### error

`Error`

The error that occurred

#### Returns

`void`
