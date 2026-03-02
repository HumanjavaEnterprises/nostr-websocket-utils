[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / EventStorageManager

# Interface: EventStorageManager

Defined in: [nips/nip-16.ts:120](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-16.ts#L120)

Storage management interface for different event types

## Methods

### shouldStore()

> **shouldStore**(`event`): `boolean`

Defined in: [nips/nip-16.ts:126](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-16.ts#L126)

Determines if an event should be stored

#### Parameters

##### event

`Record`\<`string`, `unknown`\>

Event to check

#### Returns

`boolean`

True if event should be stored

***

### getStorageDuration()

> **getStorageDuration**(`event`): `number`

Defined in: [nips/nip-16.ts:133](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-16.ts#L133)

Gets storage duration for an event

#### Parameters

##### event

`Record`\<`string`, `unknown`\>

Event to check

#### Returns

`number`

Storage duration in seconds (0 for permanent)

***

### shouldReplace()

> **shouldReplace**(`newEvent`, `existingEvent`): `boolean`

Defined in: [nips/nip-16.ts:141](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-16.ts#L141)

Checks if an event should replace another

#### Parameters

##### newEvent

`Record`\<`string`, `unknown`\>

New event

##### existingEvent

`Record`\<`string`, `unknown`\>

Existing event

#### Returns

`boolean`

True if new event should replace existing
