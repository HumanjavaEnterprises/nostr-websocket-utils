[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / PowRateLimiter

# Interface: PowRateLimiter

Defined in: [nips/nip-13.ts:197](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L197)

Rate limiter interface for proof of work

## Methods

### shouldRateLimit()

> **shouldRateLimit**(`pubkey`, `currentTime`): `boolean`

Defined in: [nips/nip-13.ts:204](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L204)

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

Defined in: [nips/nip-13.ts:212](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L212)

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
