[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / Nip46Transport

# Class: Nip46Transport

Defined in: [nips/nip-46.ts:61](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L61)

A thin transport layer that bridges nostr-crypto-utils NIP-46 protocol
with the WebSocket relay infrastructure in this library.

Usage:
```ts
const client = new NostrWSClient(['wss://relay.example.com']);
await client.connect();

const session = nip46.createSession(remotePubkey);
const transport = new Nip46Transport(client, session);

// Send a connect request
const connectReq = nip46.connectRequest(remotePubkey, secret);
const result = await transport.sendRequest(connectReq);
```

## Constructors

### Constructor

> **new Nip46Transport**(`client`, `session`, `options?`): `Nip46Transport`

Defined in: [nips/nip-46.ts:66](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L66)

#### Parameters

##### client

[`NostrWSClient`](NostrWSClient.md)

##### session

`Nip46Session`

##### options?

[`Nip46TransportOptions`](../interfaces/Nip46TransportOptions.md) = `{}`

#### Returns

`Nip46Transport`

## Properties

### client

> `private` **client**: [`NostrWSClient`](NostrWSClient.md)

Defined in: [nips/nip-46.ts:62](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L62)

***

### session

> `private` **session**: `Nip46Session`

Defined in: [nips/nip-46.ts:63](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L63)

***

### timeout

> `private` **timeout**: `number`

Defined in: [nips/nip-46.ts:64](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L64)

## Methods

### subscribe()

> **subscribe**(`subscriptionId`, `since?`): `Promise`\<[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)\>

Defined in: [nips/nip-46.ts:83](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L83)

Subscribe for NIP-46 response events addressed to our ephemeral pubkey.
This sends a REQ message to the relay with the appropriate filter.

#### Parameters

##### subscriptionId

`string`

Subscription ID for the REQ message

##### since?

`number`

Optional since timestamp for the filter

#### Returns

`Promise`\<[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)\>

The subscription message that was sent

***

### publishRequest()

> **publishRequest**(`request`): `Promise`\<`SignedNostrEvent`\>

Defined in: [nips/nip-46.ts:99](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L99)

Wrap and publish a NIP-46 request as a kind 24133 event.

#### Parameters

##### request

`Nip46Request`

NIP-46 JSON-RPC request

#### Returns

`Promise`\<`SignedNostrEvent`\>

The signed kind 24133 event that was published

***

### unwrapEvent()

> **unwrapEvent**(`event`): `Nip46Response` \| `Nip46Request` \| `null`

Defined in: [nips/nip-46.ts:118](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L118)

Attempt to unwrap a kind 24133 event into a NIP-46 request or response.
Returns null if the event is not kind 24133 or decryption fails.

#### Parameters

##### event

`SignedNostrEvent`

A signed Nostr event

#### Returns

`Nip46Response` \| `Nip46Request` \| `null`

Decrypted NIP-46 payload, or null on failure

***

### getResponseFilter()

> **getResponseFilter**(`since?`): `object`

Defined in: [nips/nip-46.ts:134](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L134)

Get the NIP-46 response filter for this session.
Useful for manual subscription management.

#### Parameters

##### since?

`number`

Optional since timestamp

#### Returns

`object`

Filter object for kind 24133 events tagged to our pubkey

##### kinds

> **kinds**: `number`[]

##### #p

> **#p**: `string`[]

##### since?

> `optional` **since**: `number`

***

### getSessionInfo()

> **getSessionInfo**(): `object`

Defined in: [nips/nip-46.ts:142](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-46.ts#L142)

Get the current session (read-only info).

#### Returns

`object`

The session's client and remote pubkeys

##### clientPubkey

> **clientPubkey**: `string`

##### remotePubkey

> **remotePubkey**: `string`
