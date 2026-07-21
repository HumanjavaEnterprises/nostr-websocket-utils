[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createContactListSubscription

# Function: createContactListSubscription()

> **createContactListSubscription**(`pubkey`, `subscriptionId?`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-02.ts:93](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L93)

Creates a contact list subscription message.

## Parameters

### pubkey

`string`

Public key to subscribe to

### subscriptionId?

`string` = `...`

Optional subscription id; auto-generated from the
  pubkey when omitted (NIP-01 REQ requires a subscription id).

## Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Positional REQ: ["REQ", <subId>, <filter>]
