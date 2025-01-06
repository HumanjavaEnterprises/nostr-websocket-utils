/**
 * @file NIP-19: bech32-encoded entities
 * @module nips/nip-19
 */
/**
 * Encode a public key to bech32 npub format
 */
export declare function encodePubkey(pubkey: string): string;
/**
 * Encode a private key to bech32 nsec format
 */
export declare function encodePrivkey(privkey: string): string;
/**
 * Decode a bech32 npub to hex pubkey
 */
export declare function decodePubkey(npub: string): string;
/**
 * Decode a bech32 nsec to hex privkey
 */
export declare function decodePrivkey(nsec: string): string;
/**
 * Process tags containing bech32-encoded entities
 */
export declare function processBech32Tags(tags: string[][]): string[][];
/**
 * Encode tags containing hex pubkeys to bech32
 */
export declare function encodeBech32Tags(tags: string[][]): string[][];
//# sourceMappingURL=nip-19.d.ts.map