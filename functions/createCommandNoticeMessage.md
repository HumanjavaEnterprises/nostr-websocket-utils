[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createCommandNoticeMessage

# Function: createCommandNoticeMessage()

> **createCommandNoticeMessage**(`code`, `message`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-20.ts:120](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-20.ts#L120)

Creates a NOTICE message: ["NOTICE", <message>] per NIP-01.
The optional code is prefixed into the human-readable message.

## Parameters

### code

[`CommandStatus`](../enumerations/CommandStatus.md)

### message

`string`

## Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)
