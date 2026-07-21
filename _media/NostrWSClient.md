[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSClient

# Class: NostrWSClient

Defined in: [core/client.ts:14](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L14)

NostrWSClient handles WebSocket connections to Nostr relays

## Constructors

### Constructor

> **new NostrWSClient**(`relayUrls`, `options?`): `NostrWSClient`

Defined in: [core/client.ts:22](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L22)

#### Parameters

##### relayUrls

`string`[]

##### options?

`NostrWSClientOptions` = `{}`

#### Returns

`NostrWSClient`

## Properties

### ws

> `private` **ws**: `WebSocket` \| `null` = `null`

Defined in: [core/client.ts:15](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L15)

***

### queue

> `private` `readonly` **queue**: `MessageQueue`

Defined in: [core/client.ts:16](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L16)

***

### logger

> `private` `readonly` **logger**: `Logger`

Defined in: [core/client.ts:17](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L17)

***

### connectionState

> `private` **connectionState**: [`ConnectionState`](../enumerations/ConnectionState.md) = `ConnectionState.DISCONNECTED`

Defined in: [core/client.ts:18](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L18)

***

### reconnectAttempts

> `private` **reconnectAttempts**: `number` = `0`

Defined in: [core/client.ts:19](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L19)

***

### reconnectTimeout

> `private` **reconnectTimeout**: `Timeout` \| `null` = `null`

Defined in: [core/client.ts:20](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L20)

***

### relayUrls

> `private` `readonly` **relayUrls**: `string`[]

Defined in: [core/client.ts:23](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L23)

***

### options

> `private` `readonly` **options**: `NostrWSClientOptions` = `{}`

Defined in: [core/client.ts:24](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L24)

## Methods

### connect()

> **connect**(): `Promise`\<`void`\>

Defined in: [core/client.ts:51](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L51)

Connect to the relay

#### Returns

`Promise`\<`void`\>

***

### connectTo()

> `private` **connectTo**(`url`): `Promise`\<`void`\>

Defined in: [core/client.ts:89](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L89)

Attempt a connection to a single relay URL.

#### Parameters

##### url

`string`

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: [core/client.ts:132](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L132)

Disconnect from the relay

#### Returns

`Promise`\<`void`\>

***

### sendMessage()

> **sendMessage**(`message`): `Promise`\<`void`\>

Defined in: [core/client.ts:156](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L156)

Send a message to the relay

#### Parameters

##### message

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

#### Returns

`Promise`\<`void`\>

***

### handleMessage()

> `private` **handleMessage**(`data`): `void`

Defined in: [core/client.ts:171](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L171)

#### Parameters

##### data

`Data`

#### Returns

`void`

***

### handleDisconnect()

> `private` **handleDisconnect**(): `void`

Defined in: [core/client.ts:187](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L187)

#### Returns

`void`

***

### getConnectionState()

> **getConnectionState**(): [`ConnectionState`](../enumerations/ConnectionState.md)

Defined in: [core/client.ts:223](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L223)

Get the current connection state

#### Returns

[`ConnectionState`](../enumerations/ConnectionState.md)
