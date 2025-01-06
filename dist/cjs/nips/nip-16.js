"use strict";
/**
 * @file NIP-16: Event Treatment
 * @module nips/nip-16
 * @see https://github.com/nostr-protocol/nips/blob/master/16.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPHEMERAL_EVENT_KINDS = exports.REPLACEABLE_EVENT_KINDS = exports.EventTreatment = void 0;
exports.getEventTreatment = getEventTreatment;
exports.validateEventTreatment = validateEventTreatment;
exports.createEventStorageManager = createEventStorageManager;
/**
 * Event treatment types
 */
exports.EventTreatment = {
    EPHEMERAL: 'ephemeral',
    REPLACEABLE: 'replaceable',
    PERSISTENT: 'persistent'
};
/**
 * Replaceable event kinds (10000-19999)
 */
exports.REPLACEABLE_EVENT_KINDS = {
    METADATA: 0,
    CONTACT_LIST: 3,
    CHANNEL_METADATA: 41,
    CHANNEL_MESSAGE: 42,
    USER_STATUS: 10000,
    USER_PROFILE: 10001,
    RELAY_LIST: 10002,
    BOOKMARKS: 10003,
    MUTE_LIST: 10004,
    PIN_LIST: 10005,
    RELAY_METADATA: 10010,
    CLIENT_PREFERENCES: 10015,
    CUSTOM_START: 11000,
    CUSTOM_END: 19999
};
/**
 * Ephemeral event kinds (20000-29999)
 */
exports.EPHEMERAL_EVENT_KINDS = {
    TYPING_INDICATOR: 20001,
    ONLINE_STATUS: 20002,
    USER_PRESENCE: 20003,
    CUSTOM_START: 21000,
    CUSTOM_END: 29999
};
/**
 * Determines event treatment type
 * @param eventKind - Event kind number
 * @returns {EventTreatmentType} Event treatment type
 */
function getEventTreatment(eventKind) {
    if (eventKind >= 20000 && eventKind < 30000) {
        return exports.EventTreatment.EPHEMERAL;
    }
    if (eventKind >= 10000 && eventKind < 20000 || [0, 3, 41, 42].includes(eventKind)) {
        return exports.EventTreatment.REPLACEABLE;
    }
    return exports.EventTreatment.PERSISTENT;
}
/**
 * Validates event treatment rules
 * @param message - Message to validate
 * @param logger - Logger instance
 * @returns {boolean} True if event follows treatment rules
 */
function validateEventTreatment(message, logger) {
    try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') {
            return true; // Not an event message
        }
        const event = message[1];
        const kind = event.kind;
        const treatment = getEventTreatment(kind);
        // Validate based on treatment type
        switch (treatment) {
            case exports.EventTreatment.EPHEMERAL:
                // Ephemeral events shouldn't have large content
                if (typeof event.content === 'string' && event.content.length > 1000) {
                    logger.debug('Ephemeral event content too large');
                    return false;
                }
                break;
            case exports.EventTreatment.REPLACEABLE:
                // Replaceable events must have proper 'd' tag for uniqueness
                if (Array.isArray(event.tags)) {
                    const dTags = event.tags.filter(tag => Array.isArray(tag) && tag[0] === 'd');
                    if (dTags.length > 1) {
                        logger.debug('Multiple d tags in replaceable event');
                        return false;
                    }
                }
                break;
        }
        return true;
    }
    catch (error) {
        logger.error('Error validating event treatment:', error);
        return false;
    }
}
/**
 * Creates default event storage manager
 * @param logger - Logger instance
 * @returns {EventStorageManager} Storage manager
 */
function createEventStorageManager(logger) {
    return {
        shouldStore(event) {
            const kind = event.kind;
            const treatment = getEventTreatment(kind);
            // Don't store ephemeral events by default
            if (treatment === exports.EventTreatment.EPHEMERAL) {
                return false;
            }
            return true;
        },
        getStorageDuration(event) {
            const kind = event.kind;
            const treatment = getEventTreatment(kind);
            switch (treatment) {
                case exports.EventTreatment.EPHEMERAL:
                    return 300; // 5 minutes
                case exports.EventTreatment.REPLACEABLE:
                    return 0; // Permanent until replaced
                default:
                    return 0; // Permanent
            }
        },
        shouldReplace(newEvent, existingEvent) {
            try {
                const kind = newEvent.kind;
                if (kind !== existingEvent.kind)
                    return false;
                const treatment = getEventTreatment(kind);
                if (treatment !== exports.EventTreatment.REPLACEABLE)
                    return false;
                // Check 'd' tag for parameterized replaceable events
                if (Array.isArray(newEvent.tags) && Array.isArray(existingEvent.tags)) {
                    const newDTag = newEvent.tags.find(tag => Array.isArray(tag) && tag[0] === 'd')?.[1];
                    const existingDTag = existingEvent.tags.find(tag => Array.isArray(tag) && tag[0] === 'd')?.[1];
                    if (newDTag !== existingDTag)
                        return false;
                }
                // Replace if new event is newer
                return newEvent.created_at > existingEvent.created_at;
            }
            catch (error) {
                logger.error('Error checking event replacement:', error);
                return false;
            }
        }
    };
}
//# sourceMappingURL=nip-16.js.map