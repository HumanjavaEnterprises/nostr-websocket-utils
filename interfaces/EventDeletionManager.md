[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / EventDeletionManager

# Interface: EventDeletionManager

Event deletion manager interface

## Methods

### processDeletion()

> **processDeletion**(`message`): `Promise`\<`string`[]\>

Processes a deletion event

#### Parameters

##### message

[`NostrEvent`](NostrEvent.md)

Deletion message

#### Returns

`Promise`\<`string`[]\>

Deleted event IDs

#### Defined in

[nips/nip-09.ts:155](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L155)

***

### isDeleted()

> **isDeleted**(`eventId`): `boolean`

Checks if an event has been deleted

#### Parameters

##### eventId

`string`

Event ID to check

#### Returns

`boolean`

True if event is deleted

#### Defined in

[nips/nip-09.ts:162](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L162)

***

### getDeletionReason()

> **getDeletionReason**(`eventId`): `undefined` \| `string`

Gets deletion reason for an event

#### Parameters

##### eventId

`string`

Event ID

#### Returns

`undefined` \| `string`

Deletion reason if available

#### Defined in

[nips/nip-09.ts:169](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L169)

***

### getDeletedEvents()

> **getDeletedEvents**(): `Map`\<`string`, `string`\>

Gets all deleted events

#### Returns

`Map`\<`string`, `string`\>

Map of event IDs to deletion reasons

#### Defined in

[nips/nip-09.ts:175](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L175)
