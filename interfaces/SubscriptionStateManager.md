[**nostr-websocket-utils v0.3.0**](../README.md)

***

[nostr-websocket-utils](../globals.md) / SubscriptionStateManager

# Interface: SubscriptionStateManager

Subscription state manager interface

## Methods

### registerSubscription()

> **registerSubscription**(`subscriptionId`, `filter`): `void`

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

#### Defined in

[nips/nip-15.ts:33](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L33)

***

### markComplete()

> **markComplete**(`subscriptionId`): `void`

Marks a subscription as complete (EOSE sent)

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`void`

#### Defined in

[nips/nip-15.ts:42](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L42)

***

### isComplete()

> **isComplete**(`subscriptionId`): `boolean`

Checks if a subscription is complete

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`boolean`

True if EOSE has been sent

#### Defined in

[nips/nip-15.ts:49](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L49)

***

### getFilter()

> **getFilter**(`subscriptionId`): `undefined` \| `Record`\<`string`, `unknown`\>

Gets subscription filter

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`undefined` \| `Record`\<`string`, `unknown`\>

Subscription filter

#### Defined in

[nips/nip-15.ts:56](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L56)

***

### removeSubscription()

> **removeSubscription**(`subscriptionId`): `void`

Removes a subscription

#### Parameters

##### subscriptionId

`string`

Subscription ID

#### Returns

`void`

#### Defined in

[nips/nip-15.ts:62](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/src/nips/nip-15.ts#L62)
