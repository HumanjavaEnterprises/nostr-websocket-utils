[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ENCRYPTED\_DM\_KIND\_44

# Variable: ENCRYPTED\_DM\_KIND\_44

> `const` **ENCRYPTED\_DM\_KIND\_44**: `44` = `44`

Defined in: [nips/nip-44.ts:21](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-44.ts#L21)

Kind value for NIP-44 encrypted direct messages (gift-wrapped DMs use kind 14,
but for parity with NIP-04 kind 4 usage, callers may choose their own kind).
NIP-44 itself is a payload format, not a kind — the kind depends on the use case.
We default to kind 44 as a convenience constant; callers should override as needed.
