[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSClient

# Class: NostrWSClient

WebSocket client implementation for Nostr protocol communication
Extends EventEmitter to provide event-based message handling

## Extends

- `EventEmitter`

## Constructors

### new NostrWSClient()

> **new NostrWSClient**(`url`, `options`): [`NostrWSClient`](NostrWSClient.md)

#### Parameters

##### url

`string`

##### options

`Partial`\<[`NostrWSOptions`](../interfaces/NostrWSOptions.md)\> = `{}`

#### Returns

[`NostrWSClient`](NostrWSClient.md)

#### Overrides

`EventEmitter.constructor`

#### Defined in

[core/client.ts:62](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L62)

## Properties

### ws

> `private` **ws**: `null` \| [`ExtendedWebSocket`](../interfaces/ExtendedWebSocket.md) = `null`

#### Defined in

[core/client.ts:50](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L50)

***

### state

> `private` **state**: [`ConnectionState`](../enumerations/ConnectionState.md) = `ConnectionState.DISCONNECTED`

#### Defined in

[core/client.ts:51](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L51)

***

### messageQueue

> `private` **messageQueue**: `MessageQueue`

#### Defined in

[core/client.ts:52](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L52)

***

### reconnectTimeout

> `private` **reconnectTimeout**: `null` \| `Timeout` = `null`

#### Defined in

[core/client.ts:53](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L53)

***

### heartbeatInterval

> `private` **heartbeatInterval**: `null` \| `Timeout` = `null`

#### Defined in

[core/client.ts:54](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L54)

***

### heartbeatTimeout

> `private` **heartbeatTimeout**: `null` \| `Timeout` = `null`

#### Defined in

[core/client.ts:55](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L55)

***

### missedHeartbeats

> `private` **missedHeartbeats**: `number` = `0`

#### Defined in

[core/client.ts:56](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L56)

***

### reconnectAttempts

> `private` **reconnectAttempts**: `number` = `0`

#### Defined in

[core/client.ts:57](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L57)

***

### subscriptions

> `private` **subscriptions**: `Map`\<`string`, [`NostrWSMessage`](../interfaces/NostrWSMessage.md)\>

#### Defined in

[core/client.ts:58](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L58)

***

### clientId

> `private` `readonly` **clientId**: `string`

#### Defined in

[core/client.ts:59](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L59)

***

### options

> `private` `readonly` **options**: [`NostrWSOptions`](../interfaces/NostrWSOptions.md)

#### Defined in

[core/client.ts:60](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L60)

***

### url

> `private` `readonly` **url**: `string`

#### Defined in

[core/client.ts:62](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L62)

## Accessors

### connectionState

#### Get Signature

> **get** **connectionState**(): [`ConnectionState`](../enumerations/ConnectionState.md)

Gets the current connection state

##### Returns

[`ConnectionState`](../enumerations/ConnectionState.md)

#### Defined in

[core/client.ts:95](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L95)

## Methods

### setState()

> `private` **setState**(`newState`): `void`

Updates the connection state and notifies handlers

#### Parameters

##### newState

[`ConnectionState`](../enumerations/ConnectionState.md)

#### Returns

`void`

#### Defined in

[core/client.ts:102](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L102)

***

### connect()

> **connect**(): `Promise`\<`void`\>

Establishes a connection to the WebSocket server

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/client.ts:111](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L111)

***

### setupEventHandlers()

> `private` **setupEventHandlers**(): `void`

Sets up event handlers for the WebSocket connection

#### Returns

`void`

#### Defined in

[core/client.ts:156](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L156)

***

### startHeartbeat()

> `private` **startHeartbeat**(): `void`

Starts the heartbeat mechanism

#### Returns

`void`

#### Defined in

[core/client.ts:190](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L190)

***

### handleHeartbeatResponse()

> `private` **handleHeartbeatResponse**(): `void`

Handles heartbeat responses

#### Returns

`void`

#### Defined in

[core/client.ts:217](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L217)

***

### stopHeartbeat()

> `private` **stopHeartbeat**(): `void`

Stops the heartbeat mechanism

#### Returns

`void`

#### Defined in

[core/client.ts:229](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L229)

***

### handleConnectionError()

> `private` **handleConnectionError**(`error`): `void`

Handles connection errors

#### Parameters

##### error

`Error`

#### Returns

`void`

#### Defined in

[core/client.ts:243](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L243)

***

### handleDisconnection()

> `private` **handleDisconnection**(): `void`

Handles disconnection and cleanup

#### Returns

`void`

#### Defined in

[core/client.ts:252](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L252)

***

### reconnect()

> `private` **reconnect**(): `void`

Initiates reconnection with exponential backoff

#### Returns

`void`

#### Defined in

[core/client.ts:267](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L267)

***

### subscribe()

> **subscribe**(`channel`, `filter`?): `void`

Subscribes to a channel with optional filter

#### Parameters

##### channel

`string`

##### filter?

`unknown`

#### Returns

`void`

#### Defined in

[core/client.ts:306](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L306)

***

### resubscribeAll()

> `private` **resubscribeAll**(): `void`

Resubscribes to all active subscriptions

#### Returns

`void`

#### Defined in

[core/client.ts:320](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L320)

***

### unsubscribe()

> **unsubscribe**(`channel`): `void`

Unsubscribes from a channel

#### Parameters

##### channel

`string`

#### Returns

`void`

#### Defined in

[core/client.ts:329](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L329)

***

### flushMessageQueue()

> `private` **flushMessageQueue**(): `Promise`\<`void`\>

Flushes the message queue by sending pending messages

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/client.ts:344](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L344)

***

### sendImmediate()

> `private` **sendImmediate**(`message`): `Promise`\<`void`\>

Sends a message immediately without queueing

#### Parameters

##### message

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/client.ts:362](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L362)

***

### send()

> **send**(`message`): `Promise`\<`void`\>

Sends a message to the WebSocket server

#### Parameters

##### message

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/client.ts:382](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L382)

***

### close()

> **close**(): `void`

Closes the WebSocket connection

#### Returns

`void`

#### Defined in

[core/client.ts:404](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/client.ts#L404)
