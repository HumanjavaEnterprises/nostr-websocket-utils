[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / createTimeValidator

# Function: createTimeValidator()

> **createTimeValidator**(`logger`, `futureLimitSeconds`, `pastLimitSeconds`): [`TimeValidator`](../interfaces/TimeValidator.md)

Creates a time validator

## Parameters

### logger

[`Logger`](../type-aliases/Logger.md)

Logger instance

### futureLimitSeconds

`number` = `DEFAULT_TIME_LIMITS.FUTURE_LIMIT`

Future time limit in seconds

### pastLimitSeconds

`number` = `DEFAULT_TIME_LIMITS.PAST_LIMIT`

Past time limit in seconds

## Returns

[`TimeValidator`](../interfaces/TimeValidator.md)

Time validator

## Defined in

[nips/nip-22.ts:57](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-22.ts#L57)
