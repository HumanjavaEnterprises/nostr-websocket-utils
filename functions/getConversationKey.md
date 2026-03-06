[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / getConversationKey

# Function: getConversationKey()

> **getConversationKey**(`senderPrivkeyHex`, `recipientPubkeyHex`): `Uint8Array`

Defined in: [nips/nip-44.ts:30](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-44.ts#L30)

Creates a NIP-44 conversation key from a sender's private key and recipient's public key.
This key is symmetric and reusable for all messages in the conversation.

## Parameters

### senderPrivkeyHex

`string`

Sender's private key in hex

### recipientPubkeyHex

`string`

Recipient's public key in hex

## Returns

`Uint8Array`

Conversation key as Uint8Array
