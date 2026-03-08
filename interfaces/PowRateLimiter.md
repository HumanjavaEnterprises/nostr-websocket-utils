[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / PowRateLimiter

# Interface: PowRateLimiter

Defined in: [nips/nip-13.ts:147](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L147)

Rate limiter interface for proof of work

## Methods

### shouldRateLimit()

> **shouldRateLimit**(`pubkey`, `currentTime`): `boolean`

Defined in: [nips/nip-13.ts:154](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L154)

Checks if an event should be rate limited

#### Parameters

##### pubkey

`string`

Publisher's public key

##### currentTime

`number`

Current timestamp

#### Returns

`boolean`

True if should be rate limited

***

### recordEvent()

> **recordEvent**(`pubkey`, `difficulty`, `currentTime`): `void`

Defined in: [nips/nip-13.ts:162](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L162)

Records an event for rate limiting

#### Parameters

##### pubkey

`string`

Publisher's public key

##### difficulty

`number`

Event difficulty

##### currentTime

`number`

Current timestamp

#### Returns

`void`
