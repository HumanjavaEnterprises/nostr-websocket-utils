[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / decryptNip44

# Function: decryptNip44()

> **decryptNip44**(`payload`, `recipientPrivkeyHex`, `senderPubkeyHex`): `string`

Defined in: [nips/nip-44.ts:61](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-44.ts#L61)

Decrypts a NIP-44 encrypted payload

## Parameters

### payload

`string`

Encrypted payload string (base64)

### recipientPrivkeyHex

`string`

Recipient's private key in hex

### senderPubkeyHex

`string`

Sender's public key in hex

## Returns

`string`

Decrypted plaintext
