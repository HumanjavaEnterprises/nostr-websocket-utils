[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createChannelMessage

# Function: createChannelMessage()

> **createChannelMessage**(`channelId`, `content`, `replyTo?`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-28.ts:56](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L56)

Creates a channel message

## Parameters

### channelId

`string`

Channel ID

### content

`string`

Message content

### replyTo?

`string`

Optional ID of message being replied to

## Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Channel message event
