/**
 * @file Main entry point for the nostr-websocket-utils library
 * @module nostr-websocket-utils
 */

export { NostrWSClient } from './client.js';
export { NostrWSServer } from './server.js';
export { NostrWSServer as NostrServer } from './nostr-server.js';
export { createWSServer as createServer } from './nostr-server.js';
export { getLogger } from './utils/logger.js';

export type {
  NostrWSOptions,
  NostrWSMessage,
  NostrWSSubscription,
  NostrWSClientEvents,
  NostrWSServerEvents,
  ExtendedWebSocket,
  NostrWSValidationResult,
  NostrWSConnectionState
} from './types/index.js';

export type {
  NostrWSEvent as NostrEvent,
  NostrWSFilter as NostrFilter,
  NostrWSSocket as NostrSocket,
  NostrWSServerOptions,
  NostrWSServerMessage,
  NostrWSMessageType
} from './types/nostr.js';
