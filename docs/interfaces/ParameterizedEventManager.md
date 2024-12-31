[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ParameterizedEventManager

# Interface: ParameterizedEventManager

Parameterized event manager interface

## Methods

### createEvent()

> **createEvent**(`kind`, `content`, `identifier`, `tags`?): [`NostrWSMessage`](NostrWSMessage.md)

Creates a new parameterized event

#### Parameters

##### kind

`number`

Event kind

##### content

`string`

Event content

##### identifier

`string`

Parameter identifier

##### tags?

`string`[][]

Additional tags

#### Returns

[`NostrWSMessage`](NostrWSMessage.md)

Created event

#### Defined in

[nips/nip-33.ts:108](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L108)

***

### updateEvent()

> **updateEvent**(`kind`, `identifier`, `content`): [`NostrWSMessage`](NostrWSMessage.md)

Updates an existing parameterized event

#### Parameters

##### kind

`number`

Event kind

##### identifier

`string`

Parameter identifier

##### content

`string`

New content

#### Returns

[`NostrWSMessage`](NostrWSMessage.md)

Update event

#### Defined in

[nips/nip-33.ts:122](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L122)

***

### subscribe()

> **subscribe**(`kinds`, `identifiers`): [`NostrWSMessage`](NostrWSMessage.md)

Subscribes to parameterized events

#### Parameters

##### kinds

`number`[]

Event kinds to subscribe to

##### identifiers

`string`[]

Parameter identifiers

#### Returns

[`NostrWSMessage`](NostrWSMessage.md)

Subscription message

#### Defined in

[nips/nip-33.ts:134](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L134)
