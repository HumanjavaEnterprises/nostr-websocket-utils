[**nostr-websocket-utils v0.2.5**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSClientEvents

# Interface: NostrWSClientEvents

Events emitted by the NostrWSClient
 NostrWSClientEvents

## Properties

### connect()

> **connect**: () => `void`

Emitted when the client connects to the relay

#### Returns

`void`

#### Defined in

[types/index.ts:122](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L122)

***

### disconnect()

> **disconnect**: () => `void`

Emitted when the client disconnects from the relay

#### Returns

`void`

#### Defined in

[types/index.ts:127](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L127)

***

### reconnect()

> **reconnect**: () => `void`

Emitted when the client reconnects to the relay

#### Returns

`void`

#### Defined in

[types/index.ts:132](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L132)

***

### message()

> **message**: (`message`) => `void`

Emitted when a message is received from the relay

#### Parameters

##### message

[`NostrWSMessage`](NostrWSMessage.md)

The received message

#### Returns

`void`

#### Defined in

[types/index.ts:138](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L138)

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

[types/index.ts:144](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L144)
