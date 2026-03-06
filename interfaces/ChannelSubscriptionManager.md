[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ChannelSubscriptionManager

# Interface: ChannelSubscriptionManager

Defined in: [nips/nip-28.ts:178](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L178)

Channel subscription manager interface

## Methods

### subscribe()

> **subscribe**(`channelId`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-28.ts:184](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L184)

Subscribes to a channel

#### Parameters

##### channelId

`string`

Channel ID

#### Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Subscription message

***

### unsubscribe()

> **unsubscribe**(`channelId`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-28.ts:191](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L191)

Unsubscribes from a channel

#### Parameters

##### channelId

`string`

Channel ID

#### Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Unsubscribe message

***

### getMetadata()

> **getMetadata**(`channelId`): `Promise`\<[`ChannelMetadata`](ChannelMetadata.md) \| `undefined`\>

Defined in: [nips/nip-28.ts:198](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L198)

Gets channel metadata

#### Parameters

##### channelId

`string`

Channel ID

#### Returns

`Promise`\<[`ChannelMetadata`](ChannelMetadata.md) \| `undefined`\>

Channel metadata
