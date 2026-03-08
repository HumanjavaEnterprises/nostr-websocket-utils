[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / verifyNIP05Identifier

# Function: verifyNIP05Identifier()

> **verifyNIP05Identifier**(`identifier`, `pubkey`, `logger`): `Promise`\<[`NIP05VerificationResult`](../interfaces/NIP05VerificationResult.md)\>

Defined in: [nips/nip-05.ts:35](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-05.ts#L35)

Verifies a NIP-05 identifier

## Parameters

### identifier

`string`

Internet identifier (user@domain.com)

### pubkey

`string`

Public key to verify

### logger

`Logger`

Logger instance

## Returns

`Promise`\<[`NIP05VerificationResult`](../interfaces/NIP05VerificationResult.md)\>

Verification result
