[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / encryptNip44

# Function: encryptNip44()

> **encryptNip44**(`plaintext`, `senderPrivkeyHex`, `recipientPubkeyHex`): `string`

Defined in: [nips/nip-44.ts:45](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-44.ts#L45)

Encrypts a message using NIP-44

## Parameters

### plaintext

`string`

Message content to encrypt

### senderPrivkeyHex

`string`

Sender's private key in hex

### recipientPubkeyHex

`string`

Recipient's public key in hex

## Returns

`string`

Encrypted payload string (base64)
