[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NIP05VerificationCache

# Interface: NIP05VerificationCache

Defined in: [nips/nip-05.ts:115](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L115)

NIP-05 verification cache interface

## Methods

### get()

> **get**(`identifier`, `pubkey`): [`NIP05VerificationResult`](NIP05VerificationResult.md) \| `undefined`

Defined in: [nips/nip-05.ts:122](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L122)

Gets cached verification result

#### Parameters

##### identifier

`string`

Internet identifier

##### pubkey

`string`

Public key

#### Returns

[`NIP05VerificationResult`](NIP05VerificationResult.md) \| `undefined`

Cached result

***

### set()

> **set**(`identifier`, `pubkey`, `result`, `ttl`): `void`

Defined in: [nips/nip-05.ts:131](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L131)

Sets verification result in cache

#### Parameters

##### identifier

`string`

Internet identifier

##### pubkey

`string`

Public key

##### result

[`NIP05VerificationResult`](NIP05VerificationResult.md)

Verification result

##### ttl

`number`

Time to live in seconds

#### Returns

`void`

***

### cleanup()

> **cleanup**(): `void`

Defined in: [nips/nip-05.ts:141](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L141)

Clears expired entries

#### Returns

`void`
