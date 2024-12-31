[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSClientEvents

# Interface: NostrWSClientEvents

Events emitted by the NostrWSClient

## Properties

### connect()

> **connect**: () => `void`

Emitted when the client connects to the relay

#### Returns

`void`

#### Defined in

[types/index.ts:106](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L106)

***

### disconnect()

> **disconnect**: () => `void`

Emitted when the client disconnects from the relay

#### Returns

`void`

#### Defined in

[types/index.ts:111](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L111)

***

### reconnect()

> **reconnect**: () => `void`

Emitted when the client reconnects to the relay

#### Returns

`void`

#### Defined in

[types/index.ts:116](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L116)

***

### message()

> **message**: (`message`) => `Promise`\<`void`\>

Emitted when a message is received from the relay

#### Parameters

##### message

[`NostrWSMessage`](NostrWSMessage.md)

The received message

#### Returns

`Promise`\<`void`\>

#### Defined in

[types/index.ts:122](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L122)

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

[types/index.ts:128](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L128)

***

### close()

> **close**: () => `void`

#### Returns

`void`

#### Defined in

[types/index.ts:129](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L129)

***

### stateChange()?

> `optional` **stateChange**: (`state`) => `void`

#### Parameters

##### state

[`ConnectionState`](../enumerations/ConnectionState.md)

#### Returns

`void`

#### Defined in

[types/index.ts:130](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L130)

***

### heartbeat()?

> `optional` **heartbeat**: () => `void`

#### Returns

`void`

#### Defined in

[types/index.ts:131](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L131)
