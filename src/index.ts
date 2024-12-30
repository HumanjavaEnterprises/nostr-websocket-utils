/**
 * @file Main entry point for the nostr-websocket-utils library
 * @module nostr-websocket-utils
 */

// Core functionality
export { NostrWSClient } from './core/client.js';
export { NostrWSServer } from './core/server.js';
export { NostrWSServer as NostrServer } from './core/nostr-server.js';
export { createWSServer as createServer } from './core/nostr-server.js';

// Utilities
export { getLogger } from './utils/logger.js';

// Crypto operations
export * from './crypto';

// NIP implementations
export * from './nips';

// Type definitions
export * from './types';
