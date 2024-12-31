[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ChannelSubscriptionManager

# Interface: ChannelSubscriptionManager

Channel subscription manager interface

## Methods

### subscribe()

> **subscribe**(`channelId`): [`NostrWSMessage`](NostrWSMessage.md)

Subscribes to a channel

#### Parameters

##### channelId

`string`

Channel ID

#### Returns

[`NostrWSMessage`](NostrWSMessage.md)

Subscription message

#### Defined in

[nips/nip-28.ts:201](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L201)

***

### unsubscribe()

> **unsubscribe**(`channelId`): [`NostrWSMessage`](NostrWSMessage.md)

Unsubscribes from a channel

#### Parameters

##### channelId

`string`

Channel ID

#### Returns

[`NostrWSMessage`](NostrWSMessage.md)

Unsubscribe message

#### Defined in

[nips/nip-28.ts:208](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L208)

***

### getMetadata()

> **getMetadata**(`channelId`): `Promise`\<`undefined` \| [`ChannelMetadata`](ChannelMetadata.md)\>

Gets channel metadata

#### Parameters

##### channelId

`string`

Channel ID

#### Returns

`Promise`\<`undefined` \| [`ChannelMetadata`](ChannelMetadata.md)\>

Channel metadata

#### Defined in

[nips/nip-28.ts:215](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L215)
