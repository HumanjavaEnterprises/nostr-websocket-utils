[**nostr-websocket-utils v0.5.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / validateMessage

# Function: validateMessage()

> **validateMessage**(`message`): `boolean`

Defined in: [nips/nip-01.ts:32](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-01.ts#L32)

Validates a message according to NIP-01 wire specifications.
Accepts both client->relay messages (EVENT / REQ / CLOSE) and
relay->client control messages (NOTICE / EOSE / OK / CLOSED) whose
second element is a string or boolean rather than an object.

## Parameters

### message

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

## Returns

`boolean`
