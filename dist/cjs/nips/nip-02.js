"use strict";
/**
 * @file NIP-02: Contact List and Petnames
 * @module nips/nip-02
 * @see https://github.com/nostr-protocol/nips/blob/master/02.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTACT_LIST_KIND = void 0;
exports.createContactListEvent = createContactListEvent;
exports.extractContacts = extractContacts;
exports.createContactListSubscription = createContactListSubscription;
exports.createContactListManager = createContactListManager;
/**
 * Contact list event kind
 */
exports.CONTACT_LIST_KIND = 3;
/**
 * Creates a contact list event
 * @param contacts - List of contacts
 * @param metadata - Optional metadata for the contact list
 * @returns {NostrWSMessage} Contact list event
 */
function createContactListEvent(contacts, metadata = {}) {
    const tags = contacts.map(contact => {
        const tag = ['p', contact.pubkey];
        if (contact.relay)
            tag.push(contact.relay);
        if (contact.petname)
            tag.push(contact.petname);
        return tag;
    });
    return ['EVENT', {
            kind: exports.CONTACT_LIST_KIND,
            tags,
            content: JSON.stringify(metadata)
        }];
}
/**
 * Extracts contacts from a contact list event
 * @param message - Contact list message
 * @returns {Contact[]} Array of contacts
 */
function extractContacts(message) {
    try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') {
            return [];
        }
        const event = message[1];
        if (event.kind !== exports.CONTACT_LIST_KIND) {
            return [];
        }
        if (!Array.isArray(event.tags)) {
            return [];
        }
        const metadata = event.content ? JSON.parse(event.content) : {};
        return event.tags
            .filter(tag => Array.isArray(tag) && tag[0] === 'p')
            .map(tag => ({
            pubkey: tag[1],
            relay: tag[2],
            petname: tag[3],
            metadata
        }));
    }
    catch (_error) {
        return [];
    }
}
/**
 * Creates a contact list subscription message
 * @param pubkey - Public key to subscribe to
 * @returns {NostrWSMessage} Subscription message
 */
function createContactListSubscription(pubkey) {
    return ['REQ', {
            filter: {
                authors: [pubkey],
                kinds: [exports.CONTACT_LIST_KIND]
            }
        }];
}
/**
 * Creates a contact list manager
 * @param _logger - Logger instance
 * @returns {ContactListManager} Contact list manager
 */
function createContactListManager(_logger) {
    const contacts = new Map();
    return {
        addContact(contact) {
            contacts.set(contact.pubkey, contact);
        },
        removeContact(pubkey) {
            contacts.delete(pubkey);
        },
        getContact(pubkey) {
            return contacts.get(pubkey);
        },
        getAllContacts() {
            return Array.from(contacts.values());
        },
        updateContactMetadata(pubkey, metadata) {
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
        createEvent() {
            return createContactListEvent(Array.from(contacts.values()));
        }
    };
}
//# sourceMappingURL=nip-02.js.map