[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / validateEventPoW

# Function: validateEventPoW()

> **validateEventPoW**(`message`, `minDifficulty`, `logger`): `boolean`

Validates proof of work for an event

## Parameters

### message

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

Message containing event

### minDifficulty

`number`

Minimum required difficulty

### logger

[`Logger`](../type-aliases/Logger.md)

Logger instance

## Returns

`boolean`

True if proof of work is valid

## Defined in

[nips/nip-13.ts:77](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L77)
