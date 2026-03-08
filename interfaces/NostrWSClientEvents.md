[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSClientEvents

# Interface: NostrWSClientEvents

Defined in: [types/index.ts:110](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L110)

Events emitted by the NostrWSClient

## Properties

### connect()

> **connect**: () => `void`

Defined in: [types/index.ts:114](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L114)

Emitted when the client connects to the relay

#### Returns

`void`

***

### disconnect()

> **disconnect**: () => `void`

Defined in: [types/index.ts:119](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L119)

Emitted when the client disconnects from the relay

#### Returns

`void`

***

### reconnect()

> **reconnect**: () => `void`

Defined in: [types/index.ts:124](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L124)

Emitted when the client reconnects to the relay

#### Returns

`void`

***

### message()

> **message**: (`message`) => `Promise`\<`void`\>

Defined in: [types/index.ts:130](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L130)

Emitted when a message is received from the relay

#### Parameters

##### message

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

The received message

#### Returns

`Promise`\<`void`\>

***

### error()

> **error**: (`error`) => `void`

Defined in: [types/index.ts:136](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L136)

Emitted when an error occurs

#### Parameters

##### error

`Error`

The error that occurred

#### Returns

`void`

***

### close()

> **close**: () => `void`

Defined in: [types/index.ts:137](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L137)

#### Returns

`void`

***

### stateChange()?

> `optional` **stateChange**: (`state`) => `void`

Defined in: [types/index.ts:138](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L138)

#### Parameters

##### state

[`ConnectionState`](../enumerations/ConnectionState.md)

#### Returns

`void`

***

### heartbeat()?

> `optional` **heartbeat**: () => `void`

Defined in: [types/index.ts:139](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L139)

#### Returns

`void`
