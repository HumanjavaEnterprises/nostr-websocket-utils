[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / DifficultyCalculator

# Interface: DifficultyCalculator

Defined in: [nips/nip-13.ts:105](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L105)

Dynamic difficulty calculator based on event type and content

## Methods

### calculateRequiredDifficulty()

> **calculateRequiredDifficulty**(`event`): `number`

Defined in: [nips/nip-13.ts:111](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L111)

Calculates required difficulty for an event

#### Parameters

##### event

`Record`\<`string`, `unknown`\>

Event to check

#### Returns

`number`

Required number of leading zero bits
