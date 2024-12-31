[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / PaginationHandler

# Interface: PaginationHandler

Pagination handler interface

## Methods

### getNextPage()

> **getNextPage**(`subscriptionId`, `pageSize`): `Promise`\<[`NostrWSMessage`](NostrWSMessage.md)[]\>

Gets next page of events

#### Parameters

##### subscriptionId

`string`

Subscription ID

##### pageSize

`number`

Number of events per page

#### Returns

`Promise`\<[`NostrWSMessage`](NostrWSMessage.md)[]\>

Next page of events

#### Defined in

[nips/nip-15.ts:126](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L126)

***

### hasMoreEvents()

> **hasMoreEvents**(`subscriptionId`): `boolean`

Checks if more events are available

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`boolean`

True if more events exist

#### Defined in

[nips/nip-15.ts:136](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L136)

***

### updateState()

> **updateState**(`subscriptionId`, `events`): `void`

Updates pagination state with new events

#### Parameters

##### subscriptionId

`string`

Subscription ID

##### events

[`NostrWSMessage`](NostrWSMessage.md)[]

New events

#### Returns

`void`

#### Defined in

[nips/nip-15.ts:143](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L143)
