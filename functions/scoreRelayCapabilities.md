[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / scoreRelayCapabilities

# Function: scoreRelayCapabilities()

> **scoreRelayCapabilities**(`info`, `preferences`): `number`

Creates a relay selection score based on capabilities

## Parameters

### info

[`RelayInformation`](../interfaces/RelayInformation.md)

Relay information

### preferences

Scoring preferences

#### preferredNips

`number`[]

#### minMessageLength

`number`

#### minSubscriptions

`number`

#### requireAuth

`boolean`

#### requirePayment

`boolean`

## Returns

`number`

Relay score (higher is better)

## Defined in

[nips/nip-11.ts:171](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-11.ts#L171)
