/**
 * @file NIP-11: Relay Information Document
 * @module nips/nip-11
 * @see https://github.com/nostr-protocol/nips/blob/master/11.md
 */
/**
 * Relay information document structure
 */
export interface RelayInformation {
    name?: string;
    description?: string;
    pubkey?: string;
    contact?: string;
    supported_nips?: number[];
    software?: string;
    version?: string;
    limitation?: {
        max_message_length?: number;
        max_subscriptions?: number;
        max_filters?: number;
        max_limit?: number;
        max_subid_length?: number;
        min_prefix?: number;
        max_event_tags?: number;
        max_content_length?: number;
        min_pow_difficulty?: number;
        auth_required?: boolean;
        payment_required?: boolean;
    };
}
/**
 * Fetches relay information document
 * @param url - Relay URL (ws:// or wss://)
 * @returns {Promise<RelayInformation>} Relay information
 */
export declare function getRelayInformation(url: string): Promise<RelayInformation>;
/**
 * Checks if relay meets requirements
 * @param relay - Relay information
 * @param requirements - Required relay features
 * @returns {boolean} True if relay meets all requirements
 */
export declare function checkRelayRequirements(relay: RelayInformation, requirements: Partial<RelayInformation>): boolean;
/**
 * Validates relay capabilities against required features
 * @param info - Relay information
 * @param requiredNips - Required NIPs
 * @param requiredFeatures - Required relay features
 * @returns {boolean} True if relay supports all required features
 */
export declare function validateRelayCapabilities(info: RelayInformation, requiredNips?: number[], requiredFeatures?: Partial<RelayInformation['limitation']>): boolean;
/**
 * Creates a relay selection score based on capabilities
 * @param info - Relay information
 * @param preferences - Scoring preferences
 * @returns {number} Relay score (higher is better)
 */
export declare function scoreRelayCapabilities(info: RelayInformation, preferences?: {
    preferredNips?: number[];
    minMessageLength?: number;
    minSubscriptions?: number;
    requireAuth?: boolean;
    requirePayment?: boolean;
}): number;
//# sourceMappingURL=nip-11.d.ts.map