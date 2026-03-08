[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ContactListManager

# Interface: ContactListManager

Defined in: [nips/nip-02.ts:103](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L103)

Contact list manager interface

## Methods

### addContact()

> **addContact**(`contact`): `void`

Defined in: [nips/nip-02.ts:108](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L108)

Adds or updates a contact

#### Parameters

##### contact

[`Contact`](Contact.md)

Contact to add/update

#### Returns

`void`

***

### removeContact()

> **removeContact**(`pubkey`): `void`

Defined in: [nips/nip-02.ts:114](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L114)

Removes a contact

#### Parameters

##### pubkey

`string`

Public key of contact to remove

#### Returns

`void`

***

### getContact()

> **getContact**(`pubkey`): [`Contact`](Contact.md) \| `undefined`

Defined in: [nips/nip-02.ts:121](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L121)

Gets a contact by public key

#### Parameters

##### pubkey

`string`

Public key to look up

#### Returns

[`Contact`](Contact.md) \| `undefined`

Contact if found

***

### getAllContacts()

> **getAllContacts**(): [`Contact`](Contact.md)[]

Defined in: [nips/nip-02.ts:127](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L127)

Gets all contacts

#### Returns

[`Contact`](Contact.md)[]

Array of all contacts

***

### updateContactMetadata()

> **updateContactMetadata**(`pubkey`, `metadata`): `void`

Defined in: [nips/nip-02.ts:134](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L134)

Updates contact metadata

#### Parameters

##### pubkey

`string`

Public key of contact

##### metadata

`Record`\<`string`, `unknown`\>

New metadata

#### Returns

`void`

***

### createEvent()

> **createEvent**(): [`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Defined in: [nips/nip-02.ts:140](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L140)

Creates a contact list event

#### Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Contact list event
