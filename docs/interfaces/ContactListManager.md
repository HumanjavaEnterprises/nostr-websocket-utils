[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ContactListManager

# Interface: ContactListManager

Contact list manager interface

## Methods

### addContact()

> **addContact**(`contact`): `void`

Adds or updates a contact

#### Parameters

##### contact

[`Contact`](Contact.md)

Contact to add/update

#### Returns

`void`

#### Defined in

[nips/nip-02.ts:119](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L119)

***

### removeContact()

> **removeContact**(`pubkey`): `void`

Removes a contact

#### Parameters

##### pubkey

`string`

Public key of contact to remove

#### Returns

`void`

#### Defined in

[nips/nip-02.ts:125](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L125)

***

### getContact()

> **getContact**(`pubkey`): `undefined` \| [`Contact`](Contact.md)

Gets a contact by public key

#### Parameters

##### pubkey

`string`

Public key to look up

#### Returns

`undefined` \| [`Contact`](Contact.md)

Contact if found

#### Defined in

[nips/nip-02.ts:132](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L132)

***

### getAllContacts()

> **getAllContacts**(): [`Contact`](Contact.md)[]

Gets all contacts

#### Returns

[`Contact`](Contact.md)[]

Array of all contacts

#### Defined in

[nips/nip-02.ts:138](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L138)

***

### updateContactMetadata()

> **updateContactMetadata**(`pubkey`, `metadata`): `void`

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

#### Defined in

[nips/nip-02.ts:145](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L145)

***

### createEvent()

> **createEvent**(): [`NostrWSMessage`](NostrWSMessage.md)

Creates a contact list event

#### Returns

[`NostrWSMessage`](NostrWSMessage.md)

Contact list event

#### Defined in

[nips/nip-02.ts:151](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L151)
