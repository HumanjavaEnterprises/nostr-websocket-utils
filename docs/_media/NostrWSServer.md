[**nostr-websocket-utils v0.2.5**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSServer

# Class: NostrWSServer

WebSocket server implementation for Nostr protocol
Extends EventEmitter to provide event-based message handling

## Extends

- `EventEmitter`

## Constructors

### new NostrWSServer()

> **new NostrWSServer**(`wss`, `options`): [`NostrWSServer`](NostrWSServer.md)

#### Parameters

##### wss

`WebSocketServer`

##### options

`Partial`\<[`NostrWSOptions`](../interfaces/NostrWSOptions.md)\> = `{}`

#### Returns

[`NostrWSServer`](NostrWSServer.md)

#### Overrides

`EventEmitter.constructor`

#### Defined in

[server.ts:20](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L20)

## Properties

### wss

> `private` **wss**: `null` \| `WebSocketServer` = `null`

#### Defined in

[server.ts:15](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L15)

***

### options

> `private` **options**: [`NostrWSOptions`](../interfaces/NostrWSOptions.md)

#### Defined in

[server.ts:16](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L16)

***

### clients

> `private` **clients**: `Map`\<`string`, [`ExtendedWebSocket`](../interfaces/ExtendedWebSocket.md)\>

#### Defined in

[server.ts:17](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L17)

***

### heartbeatInterval

> `private` **heartbeatInterval**: `null` \| `Timeout` = `null`

#### Defined in

[server.ts:18](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L18)

## Methods

### setupServer()

> `private` **setupServer**(): `void`

#### Returns

`void`

#### Defined in

[server.ts:41](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L41)

***

### handleConnection()

> `private` **handleConnection**(`ws`): `void`

#### Parameters

##### ws

[`ExtendedWebSocket`](../interfaces/ExtendedWebSocket.md)

#### Returns

`void`

#### Defined in

[server.ts:54](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L54)

***

### startHeartbeat()

> `private` **startHeartbeat**(): `void`

#### Returns

`void`

#### Defined in

[server.ts:93](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L93)

***

### broadcast()

> **broadcast**(`message`): `void`

#### Parameters

##### message

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

#### Returns

`void`

#### Defined in

[server.ts:114](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L114)

***

### broadcastToChannel()

> **broadcastToChannel**(`channel`, `message`): `void`

#### Parameters

##### channel

`string`

##### message

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

#### Returns

`void`

#### Defined in

[server.ts:124](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L124)

***

### close()

> **close**(): `void`

#### Returns

`void`

#### Defined in

[server.ts:135](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L135)
