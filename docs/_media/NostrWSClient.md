[**nostr-websocket-utils v0.2.5**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSClient

# Class: NostrWSClient

WebSocket client implementation for Nostr protocol communication
Extends EventEmitter to provide event-based message handling

## Example

```typescript
const client = new NostrWSClient('wss://relay.example.com', {
  logger: console,
  heartbeatInterval: 30000,
  handlers: {
    message: async (msg) => console.log('Received:', msg),
    error: (err) => console.error('Error:', err),
    close: () => console.log('Connection closed')
  }
});

await client.connect();
client.send({ type: 'EVENT', data: { ... } });
```

## Extends

- `EventEmitter`

## Constructors

### new NostrWSClient()

> **new NostrWSClient**(`url`, `options`): [`NostrWSClient`](NostrWSClient.md)

Creates a new NostrWSClient instance

#### Parameters

##### url

`string`

The WebSocket server URL to connect to

##### options

`Partial`\<[`NostrWSOptions`](../interfaces/NostrWSOptions.md)\> = `{}`

Configuration options

#### Returns

[`NostrWSClient`](NostrWSClient.md)

#### Throws

If logger is not provided

#### Overrides

`EventEmitter.constructor`

#### Defined in

[client.ts:53](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L53)

## Properties

### ws

> `private` **ws**: `null` \| `WebSocket` = `null`

#### Defined in

[client.ts:31](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L31)

***

### options

> `private` **options**: [`NostrWSOptions`](../interfaces/NostrWSOptions.md)

#### Defined in

[client.ts:32](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L32)

***

### reconnectTimeout

> `private` **reconnectTimeout**: `null` \| `Timeout` = `null`

#### Defined in

[client.ts:33](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L33)

***

### heartbeatInterval

> `private` **heartbeatInterval**: `null` \| `Timeout` = `null`

#### Defined in

[client.ts:34](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L34)

***

### reconnectAttempts

> `private` **reconnectAttempts**: `number` = `0`

#### Defined in

[client.ts:35](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L35)

***

### messageQueue

> `private` **messageQueue**: [`NostrWSMessage`](../interfaces/NostrWSMessage.md)[] = `[]`

#### Defined in

[client.ts:36](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L36)

***

### clientId

> `private` **clientId**: `string`

#### Defined in

[client.ts:37](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L37)

***

### url

> `private` **url**: `string`

The WebSocket server URL to connect to

#### Defined in

[client.ts:53](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L53)

## Methods

### connect()

> **connect**(): `void`

Establishes a connection to the WebSocket server

#### Returns

`void`

#### Example

```typescript
client.connect();
```

#### Defined in

[client.ts:79](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L79)

***

### setupEventHandlers()

> `private` **setupEventHandlers**(): `void`

Sets up event handlers for the WebSocket connection

#### Returns

`void`

#### Defined in

[client.ts:101](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L101)

***

### startHeartbeat()

> `private` **startHeartbeat**(): `void`

Starts sending heartbeat messages at the specified interval

#### Returns

`void`

#### Defined in

[client.ts:149](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L149)

***

### stopHeartbeat()

> `private` **stopHeartbeat**(): `void`

Stops sending heartbeat messages

#### Returns

`void`

#### Defined in

[client.ts:164](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L164)

***

### handleReconnect()

> `private` **handleReconnect**(): `void`

Handles reconnecting to the WebSocket server after a disconnection

#### Returns

`void`

#### Defined in

[client.ts:176](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L176)

***

### subscribe()

> **subscribe**(`channel`, `filter`?): `void`

Subscribes to a channel with optional filter

#### Parameters

##### channel

`string`

Channel name

##### filter?

`unknown`

Filter data

#### Returns

`void`

#### Example

```typescript
client.subscribe('channel-name', { ...filterData });
```

#### Defined in

[client.ts:197](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L197)

***

### unsubscribe()

> **unsubscribe**(`channel`): `void`

Unsubscribes from a channel

#### Parameters

##### channel

`string`

Channel name

#### Returns

`void`

#### Example

```typescript
client.unsubscribe('channel-name');
```

#### Defined in

[client.ts:213](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L213)

***

### flushMessageQueue()

> `private` **flushMessageQueue**(): `void`

Flushes the message queue by sending pending messages

#### Returns

`void`

#### Defined in

[client.ts:225](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L225)

***

### send()

> **send**(`message`): `Promise`\<`void`\>

Sends a message to the WebSocket server

#### Parameters

##### message

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

Message to send

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
client.send({ type: 'EVENT', data: { ... } });
```

#### Defined in

[client.ts:244](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L244)

***

### close()

> **close**(): `void`

Closes the WebSocket connection

#### Returns

`void`

#### Example

```typescript
client.close();
```

#### Defined in

[client.ts:267](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/client.ts#L267)
