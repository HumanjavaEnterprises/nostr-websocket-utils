[**nostr-websocket-utils v0.2.5**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSServerOptions

# Interface: NostrWSServerOptions

## Properties

### port

> **port**: `number`

#### Defined in

[types/nostr.ts:43](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L43)

***

### heartbeatInterval?

> `optional` **heartbeatInterval**: `number`

#### Defined in

[types/nostr.ts:44](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L44)

***

### maxPayloadSize?

> `optional` **maxPayloadSize**: `number`

#### Defined in

[types/nostr.ts:45](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L45)

***

### cors?

> `optional` **cors**: `object`

#### origin

> **origin**: `string`

#### methods

> **methods**: `string`[]

#### Defined in

[types/nostr.ts:46](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L46)

***

### onConnection()?

> `optional` **onConnection**: (`socket`) => `void`

#### Parameters

##### socket

[`NostrSocket`](NostrSocket.md)

#### Returns

`void`

#### Defined in

[types/nostr.ts:50](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L50)

***

### onDisconnect()?

> `optional` **onDisconnect**: (`socket`) => `void`

#### Parameters

##### socket

[`NostrSocket`](NostrSocket.md)

#### Returns

`void`

#### Defined in

[types/nostr.ts:51](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L51)

***

### onError()?

> `optional` **onError**: (`error`, `socket`?) => `void`

#### Parameters

##### error

`Error`

##### socket?

[`NostrSocket`](NostrSocket.md)

#### Returns

`void`

#### Defined in

[types/nostr.ts:52](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L52)

***

### handlers?

> `optional` **handlers**: `object`

#### message()

> **message**: (`socket`, `message`) => `void` \| `Promise`\<`void`\>

##### Parameters

###### socket

[`NostrSocket`](NostrSocket.md)

###### message

[`NostrWSServerMessage`](../type-aliases/NostrWSServerMessage.md)

##### Returns

`void` \| `Promise`\<`void`\>

#### error()?

> `optional` **error**: (`socket`, `error`) => `void`

##### Parameters

###### socket

[`NostrSocket`](NostrSocket.md)

###### error

`Error`

##### Returns

`void`

#### close()?

> `optional` **close**: (`socket`) => `void`

##### Parameters

###### socket

[`NostrSocket`](NostrSocket.md)

##### Returns

`void`

#### Defined in

[types/nostr.ts:53](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/nostr.ts#L53)
