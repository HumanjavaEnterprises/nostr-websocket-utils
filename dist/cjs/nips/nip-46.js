"use strict";
/**
 * @file NIP-46: Nostr Connect / Remote Signing Transport
 * @module nips/nip-46
 * @see https://github.com/nostr-protocol/nips/blob/master/46.md
 *
 * nostr-crypto-utils provides the NIP-46 protocol layer (crypto, encoding,
 * message formatting) but has no I/O. This module adds the WebSocket relay
 * transport on top — subscribing for kind 24133 responses, publishing
 * wrapped requests, and correlating request/response pairs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.signEventRequest = exports.getPublicKeyRequest = exports.pingRequest = exports.connectRequest = exports.restoreNip46Session = exports.createNip46Session = exports.validateBunkerURI = exports.createBunkerURI = exports.parseBunkerURI = exports.Nip46Transport = void 0;
const nostr_crypto_utils_1 = require("nostr-crypto-utils");
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.getLogger)('NIP-46');
/**
 * A thin transport layer that bridges nostr-crypto-utils NIP-46 protocol
 * with the WebSocket relay infrastructure in this library.
 *
 * Usage:
 * ```ts
 * const client = new NostrWSClient(['wss://relay.example.com']);
 * await client.connect();
 *
 * const session = nip46.createSession(remotePubkey);
 * const transport = new Nip46Transport(client, session);
 *
 * // Send a connect request
 * const connectReq = nip46.connectRequest(remotePubkey, secret);
 * const result = await transport.sendRequest(connectReq);
 * ```
 */
class Nip46Transport {
    constructor(client, session, options = {}) {
        this.client = client;
        this.session = session;
        this.timeout = options.timeout ?? 60000;
    }
    /**
     * Subscribe for NIP-46 response events addressed to our ephemeral pubkey.
     * This sends a REQ message to the relay with the appropriate filter.
     * @param subscriptionId - Subscription ID for the REQ message
     * @param since - Optional since timestamp for the filter
     * @returns The subscription message that was sent
     */
    async subscribe(subscriptionId, since) {
        const filter = nostr_crypto_utils_1.nip46.createResponseFilter(this.session.clientPubkey, since);
        const message = ['REQ', {
                subscription_id: subscriptionId,
                filters: [filter]
            }];
        await this.client.sendMessage(message);
        logger.debug({ subscriptionId, filter }, 'Subscribed for NIP-46 responses');
        return message;
    }
    /**
     * Wrap and publish a NIP-46 request as a kind 24133 event.
     * @param request - NIP-46 JSON-RPC request
     * @returns The signed kind 24133 event that was published
     */
    async publishRequest(request) {
        const event = await nostr_crypto_utils_1.nip46.wrapEvent(request, this.session, this.session.remotePubkey);
        const message = ['EVENT', event];
        await this.client.sendMessage(message);
        logger.debug({ requestId: request.id, method: request.method }, 'Published NIP-46 request');
        return event;
    }
    /**
     * Attempt to unwrap a kind 24133 event into a NIP-46 request or response.
     * Returns null if the event is not kind 24133 or decryption fails.
     * @param event - A signed Nostr event
     * @returns Decrypted NIP-46 payload, or null on failure
     */
    unwrapEvent(event) {
        try {
            return nostr_crypto_utils_1.nip46.unwrapEvent(event, this.session);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.debug({ error: errorMessage }, 'Failed to unwrap NIP-46 event');
            return null;
        }
    }
    /**
     * Get the NIP-46 response filter for this session.
     * Useful for manual subscription management.
     * @param since - Optional since timestamp
     * @returns Filter object for kind 24133 events tagged to our pubkey
     */
    getResponseFilter(since) {
        return nostr_crypto_utils_1.nip46.createResponseFilter(this.session.clientPubkey, since);
    }
    /**
     * Get the current session (read-only info).
     * @returns The session's client and remote pubkeys
     */
    getSessionInfo() {
        return nostr_crypto_utils_1.nip46.getSessionInfo(this.session);
    }
}
exports.Nip46Transport = Nip46Transport;
// ─── Convenience re-exports from nostr-crypto-utils ─────────────────────────
// These let consumers access NIP-46 protocol helpers without a separate import.
/** Parse a bunker:// URI */
exports.parseBunkerURI = nostr_crypto_utils_1.nip46.parseBunkerURI;
/** Create a bunker:// URI */
exports.createBunkerURI = nostr_crypto_utils_1.nip46.createBunkerURI;
/** Validate a bunker:// URI */
exports.validateBunkerURI = nostr_crypto_utils_1.nip46.validateBunkerURI;
/** Create a new NIP-46 session */
exports.createNip46Session = nostr_crypto_utils_1.nip46.createSession;
/** Restore a NIP-46 session */
exports.restoreNip46Session = nostr_crypto_utils_1.nip46.restoreSession;
/** Create a 'connect' request */
exports.connectRequest = nostr_crypto_utils_1.nip46.connectRequest;
/** Create a 'ping' request */
exports.pingRequest = nostr_crypto_utils_1.nip46.pingRequest;
/** Create a 'get_public_key' request */
exports.getPublicKeyRequest = nostr_crypto_utils_1.nip46.getPublicKeyRequest;
/** Create a 'sign_event' request */
exports.signEventRequest = nostr_crypto_utils_1.nip46.signEventRequest;
//# sourceMappingURL=nip-46.js.map