[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSLogger

# Interface: NostrWSLogger

Extended logger interface with WebSocket-specific methods

## Extends

- [`Logger`](../type-aliases/Logger.md)

## Methods

### wsConnect()

> **wsConnect**(`context`): `void`

Log WebSocket connection event

#### Parameters

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`

#### Defined in

[types/logger.ts:27](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L27)

***

### wsDisconnect()

> **wsDisconnect**(`context`): `void`

Log WebSocket disconnection event

#### Parameters

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`

#### Defined in

[types/logger.ts:32](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L32)

***

### wsMessage()

> **wsMessage**(`context`): `void`

Log WebSocket message event

#### Parameters

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`

#### Defined in

[types/logger.ts:37](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L37)

***

### wsError()

> **wsError**(`error`, `context`): `void`

Log WebSocket error event

#### Parameters

##### error

`Error`

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`

#### Defined in

[types/logger.ts:42](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L42)

***

### wsMetrics()

> **wsMetrics**(`metrics`, `context`): `void`

Log WebSocket metrics

#### Parameters

##### metrics

`Record`\<`string`, `unknown`\>

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`

#### Defined in

[types/logger.ts:47](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L47)
