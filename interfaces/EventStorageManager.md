[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / EventStorageManager

# Interface: EventStorageManager

Storage management interface for different event types

## Methods

### shouldStore()

> **shouldStore**(`event`): `boolean`

Determines if an event should be stored

#### Parameters

##### event

`Record`\<`string`, `unknown`\>

Event to check

#### Returns

`boolean`

True if event should be stored

#### Defined in

[nips/nip-16.ts:126](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-16.ts#L126)

***

### getStorageDuration()

> **getStorageDuration**(`event`): `number`

Gets storage duration for an event

#### Parameters

##### event

`Record`\<`string`, `unknown`\>

Event to check

#### Returns

`number`

Storage duration in seconds (0 for permanent)

#### Defined in

[nips/nip-16.ts:133](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-16.ts#L133)

***

### shouldReplace()

> **shouldReplace**(`newEvent`, `existingEvent`): `boolean`

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

#### Defined in

[nips/nip-16.ts:141](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-16.ts#L141)
