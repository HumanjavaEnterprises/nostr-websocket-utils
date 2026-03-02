[**nostr-websocket-utils v0.3.16**](../README.md)

***

[nostr-websocket-utils](../globals.md) / validateEventTime

# Function: validateEventTime()

> **validateEventTime**(`message`, `validator`, `logger`): [`TimeValidationResult`](../interfaces/TimeValidationResult.md)

Defined in: [nips/nip-22.ts:107](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L107)

Validates event timestamp

## Parameters

### message

[`NostrWSMessage`](../type-aliases/NostrWSMessage.md)

Message to validate

### validator

[`TimeValidator`](../interfaces/TimeValidator.md)

Time validator

### logger

[`Logger`](../type-aliases/Logger.md)

Logger instance

## Returns

[`TimeValidationResult`](../interfaces/TimeValidationResult.md)

Validation result
