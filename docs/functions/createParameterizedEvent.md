[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createParameterizedEvent

# Function: createParameterizedEvent()

> **createParameterizedEvent**(`kind`, `content`, `identifier`, `additionalTags?`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-33.ts:31](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-33.ts#L31)

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

### additionalTags?

`string`[][] = `[]`

Additional tags

## Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Parameterized replaceable event
