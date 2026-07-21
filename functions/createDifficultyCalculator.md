[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createDifficultyCalculator

# Function: createDifficultyCalculator()

> **createDifficultyCalculator**(`baseDifficulty?`, `contentMultiplier?`): [`DifficultyCalculator`](../interfaces/DifficultyCalculator.md)

Defined in: [nips/nip-13.ts:170](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L170)

Creates a default difficulty calculator

## Parameters

### baseDifficulty?

`number` = `8`

Base difficulty for all events

### contentMultiplier?

`number` = `0.001`

Multiplier based on content length

## Returns

[`DifficultyCalculator`](../interfaces/DifficultyCalculator.md)

Difficulty calculator
