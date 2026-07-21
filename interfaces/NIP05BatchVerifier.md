[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NIP05BatchVerifier

# Interface: NIP05BatchVerifier

Defined in: [nips/nip-05.ts:207](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L207)

Batch verification interface for multiple identifiers

## Methods

### addToQueue()

> **addToQueue**(`identifier`, `pubkey`): `void`

Defined in: [nips/nip-05.ts:213](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L213)

Adds identifier to verification queue

#### Parameters

##### identifier

`string`

Internet identifier

##### pubkey

`string`

Public key

#### Returns

`void`

***

### verifyAll()

> **verifyAll**(): `Promise`\<`Map`\<`string`, [`NIP05VerificationResult`](NIP05VerificationResult.md)\>\>

Defined in: [nips/nip-05.ts:219](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L219)

Verifies all queued identifiers

#### Returns

`Promise`\<`Map`\<`string`, [`NIP05VerificationResult`](NIP05VerificationResult.md)\>\>

Verification results

***

### clearQueue()

> **clearQueue**(): `void`

Defined in: [nips/nip-05.ts:224](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L224)

Clears verification queue

#### Returns

`void`
