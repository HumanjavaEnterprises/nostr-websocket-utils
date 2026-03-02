[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NIP05BatchVerifier

# Interface: NIP05BatchVerifier

Defined in: [nips/nip-05.ts:205](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L205)

Batch verification interface for multiple identifiers

## Methods

### addToQueue()

> **addToQueue**(`identifier`, `pubkey`): `void`

Defined in: [nips/nip-05.ts:211](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L211)

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

Defined in: [nips/nip-05.ts:217](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L217)

Verifies all queued identifiers

#### Returns

`Promise`\<`Map`\<`string`, [`NIP05VerificationResult`](NIP05VerificationResult.md)\>\>

Verification results

***

### clearQueue()

> **clearQueue**(): `void`

Defined in: [nips/nip-05.ts:222](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L222)

Clears verification queue

#### Returns

`void`
