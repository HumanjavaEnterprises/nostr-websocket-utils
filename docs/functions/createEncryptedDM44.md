[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createEncryptedDM44

# Function: createEncryptedDM44()

> **createEncryptedDM44**(`content`, `recipientPubkey`, `senderPrivkey`, `tags?`, `kind?`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-44.ts:79](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-44.ts#L79)

Creates an encrypted direct message event using NIP-44

## Parameters

### content

`string`

Message content to encrypt

### recipientPubkey

`string`

Recipient's public key (hex)

### senderPrivkey

`string`

Sender's private key (hex)

### tags?

`string`[][] = `[]`

Additional tags for the event

### kind?

`number` = `ENCRYPTED_DM_KIND_44`

Event kind (defaults to ENCRYPTED_DM_KIND_44)

## Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Encrypted message event as NostrWSMessage
