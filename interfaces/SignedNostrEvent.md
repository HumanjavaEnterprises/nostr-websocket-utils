[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / SignedNostrEvent

# Interface: SignedNostrEvent

Signed Nostr event with id and signature

## Extends

- [`NostrEvent`](NostrEvent.md)

## Properties

### pubkey

> **pubkey**: `string`

Public key of the event creator in hex format

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`pubkey`](NostrEvent.md#pubkey)

#### Defined in

[types/events.ts:15](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L15)

***

### created\_at

> **created\_at**: `number`

Unix timestamp in seconds

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`created_at`](NostrEvent.md#created_at)

#### Defined in

[types/events.ts:18](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L18)

***

### kind

> **kind**: `number`

Event kind number

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`kind`](NostrEvent.md#kind)

#### Defined in

[types/events.ts:21](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L21)

***

### tags

> **tags**: `string`[][]

Array of tags

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`tags`](NostrEvent.md#tags)

#### Defined in

[types/events.ts:24](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L24)

***

### content

> **content**: `string`

Event content

#### Inherited from

[`NostrEvent`](NostrEvent.md).[`content`](NostrEvent.md#content)

#### Defined in

[types/events.ts:27](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L27)

***

### id

> **id**: `string`

Event ID in hex format

#### Overrides

[`NostrEvent`](NostrEvent.md).[`id`](NostrEvent.md#id)

#### Defined in

[types/events.ts:39](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L39)

***

### sig

> **sig**: `string`

Signature of the event data in hex format

#### Overrides

[`NostrEvent`](NostrEvent.md).[`sig`](NostrEvent.md#sig)

#### Defined in

[types/events.ts:41](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L41)
