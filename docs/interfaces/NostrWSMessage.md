[**nostr-websocket-utils v0.2.4**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrWSMessage

# Interface: NostrWSMessage

Structure of messages sent through the WebSocket connection
 NostrWSMessage

## Properties

### type

> **type**: `MessageType`

Type of the message (e.g., 'EVENT', 'subscribe', 'unsubscribe')

#### Defined in

[types/index.ts:85](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L85)

***

### id?

> `optional` **id**: `string`

Unique identifier for the message

#### Defined in

[types/index.ts:90](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L90)

***

### data

> **data**: `Record`\<`string`, `unknown`\>

Data payload of the message

#### Defined in

[types/index.ts:95](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/index.ts#L95)
