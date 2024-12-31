[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ChatMessageHandler

# Interface: ChatMessageHandler

Chat message handler interface

## Methods

### handleMessage()

> **handleMessage**(`message`): `Promise`\<`void`\>

Handles incoming chat message

#### Parameters

##### message

[`NostrWSMessage`](NostrWSMessage.md)

Chat message

#### Returns

`Promise`\<`void`\>

#### Defined in

[nips/nip-28.ts:113](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L113)

***

### handleModeration()

> **handleModeration**(`message`): `Promise`\<`void`\>

Handles message moderation

#### Parameters

##### message

[`NostrWSMessage`](NostrWSMessage.md)

Moderation message

#### Returns

`Promise`\<`void`\>

#### Defined in

[nips/nip-28.ts:120](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L120)
