[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / validateSignature

# Function: validateSignature()

> **validateSignature**(`message`, `logger?`): `Promise`\<`boolean`\>

Defined in: [crypto/handlers.ts:60](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/crypto/handlers.ts#L60)

Cryptographically validates an EVENT message's signature.

SECURITY: this performs real BIP-340 verification via nostr-crypto-utils
(validateEvent + verifySignature). It returns a Promise<boolean> and returns
`false` for non-EVENT messages (a non-EVENT message is not a validly-signed
event, so callers gating inbound events must not treat it as valid).

## Parameters

### message

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Message to validate

### logger?

Logger instance

#### debug

(...`a`) => `void`

#### error

(...`a`) => `void`

## Returns

`Promise`\<`boolean`\>

Promise resolving to true only if the event's signature verifies
