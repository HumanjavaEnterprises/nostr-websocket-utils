[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createOkMessage

# Function: createOkMessage()

> **createOkMessage**(`eventId`, `success?`, `message?`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-20.ts:112](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-20.ts#L112)

Creates an OK message: ["OK", <eventId>, <success>, <message>]
per NIP-20 / NIP-01. The message string defaults to empty.

## Parameters

### eventId

`string`

### success?

`boolean` = `true`

### message?

`string` = `''`

## Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)
