[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSServer

# Class: NostrWSServer

NostrWSServer class for handling WebSocket connections

## Constructors

### new NostrWSServer()

> **new NostrWSServer**(`options`): [`NostrWSServer`](NostrWSServer.md)

#### Parameters

##### options

`NostrWSServerOptions`

#### Returns

[`NostrWSServer`](NostrWSServer.md)

#### Defined in

[core/server.ts:24](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L24)

## Properties

### wss

> `private` **wss**: `WebSocketServer`

#### Defined in

[core/server.ts:19](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L19)

***

### options

> `private` **options**: `NostrWSServerOptions`

#### Defined in

[core/server.ts:20](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L20)

***

### rateLimiter?

> `private` `optional` **rateLimiter**: `RateLimiter`

#### Defined in

[core/server.ts:21](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L21)

***

### pingInterval?

> `private` `optional` **pingInterval**: `Timeout`

#### Defined in

[core/server.ts:22](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L22)

## Methods

### setupServer()

> `private` **setupServer**(): `void`

Set up WebSocket server event handlers

#### Returns

`void`

#### Defined in

[core/server.ts:52](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L52)

***

### startPingInterval()

> `private` **startPingInterval**(): `void`

Start ping interval to check client connections

#### Returns

`void`

#### Defined in

[core/server.ts:107](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L107)

***

### stop()

> **stop**(): `void`

Stop the server and clean up resources

#### Returns

`void`

#### Defined in

[core/server.ts:126](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/server.ts#L126)
