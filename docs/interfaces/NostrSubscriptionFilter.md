[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrSubscriptionFilter

# Interface: NostrSubscriptionFilter

Subscription request filter

## Extends

- [`NostrEventFilter`](NostrEventFilter.md)

## Indexable

 \[`key`: `string`\]: `unknown`

## Properties

### ids?

> `optional` **ids**: `string`[]

#### Inherited from

[`NostrEventFilter`](NostrEventFilter.md).[`ids`](NostrEventFilter.md#ids)

#### Defined in

[types/events.ts:56](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L56)

***

### authors?

> `optional` **authors**: `string`[]

#### Inherited from

[`NostrEventFilter`](NostrEventFilter.md).[`authors`](NostrEventFilter.md#authors)

#### Defined in

[types/events.ts:57](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L57)

***

### kinds?

> `optional` **kinds**: `number`[]

#### Inherited from

[`NostrEventFilter`](NostrEventFilter.md).[`kinds`](NostrEventFilter.md#kinds)

#### Defined in

[types/events.ts:58](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L58)

***

### since?

> `optional` **since**: `number`

#### Inherited from

[`NostrEventFilter`](NostrEventFilter.md).[`since`](NostrEventFilter.md#since)

#### Defined in

[types/events.ts:59](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L59)

***

### until?

> `optional` **until**: `number`

#### Inherited from

[`NostrEventFilter`](NostrEventFilter.md).[`until`](NostrEventFilter.md#until)

#### Defined in

[types/events.ts:60](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L60)

***

### subscriptionId?

> `optional` **subscriptionId**: `string`

#### Defined in

[types/filters.ts:12](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/filters.ts#L12)

***

### limit?

> `optional` **limit**: `number`

#### Overrides

[`NostrEventFilter`](NostrEventFilter.md).[`limit`](NostrEventFilter.md#limit)

#### Defined in

[types/filters.ts:13](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/filters.ts#L13)
