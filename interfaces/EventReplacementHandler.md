[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / EventReplacementHandler

# Interface: EventReplacementHandler

Defined in: [nips/nip-33.ts:177](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L177)

Event replacement handler interface

## Methods

### shouldReplace()

> **shouldReplace**(`newEvent`, `existingEvent`): `boolean`

Defined in: [nips/nip-33.ts:184](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L184)

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

True if should replace

***

### getReplacementKey()

> **getReplacementKey**(`event`): `string`

Defined in: [nips/nip-33.ts:194](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L194)

Gets replacement key for an event

#### Parameters

##### event

`Record`\<`string`, `unknown`\>

Event to get key for

#### Returns

`string`

Replacement key
