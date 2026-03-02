[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / DeletionSubscriptionManager

# Interface: DeletionSubscriptionManager

Defined in: [nips/nip-09.ts:229](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L229)

Event deletion subscription manager interface

## Methods

### subscribeToDeletions()

> **subscribeToDeletions**(`eventIds`): `NostrSubscriptionEvent`

Defined in: [nips/nip-09.ts:235](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L235)

Creates a subscription for deletion events

#### Parameters

##### eventIds

`string`[]

Event IDs to monitor

#### Returns

`NostrSubscriptionEvent`

Subscription message

***

### subscribeToUserDeletions()

> **subscribeToUserDeletions**(`pubkey`): `NostrSubscriptionEvent`

Defined in: [nips/nip-09.ts:242](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L242)

Creates a subscription for all deletions by a user

#### Parameters

##### pubkey

`string`

Public key of user

#### Returns

`NostrSubscriptionEvent`

Subscription message
