[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createDelegation

# Function: createDelegation()

> **createDelegation**(`delegatorPrivkey`, `delegateePubkey`, `conditions`): `Promise`\<`string`\>

Defined in: [nips/nip-26.ts:90](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-26.ts#L90)

Create a delegation token: schnorr(sha256("nostr:delegation:<delegatee>:<conditions>")).

## Parameters

### delegatorPrivkey

`string`

### delegateePubkey

`string`

### conditions

`DelegationConditions`

## Returns

`Promise`\<`string`\>

The hex-encoded delegation token.
