[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NIP05VerificationCache

# Interface: NIP05VerificationCache

Defined in: [nips/nip-05.ts:117](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L117)

NIP-05 verification cache interface

## Methods

### get()

> **get**(`identifier`, `pubkey`): [`NIP05VerificationResult`](NIP05VerificationResult.md) \| `undefined`

Defined in: [nips/nip-05.ts:124](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L124)

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

Defined in: [nips/nip-05.ts:133](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L133)

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

Defined in: [nips/nip-05.ts:143](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L143)

Clears expired entries

#### Returns

`void`
