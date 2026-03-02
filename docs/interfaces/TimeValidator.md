[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / TimeValidator

# Interface: TimeValidator

Defined in: [nips/nip-22.ts:30](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L30)

Time validator interface

## Methods

### validateTime()

> **validateTime**(`timestamp`): [`TimeValidationResult`](TimeValidationResult.md)

Defined in: [nips/nip-22.ts:36](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L36)

Validates event timestamp

#### Parameters

##### timestamp

`number`

Event timestamp

#### Returns

[`TimeValidationResult`](TimeValidationResult.md)

Validation result

***

### updateTimeOffset()

> **updateTimeOffset**(`serverTime`): `void`

Defined in: [nips/nip-22.ts:42](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L42)

Updates server time offset

#### Parameters

##### serverTime

`number`

Server timestamp

#### Returns

`void`

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Defined in: [nips/nip-22.ts:48](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L48)

Gets current adjusted timestamp

#### Returns

`number`

Adjusted timestamp
