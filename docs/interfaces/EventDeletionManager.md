[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / EventDeletionManager

# Interface: EventDeletionManager

Defined in: [nips/nip-09.ts:140](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L140)

Event deletion manager interface

## Methods

### processDeletion()

> **processDeletion**(`message`): `Promise`\<`string`[]\>

Defined in: [nips/nip-09.ts:146](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L146)

Processes a deletion event

#### Parameters

##### message

`NostrEvent`

Deletion message

#### Returns

`Promise`\<`string`[]\>

Deleted event IDs

***

### isDeleted()

> **isDeleted**(`eventId`): `boolean`

Defined in: [nips/nip-09.ts:153](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L153)

Checks if an event has been deleted

#### Parameters

##### eventId

`string`

Event ID to check

#### Returns

`boolean`

True if event is deleted

***

### getDeletionReason()

> **getDeletionReason**(`eventId`): `string` \| `undefined`

Defined in: [nips/nip-09.ts:160](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L160)

Gets deletion reason for an event

#### Parameters

##### eventId

`string`

Event ID

#### Returns

`string` \| `undefined`

Deletion reason if available

***

### getDeletedEvents()

> **getDeletedEvents**(): `Map`\<`string`, `string`\>

Defined in: [nips/nip-09.ts:166](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L166)

Gets all deleted events

#### Returns

`Map`\<`string`, `string`\>

Map of event IDs to deletion reasons
