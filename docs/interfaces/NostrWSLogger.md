[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSLogger

# Interface: NostrWSLogger

Defined in: [types/logger.ts:23](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L23)

Extended logger interface with WebSocket-specific methods

## Extends

- [`Logger`](../type-aliases/Logger.md)

## Methods

### wsConnect()

> **wsConnect**(`context`): `void`

Defined in: [types/logger.ts:27](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L27)

Log WebSocket connection event

#### Parameters

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`

***

### wsDisconnect()

> **wsDisconnect**(`context`): `void`

Defined in: [types/logger.ts:32](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L32)

Log WebSocket disconnection event

#### Parameters

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`

***

### wsMessage()

> **wsMessage**(`context`): `void`

Defined in: [types/logger.ts:37](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L37)

Log WebSocket message event

#### Parameters

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`

***

### wsError()

> **wsError**(`error`, `context`): `void`

Defined in: [types/logger.ts:42](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L42)

Log WebSocket error event

#### Parameters

##### error

`Error`

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`

***

### wsMetrics()

> **wsMetrics**(`metrics`, `context`): `void`

Defined in: [types/logger.ts:47](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/logger.ts#L47)

Log WebSocket metrics

#### Parameters

##### metrics

`Record`\<`string`, `unknown`\>

##### context

[`WebSocketLogContext`](WebSocketLogContext.md)

#### Returns

`void`
