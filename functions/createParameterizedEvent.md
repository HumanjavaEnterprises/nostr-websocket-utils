[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createParameterizedEvent

# Function: createParameterizedEvent()

> **createParameterizedEvent**(`kind`, `content`, `identifier`, `additionalTags`): [`NostrWSMessage`](../interfaces/NostrWSMessage.md)

Creates a parameterized replaceable event

## Parameters

### kind

`number`

Event kind

### content

`string`

Event content

### identifier

`string`

Unique identifier for the parameter

### additionalTags

`string`[][] = `[]`

Additional tags

## Returns

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

Parameterized replaceable event

## Defined in

[nips/nip-33.ts:31](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L31)
