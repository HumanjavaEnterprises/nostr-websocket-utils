[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ChatMessageHandler

# Interface: ChatMessageHandler

Defined in: [nips/nip-28.ts:98](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L98)

Chat message handler interface

## Methods

### handleMessage()

> **handleMessage**(`message`): `Promise`\<`void`\>

Defined in: [nips/nip-28.ts:104](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L104)

Handles incoming chat message

#### Parameters

##### message

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Chat message

#### Returns

`Promise`\<`void`\>

***

### handleModeration()

> **handleModeration**(`message`): `Promise`\<`void`\>

Defined in: [nips/nip-28.ts:111](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-28.ts#L111)

Handles message moderation

#### Parameters

##### message

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Moderation message

#### Returns

`Promise`\<`void`\>
