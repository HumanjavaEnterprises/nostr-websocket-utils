[**nostr-websocket-utils v0.2.4**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSServerEvents

# Interface: NostrWSServerEvents

Events emitted by the NostrWSServer
 NostrWSServerEvents

## Properties

### connection()

> **connection**: (`client`) => `void`

Emitted when a client connects to the server

#### Parameters

##### client

[`ExtendedWebSocket`](ExtendedWebSocket.md)

The connected client

#### Returns

`void`

#### Defined in

[types/index.ts:156](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L156)

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

[types/index.ts:163](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L163)

***

### error()

> **error**: (`error`) => `void`

Emitted when an error occurs

#### Parameters

##### error

`Error`

The error object

#### Returns

`void`

#### Defined in

[types/index.ts:169](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L169)
