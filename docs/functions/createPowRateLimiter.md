[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createPowRateLimiter

# Function: createPowRateLimiter()

> **createPowRateLimiter**(`windowSeconds`, `maxDifficulty`): [`PowRateLimiter`](../interfaces/PowRateLimiter.md)

Creates a default PoW rate limiter

## Parameters

### windowSeconds

`number` = `3600`

Time window for rate limiting

### maxDifficulty

`number` = `100`

Maximum cumulative difficulty per window

## Returns

[`PowRateLimiter`](../interfaces/PowRateLimiter.md)

Rate limiter

## Defined in

[nips/nip-13.ts:171](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L171)
