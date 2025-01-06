/**
 * @file NIP-33: Parameterized Replaceable Events
 * @module nips/nip-33
 * @see https://github.com/nostr-protocol/nips/blob/master/33.md
 */
/**
 * Parameterized replaceable event kinds (30000-39999)
 */
export const PARAMETERIZED_REPLACEABLE_KINDS = {
    CATEGORIZED_BOOKMARK: 30000,
    CATEGORIZED_HIGHLIGHT: 30001,
    CATEGORIZED_PEOPLE_LIST: 30002,
    PROFILE_BADGES: 30008,
    BADGE_DEFINITION: 30009,
    CUSTOM_START: 31000,
    CUSTOM_END: 39999
};
/**
 * Creates a parameterized replaceable event
 * @param kind - Event kind
 * @param content - Event content
 * @param identifier - Unique identifier for the parameter
 * @param additionalTags - Additional tags
 * @returns {NostrWSMessage} Parameterized replaceable event
 */
export function createParameterizedEvent(kind, content, identifier, additionalTags = []) {
    return ['EVENT', {
            kind,
            content,
            tags: [
                ['d', identifier],
                ...additionalTags
            ]
        }];
}
/**
 * Validates a parameterized replaceable event
 * @param message - Message to validate
 * @param _logger - Logger instance
 * @returns {boolean} True if valid
 */
export function validateParameterizedEvent(message, _logger) {
    try {
        if (!Array.isArray(message) || message[0] !== 'EVENT') {
            return false;
        }
        const event = message[1];
        const kind = event.kind;
        // Check if kind is in valid range
        if (kind < 30000 || kind > 39999) {
            _logger.debug('Invalid kind for parameterized replaceable event');
            return false;
        }
        // Must have exactly one 'd' tag
        if (!Array.isArray(event.tags)) {
            _logger.debug('Missing tags array');
            return false;
        }
        const dTags = event.tags.filter(tag => Array.isArray(tag) && tag[0] === 'd' && tag[1]);
        if (dTags.length !== 1) {
            _logger.debug('Must have exactly one d tag');
            return false;
        }
        return true;
    }
    catch (error) {
        _logger.error('Error validating parameterized event:', error);
        return false;
    }
}
/**
 * Creates a parameterized event manager
 * @param _logger - Logger instance
 * @returns {ParameterizedEventManager} Event manager
 */
export function createParameterizedEventManager(_logger) {
    return {
        createEvent(kind, content, identifier, tags = []) {
            return createParameterizedEvent(kind, content, identifier, tags);
        },
        updateEvent(kind, identifier, content) {
            return createParameterizedEvent(kind, content, identifier);
        },
        subscribe(kinds, identifiers) {
            return ['REQ', {
                    filter: {
                        kinds,
                        '#d': identifiers
                    }
                }];
        }
    };
}
/**
 * Creates an event replacement handler
 * @param _logger - Logger instance
 * @returns {EventReplacementHandler} Replacement handler
 */
export function createEventReplacementHandler(_logger) {
    return {
        shouldReplace(newEvent, existingEvent) {
            try {
                // Must be same kind
                if (newEvent.kind !== existingEvent.kind)
                    return false;
                // Must have same 'd' tag value
                const newTags = newEvent.tags;
                const existingTags = existingEvent.tags;
                const newDTag = newTags?.find(tag => tag[0] === 'd')?.[1];
                const existingDTag = existingTags?.find(tag => tag[0] === 'd')?.[1];
                if (newDTag !== existingDTag)
                    return false;
                // Replace if newer
                return newEvent.created_at > existingEvent.created_at;
            }
            catch (error) {
                _logger.error('Error checking event replacement:', error);
                return false;
            }
        },
        getReplacementKey(event) {
            const kind = event.kind;
            const dTag = event.tags?.find(tag => tag[0] === 'd')?.[1];
            return `${kind}:${dTag}`;
        }
    };
}
//# sourceMappingURL=nip-33.js.map