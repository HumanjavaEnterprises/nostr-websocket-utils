[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / PowResult

# Interface: PowResult

Defined in: [nips/nip-13.ts:33](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L33)

Result of mining proof of work.

## Properties

### id

> **id**: `string`

Defined in: [nips/nip-13.ts:35](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L35)

The mined event id (sha256 of the NIP-01 serialization including the nonce tag)

***

### nonce

> **nonce**: `number`

Defined in: [nips/nip-13.ts:37](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L37)

The winning nonce

***

### tags

> **tags**: `string`[][]

Defined in: [nips/nip-13.ts:39](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-13.ts#L39)

The event tags including the committed ["nonce", <n>, <target>] tag
