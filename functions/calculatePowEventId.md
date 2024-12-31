[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / calculatePowEventId

# Function: calculatePowEventId()

> **calculatePowEventId**(`event`, `targetDifficulty`, `maxAttempts`): `Promise`\<`string`\>

Calculates event ID with proof of work

## Parameters

### event

`Record`\<`string`, `unknown`\>

Event object without ID

### targetDifficulty

`number`

Target number of leading zero bits

### maxAttempts

`number` = `1000000`

Maximum number of attempts

## Returns

`Promise`\<`string`\>

Event ID with sufficient proof of work

## Defined in

[nips/nip-13.ts:37](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L37)
