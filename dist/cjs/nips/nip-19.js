"use strict";
/**
 * @file NIP-19: bech32-encoded entities
 * @module nips/nip-19
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodePubkey = encodePubkey;
exports.encodePrivkey = encodePrivkey;
exports.decodePubkey = decodePubkey;
exports.decodePrivkey = decodePrivkey;
exports.processBech32Tags = processBech32Tags;
exports.encodeBech32Tags = encodeBech32Tags;
const logger_js_1 = require("../utils/logger.js");
const bech32_js_1 = require("../crypto/bech32.js");
const logger = (0, logger_js_1.getLogger)('NIP-19');
/**
 * Encode a public key to bech32 npub format
 */
function encodePubkey(pubkey) {
    try {
        return (0, bech32_js_1.encodeToBech32)('npub', pubkey);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to encode pubkey: ${errorMessage}`);
        throw new Error(`Failed to encode pubkey: ${errorMessage}`);
    }
}
/**
 * Encode a private key to bech32 nsec format
 */
function encodePrivkey(privkey) {
    try {
        return (0, bech32_js_1.encodeToBech32)('nsec', privkey);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to encode private key: ${errorMessage}`);
        throw new Error(`Failed to encode private key: ${errorMessage}`);
    }
}
/**
 * Decode a bech32 npub to hex pubkey
 */
function decodePubkey(npub) {
    try {
        const { prefix, hex } = (0, bech32_js_1.decodeFromBech32)(npub);
        if (prefix !== 'npub') {
            throw new Error('Invalid prefix for public key');
        }
        return hex;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to decode pubkey: ${errorMessage}`);
        throw new Error(`Failed to decode pubkey: ${errorMessage}`);
    }
}
/**
 * Decode a bech32 nsec to hex privkey
 */
function decodePrivkey(nsec) {
    try {
        const { prefix, hex } = (0, bech32_js_1.decodeFromBech32)(nsec);
        if (prefix !== 'nsec') {
            throw new Error('Invalid prefix for private key');
        }
        return hex;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to decode private key: ${errorMessage}`);
        throw new Error(`Failed to decode private key: ${errorMessage}`);
    }
}
/**
 * Process tags containing bech32-encoded entities
 */
function processBech32Tags(tags) {
    return tags.map(tag => {
        try {
            if (tag[0] === 'p' && tag[1].startsWith('npub')) {
                return [tag[0], decodePubkey(tag[1])];
            }
            return tag;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.debug(`Failed to decode pubkey ${tag[1]}: ${errorMessage}`);
            return tag;
        }
    });
}
/**
 * Encode tags containing hex pubkeys to bech32
 */
function encodeBech32Tags(tags) {
    return tags.map(tag => {
        try {
            if (tag[0] === 'p' && !tag[1].startsWith('npub')) {
                return [tag[0], encodePubkey(tag[1])];
            }
            return tag;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.debug(`Failed to encode pubkey ${tag[1]}: ${errorMessage}`);
            return tag;
        }
    });
}
//# sourceMappingURL=nip-19.js.map