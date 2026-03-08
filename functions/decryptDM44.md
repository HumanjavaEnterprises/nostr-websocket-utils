[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / decryptDM44

# Function: decryptDM44()

> **decryptDM44**(`message`, `recipientPrivkey`, `senderPubkey`, `logger`): `string`

Defined in: [nips/nip-44.ts:112](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-44.ts#L112)

Decrypts a received direct message event encrypted with NIP-44

## Parameters

### message

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Received message

### recipientPrivkey

`string`

Recipient's private key (hex)

### senderPubkey

`string`

Sender's public key (hex)

### logger

[`Logger`](../type-aliases/Logger.md)

Logger instance

## Returns

`string`

Decrypted message content
