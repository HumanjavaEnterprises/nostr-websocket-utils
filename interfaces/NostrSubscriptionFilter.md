[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NostrSubscriptionFilter

# Interface: NostrSubscriptionFilter

Defined in: [types/filters.ts:11](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/filters.ts#L11)

Subscription request filter

## Extends

- `NostrEventFilter`

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### ids?

> `optional` **ids**: `string`[]

Defined in: [types/events.ts:56](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L56)

#### Inherited from

`NostrEventFilter.ids`

***

### authors?

> `optional` **authors**: `string`[]

Defined in: [types/events.ts:57](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L57)

#### Inherited from

`NostrEventFilter.authors`

***

### kinds?

> `optional` **kinds**: `number`[]

Defined in: [types/events.ts:58](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L58)

#### Inherited from

`NostrEventFilter.kinds`

***

### since?

> `optional` **since**: `number`

Defined in: [types/events.ts:59](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L59)

#### Inherited from

`NostrEventFilter.since`

***

### until?

> `optional` **until**: `number`

Defined in: [types/events.ts:60](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/events.ts#L60)

#### Inherited from

`NostrEventFilter.until`

***

### subscriptionId?

> `optional` **subscriptionId**: `string`

Defined in: [types/filters.ts:12](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/filters.ts#L12)

***

### limit?

> `optional` **limit**: `number`

Defined in: [types/filters.ts:13](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/types/filters.ts#L13)

#### Overrides

`NostrEventFilter.limit`
