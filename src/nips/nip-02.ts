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
export const CONTACT_LIST_KIND = 3;

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
export function createContactListEvent(
  contacts: Contact[],
  metadata: Record<string, unknown> = {}
): NostrWSMessage {
  const tags = contacts.map(contact => {
    const tag = ['p', contact.pubkey];
    if (contact.relay) tag.push(contact.relay);
    if (contact.petname) tag.push(contact.petname);
    return tag;
  });

  return ['EVENT', {
    kind: CONTACT_LIST_KIND,
    tags,
    content: JSON.stringify(metadata)
  }];
}

/**
 * Extracts contacts from a contact list event
 * @param message - Contact list message
 * @returns {Contact[]} Array of contacts
 */
export function extractContacts(
  message: NostrWSMessage
): Contact[] {
  try {
    if (!Array.isArray(message) || message[0] !== 'EVENT') {
      return [];
    }

    const event = message[1] as Record<string, unknown>;
    if (event.kind !== CONTACT_LIST_KIND) {
      return [];
    }

    if (!Array.isArray(event.tags)) {
      return [];
    }

    const metadata = event.content ? JSON.parse(event.content as string) : {};

    return event.tags
      .filter(tag => Array.isArray(tag) && tag[0] === 'p')
      .map(tag => ({
        pubkey: tag[1],
        relay: tag[2],
        petname: tag[3],
        metadata
      }));
  } catch (error) {
    return [];
  }
}

/**
 * Creates a contact list subscription message
 * @param pubkey - Public key to subscribe to
 * @returns {NostrWSMessage} Subscription message
 */
export function createContactListSubscription(pubkey: string): NostrWSMessage {
  return ['REQ', {
    filter: {
      authors: [pubkey],
      kinds: [CONTACT_LIST_KIND]
    }
  }];
}

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
export function createContactListManager(_logger: Logger): ContactListManager {
  const contacts = new Map<string, Contact>();

  return {
    addContact(contact: Contact): void {
      contacts.set(contact.pubkey, contact);
    },

    removeContact(pubkey: string): void {
      contacts.delete(pubkey);
    },

    getContact(pubkey: string): Contact | undefined {
      return contacts.get(pubkey);
    },

    getAllContacts(): Contact[] {
      return Array.from(contacts.values());
    },

    updateContactMetadata(pubkey: string, metadata: Record<string, unknown>): void {
      const contact = contacts.get(pubkey);
      if (contact) {
        contacts.set(pubkey, {
          ...contact,
          metadata: {
            ...contact.metadata,
            ...metadata
          }
        });
      }
    },

    createEvent(): NostrWSMessage {
      return createContactListEvent(Array.from(contacts.values()));
    }
  };
}
