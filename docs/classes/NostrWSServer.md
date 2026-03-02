[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSServer

# Class: NostrWSServer

Defined in: [core/server.ts:19](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L19)

NostrWSServer class for handling WebSocket connections

## Constructors

### Constructor

> **new NostrWSServer**(`options`): `NostrWSServer`

Defined in: [core/server.ts:25](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L25)

#### Parameters

##### options

`NostrWSServerOptions`

#### Returns

`NostrWSServer`

## Properties

### wss

> `private` **wss**: `WebSocketServer`

Defined in: [core/server.ts:20](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L20)

***

### options

> `private` **options**: `NostrWSServerOptions`

Defined in: [core/server.ts:21](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L21)

***

### rateLimiter?

> `private` `optional` **rateLimiter**: `RateLimiter`

Defined in: [core/server.ts:22](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L22)

***

### pingInterval?

> `private` `optional` **pingInterval**: `Timeout`

Defined in: [core/server.ts:23](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L23)

## Methods

### setupServer()

> `private` **setupServer**(): `void`

Defined in: [core/server.ts:54](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L54)

Set up WebSocket server event handlers

#### Returns

`void`

***

### handleMessage()

> `private` **handleMessage**(`socket`, `rawMessage`): `Promise`\<`void`\>

Defined in: [core/server.ts:97](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L97)

#### Parameters

##### socket

`NostrWSServerSocket`

##### rawMessage

`string`

#### Returns

`Promise`\<`void`\>

***

### startPingInterval()

> `private` **startPingInterval**(): `void`

Defined in: [core/server.ts:123](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L123)

Start ping interval to check client connections

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [core/server.ts:142](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L142)

Stop the server and clean up resources

#### Returns

`void`
