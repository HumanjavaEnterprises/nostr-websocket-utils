[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / EventReplacementHandler

# Interface: EventReplacementHandler

Event replacement handler interface

## Methods

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

True if should replace

#### Defined in

[nips/nip-33.ts:190](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L190)

***

### getReplacementKey()

> **getReplacementKey**(`event`): `string`

Gets replacement key for an event

#### Parameters

##### event

`Record`\<`string`, `unknown`\>

Event to get key for

#### Returns

`string`

Replacement key

#### Defined in

[nips/nip-33.ts:200](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L200)
