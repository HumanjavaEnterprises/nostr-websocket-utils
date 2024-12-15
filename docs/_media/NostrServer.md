[**nostr-websocket-utils v0.2.5**](../README.md)

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

[`NostrWSServerOptions`](../interfaces/NostrWSServerOptions.md)

Server configuration options

#### Returns

[`NostrServer`](NostrServer.md)

#### Defined in

[nostr-server.ts:24](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nostr-server.ts#L24)

## Properties

### server

> `private` **server**: `Server`\<*typeof* `WebSocket`, *typeof* `IncomingMessage`\>

The underlying WebSocket server instance

#### Defined in

[nostr-server.ts:12](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nostr-server.ts#L12)

***

### logger

> `private` **logger**: `Logger`

Logger instance for this server

#### Defined in

[nostr-server.ts:17](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nostr-server.ts#L17)

## Methods

### close()

> **close**(): `void`

Closes the WebSocket server

#### Returns

`void`

#### Defined in

[nostr-server.ts:112](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nostr-server.ts#L112)
