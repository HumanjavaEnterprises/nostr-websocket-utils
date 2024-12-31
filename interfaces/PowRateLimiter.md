[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / PowRateLimiter

# Interface: PowRateLimiter

Rate limiter interface for proof of work

## Methods

### shouldRateLimit()

> **shouldRateLimit**(`pubkey`, `currentTime`): `boolean`

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

#### Defined in

[nips/nip-13.ts:154](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L154)

***

### recordEvent()

> **recordEvent**(`pubkey`, `difficulty`, `currentTime`): `void`

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

#### Defined in

[nips/nip-13.ts:162](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L162)
