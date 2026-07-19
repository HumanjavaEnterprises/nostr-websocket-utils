"use strict";
/**
 * @file NIP-26: Delegated Event Signing
 * @module nips/nip-26
 * @see https://github.com/nostr-protocol/nips/blob/master/26.md
 *
 * A delegation token is a BIP-340 schnorr signature over
 * sha256(utf8("nostr:delegation:<delegatee>:<conditions>")), NOT an event
 * signature. Both creation and verification serialize the conditions the same
 * way and hash the same string, so tokens round-trip and interoperate with
 * nostr-tools / nak / relays enforcing NIP-26.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeConditions = serializeConditions;
exports.parseConditions = parseConditions;
exports.createDelegation = createDelegation;
exports.verifyDelegation = verifyDelegation;
exports.addDelegationTag = addDelegationTag;
exports.extractDelegation = extractDelegation;
exports.validateDelegatedEvent = validateDelegatedEvent;
const secp256k1_js_1 = require("@noble/curves/secp256k1.js");
const sha2_js_1 = require("@noble/hashes/sha2.js");
const utils_js_1 = require("@noble/hashes/utils.js");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.getLogger)('NIP-26');
/**
 * Serialize delegation conditions into the NIP-26 query string grammar,
 * e.g. "kind=1&created_at>1700000000&created_at<1800000000".
 */
function serializeConditions(conditions) {
    const parts = [];
    if (conditions.kind !== undefined) {
        parts.push(`kind=${conditions.kind}`);
    }
    if (conditions.since !== undefined) {
        parts.push(`created_at>${conditions.since}`);
    }
    if (conditions.until !== undefined) {
        parts.push(`created_at<${conditions.until}`);
    }
    return parts.join('&');
}
/**
 * Parse the NIP-26 conditions query string back into structured conditions.
 */
function parseConditions(conditionsString) {
    const conditions = {};
    if (!conditionsString)
        return conditions;
    for (const part of conditionsString.split('&')) {
        if (part.startsWith('kind=')) {
            conditions.kind = parseInt(part.slice('kind='.length), 10);
        }
        else if (part.startsWith('created_at>')) {
            conditions.since = parseInt(part.slice('created_at>'.length), 10);
        }
        else if (part.startsWith('created_at<')) {
            conditions.until = parseInt(part.slice('created_at<'.length), 10);
        }
    }
    return conditions;
}
function delegationDigest(delegateePubkey, conditionsString) {
    return (0, sha2_js_1.sha256)((0, utils_js_1.utf8ToBytes)(`nostr:delegation:${delegateePubkey}:${conditionsString}`));
}
/**
 * Create a delegation token: schnorr(sha256("nostr:delegation:<delegatee>:<conditions>")).
 * @returns The hex-encoded delegation token.
 */
async function createDelegation(delegatorPrivkey, delegateePubkey, conditions) {
    try {
        const conditionsString = serializeConditions(conditions);
        const digest = delegationDigest(delegateePubkey, conditionsString);
        const signature = secp256k1_js_1.schnorr.sign(digest, (0, utils_js_1.hexToBytes)(delegatorPrivkey));
        return (0, utils_js_1.bytesToHex)(signature);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to create delegation: ${errorMessage}`);
        throw new Error(`Failed to create delegation: ${errorMessage}`);
    }
}
/**
 * Verify a delegation token against the delegator's public key.
 */
async function verifyDelegation(delegatorPubkey, delegateePubkey, token, conditions) {
    try {
        const conditionsString = serializeConditions(conditions);
        const digest = delegationDigest(delegateePubkey, conditionsString);
        return secp256k1_js_1.schnorr.verify((0, utils_js_1.hexToBytes)(token), digest, (0, utils_js_1.hexToBytes)(delegatorPubkey));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to verify delegation: ${errorMessage}`);
        return false;
    }
}
/**
 * Add a delegation tag to an event.
 * The tag carries the NIP-26 conditions string verbatim.
 */
function addDelegationTag(event, delegation) {
    const conditionsString = serializeConditions(delegation.conditions);
    const delegationTag = ['delegation', delegation.pubkey, conditionsString, delegation.token];
    return {
        ...event,
        tags: [...event.tags, delegationTag]
    };
}
/**
 * Extract delegation from an event.
 */
function extractDelegation(event) {
    try {
        const delegationTag = event.tags.find(tag => tag[0] === 'delegation');
        if (!delegationTag || delegationTag.length !== 4) {
            return null;
        }
        const [, pubkey, conditionsString, token] = delegationTag;
        return { pubkey, conditions: parseConditions(conditionsString), token };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to extract delegation: ${errorMessage}`);
        return null;
    }
}
/**
 * Validate a delegated event: check conditions then verify the delegation token.
 */
async function validateDelegatedEvent(event) {
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
        // Check time constraints (created_at>since, created_at<until)
        if (since !== undefined && created_at <= since) {
            logger.debug('Event is not after delegation start time');
            return false;
        }
        if (until !== undefined && created_at >= until) {
            logger.debug('Event is not before delegation end time');
            return false;
        }
        // Verify delegation token — delegator signs, delegatee is this event's author.
        return await verifyDelegation(delegation.pubkey, event.pubkey, delegation.token, delegation.conditions);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to validate delegated event: ${errorMessage}`);
        return false;
    }
}
//# sourceMappingURL=nip-26.js.map