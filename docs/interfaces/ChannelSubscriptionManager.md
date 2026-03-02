[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ChannelSubscriptionManager

# Interface: ChannelSubscriptionManager

Defined in: [nips/nip-28.ts:186](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L186)

Channel subscription manager interface

## Methods

### subscribe()

> **subscribe**(`channelId`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-28.ts:192](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L192)

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

Defined in: [nips/nip-28.ts:199](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L199)

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

Defined in: [nips/nip-28.ts:206](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L206)

Gets channel metadata

#### Parameters

##### channelId

`string`

Channel ID

#### Returns

`Promise`\<[`ChannelMetadata`](ChannelMetadata.md) \| `undefined`\>

Channel metadata
