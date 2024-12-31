[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / TimeValidator

# Interface: TimeValidator

Time validator interface

## Methods

### validateTime()

> **validateTime**(`timestamp`): [`TimeValidationResult`](TimeValidationResult.md)

Validates event timestamp

#### Parameters

##### timestamp

`number`

Event timestamp

#### Returns

[`TimeValidationResult`](TimeValidationResult.md)

Validation result

#### Defined in

[nips/nip-22.ts:35](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L35)

***

### updateTimeOffset()

> **updateTimeOffset**(`serverTime`): `void`

Updates server time offset

#### Parameters

##### serverTime

`number`

Server timestamp

#### Returns

`void`

#### Defined in

[nips/nip-22.ts:41](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L41)

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Gets current adjusted timestamp

#### Returns

`number`

Adjusted timestamp

#### Defined in

[nips/nip-22.ts:47](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L47)
