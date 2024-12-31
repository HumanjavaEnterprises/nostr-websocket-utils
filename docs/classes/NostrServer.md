[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrServer

# Class: NostrServer

Represents a Nostr WebSocket server

## Constructors

### new NostrServer()

> **new NostrServer**(`options`): [`NostrServer`](NostrServer.md)

Creates a new Nostr WebSocket server instance

#### Parameters

##### options

`NostrWSServerOptions`

Server configuration options

#### Returns

[`NostrServer`](NostrServer.md)

#### Defined in

[core/nostr-server.ts:22](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/nostr-server.ts#L22)

## Properties

### server

> `private` **server**: `WebSocketServer`

The underlying WebSocket server instance

#### Defined in

[core/nostr-server.ts:15](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/nostr-server.ts#L15)

## Methods

### stop()

> **stop**(): `void`

Closes the WebSocket server

#### Returns

`void`

#### Defined in

[core/nostr-server.ts:97](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/core/nostr-server.ts#L97)
