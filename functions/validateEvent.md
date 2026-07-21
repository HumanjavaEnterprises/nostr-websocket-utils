[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / validateEvent

# Function: validateEvent()

> **validateEvent**(`event`): `NostrEventValidationResult`

Defined in: [nips/nip-01.ts:124](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-01.ts#L124)

Validates a Nostr event according to NIP-01.
Uses strict type checks (never truthiness) so valid kind:0, empty-content,
and created_at:0 events pass, and enforces hex format on id/pubkey/sig.

## Parameters

### event

`NostrEvent`

## Returns

`NostrEventValidationResult`
