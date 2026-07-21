[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / calculatePowEventId

# Function: calculatePowEventId()

> **calculatePowEventId**(`event`, `targetDifficulty`, `maxAttempts?`): `Promise`\<[`PowResult`](../interfaces/PowResult.md)\>

Defined in: [nips/nip-13.ts:71](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L71)

Mines proof of work for an event per NIP-13: the nonce lives in a
["nonce", "<n>", "<target>"] tag inside the standard NIP-01 id preimage.

## Parameters

### event

`Record`\<`string`, `unknown`\>

Event object without id (must have pubkey/created_at/kind/tags/content)

### targetDifficulty

`number`

Target number of leading zero bits

### maxAttempts?

`number` = `1000000`

Maximum number of attempts

## Returns

`Promise`\<[`PowResult`](../interfaces/PowResult.md)\>

The mined id, winning nonce, and committed tags
