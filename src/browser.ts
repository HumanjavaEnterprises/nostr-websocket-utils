import { NostrWSClient } from './core/client';
import type { NostrWSMessage, ConnectionState } from './types/index';
import type { NostrWSClientOptions } from './types/websocket';

// Re-export the client
export { NostrWSClient };

// Re-export types
export type {
  NostrWSMessage,
  NostrWSClientOptions,
  ConnectionState
};

// Export a default object for UMD bundle
export default {
  NostrWSClient
};
