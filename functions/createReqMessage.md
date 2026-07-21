[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createReqMessage

# Function: createReqMessage()

> **createReqMessage**(`subscriptionId`, `filters`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-01.ts:98](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-01.ts#L98)

Creates a REQ message: ["REQ", <subscriptionId>, <filter1>, <filter2>, ...]

## Parameters

### subscriptionId

`string`

### filters

`Record`\<`string`, `unknown`\>[]

## Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)
