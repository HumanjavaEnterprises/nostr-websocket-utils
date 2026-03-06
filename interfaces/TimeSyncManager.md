[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / TimeSyncManager

# Interface: TimeSyncManager

Defined in: [nips/nip-22.ts:140](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L140)

Time synchronization manager interface

## Methods

### startSync()

> **startSync**(`wsUrl`): `void`

Defined in: [nips/nip-22.ts:145](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L145)

Starts time synchronization

#### Parameters

##### wsUrl

`string`

WebSocket URL for time sync

#### Returns

`void`

***

### stopSync()

> **stopSync**(): `void`

Defined in: [nips/nip-22.ts:150](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L150)

Stops time synchronization

#### Returns

`void`

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Defined in: [nips/nip-22.ts:156](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L156)

Gets current synchronized time

#### Returns

`number`

Current timestamp

***

### validateEvent()

> **validateEvent**(`event`): [`TimeValidationResult`](TimeValidationResult.md)

Defined in: [nips/nip-22.ts:163](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L163)

Validates event timing

#### Parameters

##### event

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Event to validate

#### Returns

[`TimeValidationResult`](TimeValidationResult.md)

Validation result
