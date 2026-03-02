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

import { nip46 } from 'nostr-crypto-utils';
import type {
  Nip46Session,
  Nip46Request,
  Nip46Response,
  SignedNostrEvent,
  BunkerURI,
} from 'nostr-crypto-utils';
import { NostrWSClient } from '../core/client.js';
import type { NostrWSMessage } from '../types/messages.js';
import { getLogger } from '../utils/logger.js';

const logger = getLogger('NIP-46');

/**
 * Options for creating a NIP-46 transport
 */
export interface Nip46TransportOptions {
  /** Timeout for waiting for a response (ms). Defaults to 60000 (60s). */
  timeout?: number;
}

/**
 * Result of sending a NIP-46 request
 */
export interface Nip46TransportResult {
  /** The JSON-RPC response from the remote signer */
  response: Nip46Response;
  /** The raw kind 24133 event that carried the response */
  rawEvent: SignedNostrEvent;
}

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
export class Nip46Transport {
  private client: NostrWSClient;
  private session: Nip46Session;
  private timeout: number;

  constructor(
    client: NostrWSClient,
    session: Nip46Session,
    options: Nip46TransportOptions = {}
  ) {
    this.client = client;
    this.session = session;
    this.timeout = options.timeout ?? 60_000;
  }

  /**
   * Subscribe for NIP-46 response events addressed to our ephemeral pubkey.
   * This sends a REQ message to the relay with the appropriate filter.
   * @param subscriptionId - Subscription ID for the REQ message
   * @param since - Optional since timestamp for the filter
   * @returns The subscription message that was sent
   */
  async subscribe(subscriptionId: string, since?: number): Promise<NostrWSMessage> {
    const filter = nip46.createResponseFilter(this.session.clientPubkey, since);
    const message: NostrWSMessage = ['REQ', {
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
  async publishRequest(request: Nip46Request): Promise<SignedNostrEvent> {
    const event = await nip46.wrapEvent(
      request,
      this.session,
      this.session.remotePubkey
    );

    const message: NostrWSMessage = ['EVENT', event];
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
  unwrapEvent(event: SignedNostrEvent): Nip46Request | Nip46Response | null {
    try {
      return nip46.unwrapEvent(event, this.session);
    } catch (error: unknown) {
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
  getResponseFilter(since?: number): { kinds: number[]; '#p': string[]; since?: number } {
    return nip46.createResponseFilter(this.session.clientPubkey, since);
  }

  /**
   * Get the current session (read-only info).
   * @returns The session's client and remote pubkeys
   */
  getSessionInfo(): { clientPubkey: string; remotePubkey: string } {
    return nip46.getSessionInfo(this.session);
  }
}

// ─── Convenience re-exports from nostr-crypto-utils ─────────────────────────
// These let consumers access NIP-46 protocol helpers without a separate import.

/** Parse a bunker:// URI */
export const parseBunkerURI: (uri: string) => BunkerURI = nip46.parseBunkerURI;

/** Create a bunker:// URI */
export const createBunkerURI: (remotePubkey: string, relays: string[], secret?: string) => string = nip46.createBunkerURI;

/** Validate a bunker:// URI */
export const validateBunkerURI: typeof nip46.validateBunkerURI = nip46.validateBunkerURI;

/** Create a new NIP-46 session */
export const createNip46Session: typeof nip46.createSession = nip46.createSession;

/** Restore a NIP-46 session */
export const restoreNip46Session: typeof nip46.restoreSession = nip46.restoreSession;

/** Create a 'connect' request */
export const connectRequest: typeof nip46.connectRequest = nip46.connectRequest;

/** Create a 'ping' request */
export const pingRequest: typeof nip46.pingRequest = nip46.pingRequest;

/** Create a 'get_public_key' request */
export const getPublicKeyRequest: typeof nip46.getPublicKeyRequest = nip46.getPublicKeyRequest;

/** Create a 'sign_event' request */
export const signEventRequest: typeof nip46.signEventRequest = nip46.signEventRequest;
