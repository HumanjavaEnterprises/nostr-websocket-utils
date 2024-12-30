/**
 * @file Relay type definitions
 * @module types/relays
 */

/**
 * Relay information interface
 */
export interface NostrRelayInfo {
  name?: string;
  description?: string;
  pubkey?: string;
  contact?: string;
  supported_nips?: number[];
  software?: string;
  version?: string;
}

/**
 * Relay metadata interface
 */
export interface NostrRelayMetadata extends NostrRelayInfo {
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
  lastConnected?: number;
  lastDisconnected?: number;
}
