[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrEvent

# Interface: NostrEvent

Base Nostr event interface following NIP-01 specification

## See

https://github.com/nostr-protocol/nips/blob/master/01.md

## Extended by

- [`SignedNostrEvent`](SignedNostrEvent.md)

## Properties

### id

> **id**: `string`

Event ID in hex format

#### Defined in

[types/events.ts:12](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L12)

***

### pubkey

> **pubkey**: `string`

Public key of the event creator in hex format

#### Defined in

[types/events.ts:15](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L15)

***

### created\_at

> **created\_at**: `number`

Unix timestamp in seconds

#### Defined in

[types/events.ts:18](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L18)

***

### kind

> **kind**: `number`

Event kind number

#### Defined in

[types/events.ts:21](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L21)

***

### tags

> **tags**: `string`[][]

Array of tags

#### Defined in

[types/events.ts:24](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L24)

***

### content

> **content**: `string`

Event content

#### Defined in

[types/events.ts:27](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L27)

***

### sig

> **sig**: `string`

Signature of the event data in hex format

#### Defined in

[types/events.ts:30](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L30)
