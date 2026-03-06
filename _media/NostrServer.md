[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrServer

# Class: NostrServer

Defined in: [core/nostr-server.ts:11](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/nostr-server.ts#L11)

Represents a Nostr WebSocket server

## Constructors

### Constructor

> **new NostrServer**(`options`): `NostrWSServer`

Defined in: [core/nostr-server.ts:22](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/nostr-server.ts#L22)

Creates a new Nostr WebSocket server instance

#### Parameters

##### options

`NostrWSServerOptions`

Server configuration options

#### Returns

`NostrWSServer`

## Properties

### server

> `private` **server**: `WebSocketServer`

Defined in: [core/nostr-server.ts:15](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/nostr-server.ts#L15)

The underlying WebSocket server instance

## Methods

### stop()

> **stop**(): `void`

Defined in: [core/nostr-server.ts:98](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/nostr-server.ts#L98)

Closes the WebSocket server

#### Returns

`void`
