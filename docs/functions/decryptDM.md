[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / decryptDM

# Function: decryptDM()

> **decryptDM**(`message`, `recipientPrivkey`, `senderPubkey`, `logger`): `Promise`\<`string`\>

Decrypts a received direct message event

## Parameters

### message

[`NostrWSMessage`](../interfaces/NostrWSMessage.md)

Received message

### recipientPrivkey

`string`

Recipient's private key

### senderPubkey

`string`

Sender's public key

### logger

[`Logger`](../type-aliases/Logger.md)

Logger instance

## Returns

`Promise`\<`string`\>

Decrypted message content

## Defined in

[nips/nip-04.ts:57](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-04.ts#L57)
