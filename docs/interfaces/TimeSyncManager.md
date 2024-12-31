[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / TimeSyncManager

# Interface: TimeSyncManager

Time synchronization manager interface

## Methods

### startSync()

> **startSync**(`wsUrl`): `void`

Starts time synchronization

#### Parameters

##### wsUrl

`string`

WebSocket URL for time sync

#### Returns

`void`

#### Defined in

[nips/nip-22.ts:144](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L144)

***

### stopSync()

> **stopSync**(): `void`

Stops time synchronization

#### Returns

`void`

#### Defined in

[nips/nip-22.ts:149](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L149)

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Gets current synchronized time

#### Returns

`number`

Current timestamp

#### Defined in

[nips/nip-22.ts:155](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L155)

***

### validateEvent()

> **validateEvent**(`event`): [`TimeValidationResult`](TimeValidationResult.md)

Validates event timing

#### Parameters

##### event

[`NostrWSMessage`](NostrWSMessage.md)

Event to validate

#### Returns

[`TimeValidationResult`](TimeValidationResult.md)

Validation result

#### Defined in

[nips/nip-22.ts:162](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L162)
