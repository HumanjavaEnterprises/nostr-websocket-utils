[**nostr-websocket-utils v0.2.5**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSOptions

# Interface: NostrWSOptions

Configuration options for the NostrWSClient
 NostrWSOptions

## Properties

### heartbeatInterval?

> `optional` **heartbeatInterval**: `number`

Interval in milliseconds between heartbeat messages

#### Default

```ts
30000
```

#### Defined in

[types/index.ts:25](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L25)

***

### reconnectInterval?

> `optional` **reconnectInterval**: `number`

Interval in milliseconds between reconnect attempts

#### Default

```ts
5000
```

#### Defined in

[types/index.ts:31](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L31)

***

### maxReconnectAttempts?

> `optional` **maxReconnectAttempts**: `number`

Maximum number of reconnect attempts

#### Default

```ts
10
```

#### Defined in

[types/index.ts:37](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L37)

***

### logger

> **logger**: `Logger`

Logger instance for handling log messages
Must implement debug, info, error, and warn methods

#### Defined in

[types/index.ts:43](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L43)

***

### WebSocketImpl

> **WebSocketImpl**: *typeof* `WebSocket`

WebSocket implementation to use
Defaults to the native WebSocket implementation

#### Defined in

[types/index.ts:49](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L49)

***

### handlers

> **handlers**: `object`

Event handlers for WebSocket events

#### message()

> **message**: (`ws`, `message`) => `void` \| `Promise`\<`void`\>

Handler for incoming messages

##### Parameters

###### ws

[`ExtendedWebSocket`](ExtendedWebSocket.md)

The WebSocket instance

###### message

[`NostrWSMessage`](NostrWSMessage.md)

The received message

##### Returns

`void` \| `Promise`\<`void`\>

#### error()?

> `optional` **error**: (`ws`, `error`) => `void`

Handler for WebSocket errors

##### Parameters

###### ws

`WebSocket`

The WebSocket instance

###### error

`Error`

The error object

##### Returns

`void`

#### close()?

> `optional` **close**: (`ws`) => `void`

Handler for WebSocket connection close

##### Parameters

###### ws

`WebSocket`

The WebSocket instance

##### Returns

`void`

#### Defined in

[types/index.ts:54](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L54)
