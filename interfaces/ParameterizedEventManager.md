[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ParameterizedEventManager

# Interface: ParameterizedEventManager

Defined in: [nips/nip-33.ts:96](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L96)

Parameterized event manager interface

## Methods

### createEvent()

> **createEvent**(`kind`, `content`, `identifier`, `tags?`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-33.ts:105](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L105)

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

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Created event

***

### updateEvent()

> **updateEvent**(`kind`, `identifier`, `content`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-33.ts:119](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L119)

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

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Update event

***

### subscribe()

> **subscribe**(`kinds`, `identifiers`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-33.ts:131](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L131)

Subscribes to parameterized events

#### Parameters

##### kinds

`number`[]

Event kinds to subscribe to

##### identifiers

`string`[]

Parameter identifiers

#### Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Subscription message
