/**
 * @file NIP-02: Contact List and Petnames
 * @module nips/nip-02
 * @see https://github.com/nostr-protocol/nips/blob/master/02.md
 */
import type { NostrWSMessage } from '../types/messages.js';
import type { Logger } from '../types/logger.js';
/**
 * Contact list event kind
 */
export declare const CONTACT_LIST_KIND = 3;
/**
 * Contact entry structure
 */
export interface Contact {
    pubkey: string;
    relay?: string;
    petname?: string;
    metadata?: Record<string, unknown>;
}
/**
 * Creates a contact list event
 * @param contacts - List of contacts
 * @param metadata - Optional metadata for the contact list
 * @returns {NostrWSMessage} Contact list event
 */
export declare function createContactListEvent(contacts: Contact[], metadata?: Record<string, unknown>): NostrWSMessage;
/**
 * Extracts contacts from a contact list event
 * @param message - Contact list message
 * @returns {Contact[]} Array of contacts
 */
export declare function extractContacts(message: NostrWSMessage): Contact[];
/**
 * Creates a contact list subscription message
 * @param pubkey - Public key to subscribe to
 * @returns {NostrWSMessage} Subscription message
 */
export declare function createContactListSubscription(pubkey: string): NostrWSMessage;
/**
 * Contact list manager interface
 */
export interface ContactListManager {
    /**
     * Adds or updates a contact
     * @param contact - Contact to add/update
     */
    addContact(contact: Contact): void;
    /**
     * Removes a contact
     * @param pubkey - Public key of contact to remove
     */
    removeContact(pubkey: string): void;
    /**
     * Gets a contact by public key
     * @param pubkey - Public key to look up
     * @returns {Contact | undefined} Contact if found
     */
    getContact(pubkey: string): Contact | undefined;
    /**
     * Gets all contacts
     * @returns {Contact[]} Array of all contacts
     */
    getAllContacts(): Contact[];
    /**
     * Updates contact metadata
     * @param pubkey - Public key of contact
     * @param metadata - New metadata
     */
    updateContactMetadata(pubkey: string, metadata: Record<string, unknown>): void;
    /**
     * Creates a contact list event
     * @returns {NostrWSMessage} Contact list event
     */
    createEvent(): NostrWSMessage;
}
/**
 * Creates a contact list manager
 * @param _logger - Logger instance
 * @returns {ContactListManager} Contact list manager
 */
export declare function createContactListManager(_logger: Logger): ContactListManager;
//# sourceMappingURL=nip-02.d.ts.map