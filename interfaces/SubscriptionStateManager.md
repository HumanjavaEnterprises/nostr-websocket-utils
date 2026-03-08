[**nostr-websocket-utils v0.4.1**](../README.md)

***

[nostr-websocket-utils](../globals.md) / SubscriptionStateManager

# Interface: SubscriptionStateManager

Defined in: [nips/nip-15.ts:22](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L22)

Subscription state manager interface

## Methods

### registerSubscription()

> **registerSubscription**(`subscriptionId`, `filter`): `void`

Defined in: [nips/nip-15.ts:28](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L28)

Registers a new subscription

#### Parameters

##### subscriptionId

`string`

Subscription ID

##### filter

`Record`\<`string`, `unknown`\>

Subscription filter

#### Returns

`void`

***

### markComplete()

> **markComplete**(`subscriptionId`): `void`

Defined in: [nips/nip-15.ts:37](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L37)

Marks a subscription as complete (EOSE sent)

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`void`

***

### isComplete()

> **isComplete**(`subscriptionId`): `boolean`

Defined in: [nips/nip-15.ts:44](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L44)

Checks if a subscription is complete

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`boolean`

True if EOSE has been sent

***

### getFilter()

> **getFilter**(`subscriptionId`): `Record`\<`string`, `unknown`\> \| `undefined`

Defined in: [nips/nip-15.ts:51](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L51)

Gets subscription filter

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

Subscription filter

***

### removeSubscription()

> **removeSubscription**(`subscriptionId`): `void`

Defined in: [nips/nip-15.ts:57](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L57)

Removes a subscription

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`void`
