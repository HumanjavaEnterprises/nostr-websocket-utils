[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / validateRelayCapabilities

# Function: validateRelayCapabilities()

> **validateRelayCapabilities**(`info`, `requiredNips`, `requiredFeatures`): `boolean`

Validates relay capabilities against required features

## Parameters

### info

[`RelayInformation`](../interfaces/RelayInformation.md)

Relay information

### requiredNips

`number`[] = `[]`

Required NIPs

### requiredFeatures

`Partial`\<`undefined` \| \{ `max_message_length`: `number`; `max_subscriptions`: `number`; `max_filters`: `number`; `max_limit`: `number`; `max_subid_length`: `number`; `min_prefix`: `number`; `max_event_tags`: `number`; `max_content_length`: `number`; `min_pow_difficulty`: `number`; `auth_required`: `boolean`; `payment_required`: `boolean`; \}\> = `{}`

Required relay features

## Returns

`boolean`

True if relay supports all required features

## Defined in

[nips/nip-11.ts:126](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-11.ts#L126)
