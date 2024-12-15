[**nostr-websocket-utils v0.2.4**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSServer

# Class: NostrWSServer

WebSocket server implementation for Nostr protocol
Extends EventEmitter to provide event-based message handling

## Example

```typescript
const server = new NostrWSServer({
  port: 8080,
  logger: console,
  handlers: {
    message: async (ws, msg) => console.log('Received:', msg),
    error: (ws, err) => console.error('Error:', err),
    close: (ws) => console.log('Client disconnected')
  }
});

server.start();
```

## Extends

- `EventEmitter`

## Constructors

### new NostrWSServer()

> **new NostrWSServer**(`wss`, `options`): [`NostrWSServer`](NostrWSServer.md)

Creates a new NostrWSServer instance

#### Parameters

##### wss

`WebSocketServer`

##### options

`Partial`\<[`NostrWSOptions`](../interfaces/NostrWSOptions.md)\> = `{}`

Configuration options

#### Returns

[`NostrWSServer`](NostrWSServer.md)

#### Throws

If logger is not provided

#### Overrides

`EventEmitter.constructor`

#### Defined in

[server.ts:49](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L49)

## Properties

### wss

> `private` **wss**: `WebSocketServer`

#### Defined in

[server.ts:32](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L32)

***

### options

> `private` **options**: [`NostrWSOptions`](../interfaces/NostrWSOptions.md)

#### Defined in

[server.ts:33](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L33)

***

### heartbeatInterval

> `private` **heartbeatInterval**: `null` \| `Timeout` = `null`

#### Defined in

[server.ts:34](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L34)

***

### clients

> **clients**: `Map`\<`string`, [`ExtendedWebSocket`](../interfaces/ExtendedWebSocket.md)\>

#### Defined in

[server.ts:35](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L35)

## Methods

### setupServer()

> `private` **setupServer**(): `void`

Sets up the WebSocket server

#### Returns

`void`

#### Defined in

[server.ts:77](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L77)

***

### handleConnection()

> `private` **handleConnection**(`ws`): `void`

Handles a new client connection

#### Parameters

##### ws

[`ExtendedWebSocket`](../interfaces/ExtendedWebSocket.md)

WebSocket client instance

#### Returns

`void`

#### Defined in

[server.ts:93](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L93)

***

### startHeartbeat()

> `private` **startHeartbeat**(): `void`

Starts the heartbeat mechanism to check client connections

#### Returns

`void`

#### Defined in

[server.ts:135](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L135)

***

### broadcast()

> **broadcast**(`message`): `void`

Broadcasts a message to all connected clients

#### Parameters

##### message

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

Message to broadcast

#### Returns

`void`

#### Example

```typescript
server.broadcast({
  type: 'EVENT',
  data: { content: 'Hello everyone!' }
});
```

#### Defined in

[server.ts:163](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L163)

***

### broadcastToChannel()

> **broadcastToChannel**(`channel`, `message`): `void`

Broadcasts a message to all connected clients subscribed to a specific channel

#### Parameters

##### channel

`string`

Channel to broadcast to

##### message

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

Message to broadcast

#### Returns

`void`

#### Example

```typescript
server.broadcastToChannel('my-channel', {
  type: 'EVENT',
  data: { content: 'Hello channel!' }
});
```

#### Defined in

[server.ts:184](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L184)

***

### close()

> **close**(): `void`

Stops the WebSocket server

#### Returns

`void`

#### Example

```typescript
await server.close();
```

#### Defined in

[server.ts:202](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/server.ts#L202)
