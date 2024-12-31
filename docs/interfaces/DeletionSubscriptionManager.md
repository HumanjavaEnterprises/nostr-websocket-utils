[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / DeletionSubscriptionManager

# Interface: DeletionSubscriptionManager

Event deletion subscription manager interface

## Methods

### subscribeToDeletions()

> **subscribeToDeletions**(`eventIds`): [`NostrSubscriptionEvent`](NostrSubscriptionEvent.md)

Creates a subscription for deletion events

#### Parameters

##### eventIds

`string`[]

Event IDs to monitor

#### Returns

[`NostrSubscriptionEvent`](NostrSubscriptionEvent.md)

Subscription message

#### Defined in

[nips/nip-09.ts:253](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L253)

***

### subscribeToUserDeletions()

> **subscribeToUserDeletions**(`pubkey`): [`NostrSubscriptionEvent`](NostrSubscriptionEvent.md)

Creates a subscription for all deletions by a user

#### Parameters

##### pubkey

`string`

Public key of user

#### Returns

[`NostrSubscriptionEvent`](NostrSubscriptionEvent.md)

Subscription message

#### Defined in

[nips/nip-09.ts:260](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-09.ts#L260)
