/**
 * @file NIP-26: Delegated Event Signing
 * @module nips/nip-26
 */
import { getLogger } from '../utils/logger.js';
import { signEvent, verifySignature } from 'nostr-crypto-utils';
const logger = getLogger('NIP-26');
/**
 * Create a delegation token
 */
export async function createDelegation(delegatorPrivkey, delegateePubkey, conditions) {
    try {
        const conditionsString = Object.entries(conditions)
            .map(([key, value]) => `${key}=${value}`)
            .sort()
            .join('&');
        const message = `nostr:delegation:${delegateePubkey}:${conditionsString}`;
        // Create a NostrEvent object for signing
        const event = {
            id: '', // This will be set by signEvent
            pubkey: delegateePubkey,
            created_at: Math.floor(Date.now() / 1000),
            kind: 0, // Using kind 0 for delegation events
            tags: [],
            content: message,
            sig: '' // This will be set by signEvent
        };
        const signedEvent = await signEvent(event, delegatorPrivkey);
        return signedEvent.sig;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to create delegation: ${errorMessage}`);
        throw new Error(`Failed to create delegation: ${errorMessage}`);
    }
}
/**
 * Verify a delegation token
 */
export async function verifyDelegation(delegatorPubkey, delegateePubkey, token, conditions) {
    try {
        const conditionsString = Object.entries(conditions)
            .map(([key, value]) => `${key}=${value}`)
            .sort()
            .join('&');
        const message = `nostr:delegation:${delegateePubkey}:${conditionsString}`;
        const verificationEvent = {
            id: '',
            pubkey: delegatorPubkey,
            created_at: Math.floor(Date.now() / 1000),
            kind: 0,
            tags: [],
            content: message,
            sig: token
        };
        return await verifySignature(verificationEvent);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to verify delegation: ${errorMessage}`);
        return false;
    }
}
/**
 * Add delegation tag to an event
 */
export function addDelegationTag(event, delegation) {
    const conditionsString = Object.entries(delegation.conditions)
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join('&');
    const delegationTag = ['delegation', delegation.pubkey, conditionsString, delegation.token];
    return {
        ...event,
        tags: [...event.tags, delegationTag]
    };
}
/**
 * Extract delegation from an event
 */
export function extractDelegation(event) {
    try {
        const delegationTag = event.tags.find(tag => tag[0] === 'delegation');
        if (!delegationTag || delegationTag.length !== 4) {
            return null;
        }
        const [, pubkey, conditionsString, token] = delegationTag;
        const conditions = {};
        conditionsString.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key === 'kind' || key === 'since' || key === 'until') {
                conditions[key] = parseInt(value, 10);
            }
            else {
                conditions[key] = value;
            }
        });
        return { pubkey, conditions, token };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to extract delegation: ${errorMessage}`);
        return null;
    }
}
/**
 * Validate a delegated event
 */
export async function validateDelegatedEvent(event) {
    try {
        const delegation = extractDelegation(event);
        if (!delegation) {
            return false;
        }
        const { kind, created_at } = event;
        const { kind: allowedKind, since, until } = delegation.conditions;
        // Check kind constraint
        if (allowedKind !== undefined && kind !== allowedKind) {
            logger.debug('Event kind does not match delegation conditions');
            return false;
        }
        // Check time constraints
        if (since !== undefined && created_at < since) {
            logger.debug('Event is before delegation start time');
            return false;
        }
        if (until !== undefined && created_at > until) {
            logger.debug('Event is after delegation end time');
            return false;
        }
        // Verify delegation token
        return await verifyDelegation(delegation.pubkey, event.pubkey, delegation.token, delegation.conditions);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to validate delegated event: ${errorMessage}`);
        return false;
    }
}
//# sourceMappingURL=nip-26.js.map