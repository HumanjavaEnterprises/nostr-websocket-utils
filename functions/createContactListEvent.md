[**nostr-websocket-utils v0.4.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createContactListEvent

# Function: createContactListEvent()

> **createContactListEvent**(`contacts`, `metadata?`): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-02.ts:31](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L31)

Creates a contact list event

## Parameters

### contacts

[`Contact`](../interfaces/Contact.md)[]

List of contacts

### metadata?

`Record`\<`string`, `unknown`\> = `{}`

Optional metadata for the contact list

## Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Contact list event
