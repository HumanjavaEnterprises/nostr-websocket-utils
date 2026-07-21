[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / ContactListManager

# Interface: ContactListManager

Defined in: [nips/nip-02.ts:106](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L106)

Contact list manager interface

## Methods

### addContact()

> **addContact**(`contact`): `void`

Defined in: [nips/nip-02.ts:111](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L111)

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

Defined in: [nips/nip-02.ts:117](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L117)

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

Defined in: [nips/nip-02.ts:124](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L124)

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

Defined in: [nips/nip-02.ts:130](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L130)

Gets all contacts

#### Returns

[`Contact`](Contact.md)[]

Array of all contacts

***

### updateContactMetadata()

> **updateContactMetadata**(`pubkey`, `metadata`): `void`

Defined in: [nips/nip-02.ts:137](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L137)

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

Defined in: [nips/nip-02.ts:143](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-02.ts#L143)

Creates a contact list event

#### Returns

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Contact list event
