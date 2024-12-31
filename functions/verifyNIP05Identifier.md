[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / verifyNIP05Identifier

# Function: verifyNIP05Identifier()

> **verifyNIP05Identifier**(`identifier`, `pubkey`, `logger`): `Promise`\<[`NIP05VerificationResult`](../interfaces/NIP05VerificationResult.md)\>

Verifies a NIP-05 identifier

## Parameters

### identifier

`string`

Internet identifier (user@domain.com)

### pubkey

`string`

Public key to verify

### logger

`any`

Logger instance

## Returns

`Promise`\<[`NIP05VerificationResult`](../interfaces/NIP05VerificationResult.md)\>

Verification result

## Defined in

[nips/nip-05.ts:34](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L34)
