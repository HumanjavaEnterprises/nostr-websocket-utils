[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createEncryptedDM

# Function: createEncryptedDM()

> **createEncryptedDM**(`content`, `recipientPubkey`, `senderPrivkey`, `tags`): `Promise`\<[`NostrWSMessage`](../interfaces/NostrWSMessage.md)\>

Creates an encrypted direct message event

## Parameters

### content

`string`

Message content to encrypt

### recipientPubkey

`string`

Recipient's public key

### senderPrivkey

`string`

Sender's private key

### tags

`string`[][] = `[]`

Additional tags for the event

## Returns

`Promise`\<[`NostrWSMessage`](../interfaces/NostrWSMessage.md)\>

Encrypted message event

## Defined in

[nips/nip-04.ts:24](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-04.ts#L24)
