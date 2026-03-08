[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / PaginationHandler

# Interface: PaginationHandler

Defined in: [nips/nip-15.ts:114](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L114)

Pagination handler interface

## Methods

### getNextPage()

> **getNextPage**(`subscriptionId`, `pageSize`): `Promise`\<[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)[]\>

Defined in: [nips/nip-15.ts:121](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L121)

Gets next page of events

#### Parameters

##### subscriptionId

`string`

Subscription ID

##### pageSize

`number`

Number of events per page

#### Returns

`Promise`\<[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)[]\>

Next page of events

***

### hasMoreEvents()

> **hasMoreEvents**(`subscriptionId`): `boolean`

Defined in: [nips/nip-15.ts:131](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L131)

Checks if more events are available

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`boolean`

True if more events exist

***

### updateState()

> **updateState**(`subscriptionId`, `events`): `void`

Defined in: [nips/nip-15.ts:138](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L138)

Updates pagination state with new events

#### Parameters

##### subscriptionId

`string`

Subscription ID

##### events

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)[]

New events

#### Returns

`void`
