[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSServerEvents

# Interface: NostrWSServerEvents

Events emitted by the NostrWSServer

## Properties

### connection()

> **connection**: (`client`) => `void`

Emitted when a client connects

#### Parameters

##### client

[`ExtendedWebSocket`](ExtendedWebSocket.md)

The connected client

#### Returns

`void`

#### Defined in

[types/index.ts:142](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L142)

***

### message()

> **message**: (`message`, `client`) => `void`

Emitted when a message is received from a client

#### Parameters

##### message

[`NostrWSMessage`](NostrWSMessage.md)

The received message

##### client

[`ExtendedWebSocket`](ExtendedWebSocket.md)

The client that sent the message

#### Returns

`void`

#### Defined in

[types/index.ts:149](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L149)

***

### error()

> **error**: (`error`) => `void`

Emitted when an error occurs

#### Parameters

##### error

`Error`

The error that occurred

#### Returns

`void`

#### Defined in

[types/index.ts:155](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L155)
