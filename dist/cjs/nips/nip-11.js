"use strict";
/**
 * @file NIP-11: Relay Information Document
 * @module nips/nip-11
 * @see https://github.com/nostr-protocol/nips/blob/master/11.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelayInformation = getRelayInformation;
exports.checkRelayRequirements = checkRelayRequirements;
exports.validateRelayCapabilities = validateRelayCapabilities;
exports.scoreRelayCapabilities = scoreRelayCapabilities;
const logger_js_1 = require("../utils/logger.js");
const http_js_1 = require("../utils/http.js");
const logger = (0, logger_js_1.getLogger)('NIP-11');
/**
 * Fetches relay information document
 * @param url - Relay URL (ws:// or wss://)
 * @returns {Promise<RelayInformation>} Relay information
 */
async function getRelayInformation(url) {
    try {
        const relayUrl = url.replace('ws://', 'http://').replace('wss://', 'https://');
        const response = await (0, http_js_1.fetchJson)(`${relayUrl}/.well-known/nostr.json`);
        return response;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to fetch relay information: ${errorMessage}`);
        throw new Error(`Failed to fetch relay information: ${errorMessage}`);
    }
}
/**
 * Checks if relay meets requirements
 * @param relay - Relay information
 * @param requirements - Required relay features
 * @returns {boolean} True if relay meets all requirements
 */
function checkRelayRequirements(relay, requirements) {
    try {
        // Check supported NIPs
        if (requirements.supported_nips && relay.supported_nips) {
            const missingNips = requirements.supported_nips.filter(nip => !relay.supported_nips?.includes(nip));
            if (missingNips.length > 0) {
                logger.debug(`Missing required NIPs: ${missingNips.join(', ')}`);
                return false;
            }
        }
        // Check limitations
        if (requirements.limitation && relay.limitation) {
            for (const [key, value] of Object.entries(requirements.limitation)) {
                const relayValue = relay.limitation[key];
                // Skip if relay doesn't specify this limitation
                if (relayValue === undefined)
                    continue;
                // For maximum values, relay should support at least the required value
                if (key.startsWith('max_') && typeof relayValue === 'number' && typeof value === 'number') {
                    if (relayValue < value) {
                        logger.debug(`Relay ${key} too low: ${relayValue} < ${value}`);
                        return false;
                    }
                }
                // For minimum values, relay should not require more than specified
                if (key.startsWith('min_') && typeof relayValue === 'number' && typeof value === 'number') {
                    if (relayValue > value) {
                        logger.debug(`Relay ${key} too high: ${relayValue} > ${value}`);
                        return false;
                    }
                }
                // For boolean flags, values must match if specified
                if (typeof relayValue === 'boolean' && typeof value === 'boolean') {
                    if (relayValue !== value) {
                        logger.debug(`Relay ${key} mismatch: ${relayValue} !== ${value}`);
                        return false;
                    }
                }
            }
        }
        return true;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Error checking relay requirements: ${errorMessage}`);
        return false;
    }
}
/**
 * Validates relay capabilities against required features
 * @param info - Relay information
 * @param requiredNips - Required NIPs
 * @param requiredFeatures - Required relay features
 * @returns {boolean} True if relay supports all required features
 */
function validateRelayCapabilities(info, requiredNips = [], requiredFeatures = {}) {
    // Check NIP support
    if (requiredNips.length > 0) {
        if (!info.supported_nips)
            return false;
        if (!requiredNips.every(nip => info.supported_nips?.includes(nip))) {
            return false;
        }
    }
    // Check limitations
    if (info.limitation) {
        for (const [key, value] of Object.entries(requiredFeatures)) {
            const relayValue = info.limitation[key];
            if (relayValue === undefined)
                return false;
            // For maximum values, relay limit should be higher
            if (key.startsWith('max_') && typeof relayValue === 'number' && typeof value === 'number') {
                if (relayValue < value)
                    return false;
            }
            // For minimum values, relay limit should be lower
            if (key.startsWith('min_') && typeof relayValue === 'number' && typeof value === 'number') {
                if (relayValue > value)
                    return false;
            }
            // For boolean flags, must match exactly
            if (typeof relayValue === 'boolean' && typeof value === 'boolean') {
                if (relayValue !== value)
                    return false;
            }
        }
    }
    return true;
}
/**
 * Creates a relay selection score based on capabilities
 * @param info - Relay information
 * @param preferences - Scoring preferences
 * @returns {number} Relay score (higher is better)
 */
function scoreRelayCapabilities(info, preferences = {}) {
    let score = 0;
    // Score NIP support
    if (info.supported_nips && preferences.preferredNips) {
        score += preferences.preferredNips.filter(nip => info.supported_nips?.includes(nip)).length * 10;
    }
    // Score limitations
    if (info.limitation) {
        const limits = info.limitation;
        // Message length
        if (limits.max_message_length && preferences.minMessageLength) {
            score += limits.max_message_length >= preferences.minMessageLength ? 5 : -5;
        }
        // Subscriptions
        if (limits.max_subscriptions && preferences.minSubscriptions) {
            score += limits.max_subscriptions >= preferences.minSubscriptions ? 5 : -5;
        }
        // Auth requirements
        if (preferences.requireAuth !== undefined) {
            score += (limits.auth_required === preferences.requireAuth) ? 5 : -10;
        }
        // Payment requirements
        if (preferences.requirePayment !== undefined) {
            score += (limits.payment_required === preferences.requirePayment) ? 5 : -10;
        }
    }
    return score;
}
//# sourceMappingURL=nip-11.js.map