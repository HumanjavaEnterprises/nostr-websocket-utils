[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / Nip46TransportResult

# Interface: Nip46TransportResult

Defined in: [nips/nip-46.ts:37](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L37)

Result of sending a NIP-46 request

## Properties

### response

> **response**: `Nip46Response`

Defined in: [nips/nip-46.ts:39](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L39)

The JSON-RPC response from the remote signer

***

### rawEvent

> **rawEvent**: `SignedNostrEvent`

Defined in: [nips/nip-46.ts:41](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L41)

The raw kind 24133 event that carried the response
