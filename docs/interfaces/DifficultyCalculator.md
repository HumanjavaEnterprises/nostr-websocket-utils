[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / DifficultyCalculator

# Interface: DifficultyCalculator

Dynamic difficulty calculator based on event type and content

## Methods

### calculateRequiredDifficulty()

> **calculateRequiredDifficulty**(`event`): `number`

Calculates required difficulty for an event

#### Parameters

##### event

`Record`\<`string`, `unknown`\>

Event to check

#### Returns

`number`

Required number of leading zero bits

#### Defined in

[nips/nip-13.ts:111](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L111)
