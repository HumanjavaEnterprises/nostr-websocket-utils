[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSMessage

# Interface: NostrWSMessage

Structure of messages sent through the WebSocket connection

## Properties

### type

> **type**: [`MessageType`](../type-aliases/MessageType.md)

Type of the message following NIP specifications

#### Defined in

[types/messages.ts:76](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L76)

***

### content?

> `optional` **content**: `unknown`

Message content - structure depends on type

#### Defined in

[types/messages.ts:81](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L81)

***

### subscription\_id?

> `optional` **subscription\_id**: `string`

Optional subscription ID for subscription-based messages

#### Defined in

[types/messages.ts:86](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L86)

***

### priority?

> `optional` **priority**: [`MessagePriority`](../enumerations/MessagePriority.md)

Message priority for queue management

#### Defined in

[types/messages.ts:91](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L91)

***

### queuedAt?

> `optional` **queuedAt**: `number`

Timestamp when the message was queued

#### Defined in

[types/messages.ts:96](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L96)

***

### retryCount?

> `optional` **retryCount**: `number`

Number of retry attempts for this message

#### Defined in

[types/messages.ts:101](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L101)

***

### data?

> `optional` **data**: `unknown`

Additional data for the message

#### Defined in

[types/messages.ts:106](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/messages.ts#L106)
