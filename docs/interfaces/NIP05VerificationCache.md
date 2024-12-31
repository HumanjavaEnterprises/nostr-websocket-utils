[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / NIP05VerificationCache

# Interface: NIP05VerificationCache

NIP-05 verification cache interface

## Methods

### get()

> **get**(`identifier`, `pubkey`): `undefined` \| [`NIP05VerificationResult`](NIP05VerificationResult.md)

Gets cached verification result

#### Parameters

##### identifier

`string`

Internet identifier

##### pubkey

`string`

Public key

#### Returns

`undefined` \| [`NIP05VerificationResult`](NIP05VerificationResult.md)

Cached result

#### Defined in

[nips/nip-05.ts:121](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L121)

***

### set()

> **set**(`identifier`, `pubkey`, `result`, `ttl`): `void`

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

#### Defined in

[nips/nip-05.ts:130](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L130)

***

### cleanup()

> **cleanup**(): `void`

Clears expired entries

#### Returns

`void`

#### Defined in

[nips/nip-05.ts:140](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L140)
