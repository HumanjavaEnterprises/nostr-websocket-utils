/**
 * @file Message type definitions
 * @module types/messages
 */
/**
 * Message types that can be sent through the WebSocket connection
 * Following NIP-01 and other NIPs message types
 */
export const MESSAGE_TYPES = {
    EVENT: 'EVENT', // NIP-01: Basic protocol flow events
    REQ: 'REQ', // NIP-01: Request events
    CLOSE: 'CLOSE', // NIP-01: Close subscription
    NOTICE: 'NOTICE', // NIP-01: Human-readable messages
    EOSE: 'EOSE', // NIP-15: End of stored events notice
    OK: 'OK', // NIP-20: Command result
    AUTH: 'AUTH', // NIP-42: Authentication
    COUNT: 'COUNT', // NIP-45: Event counts
    PING: 'PING', // Internal heartbeat ping
    PONG: 'PONG', // Internal heartbeat pong
    ERROR: 'error' // Internal error type (lowercase to differentiate)
};
/**
 * Helper function to create server messages
 */
export function createServerMessage(type, data, clientId) {
    const message = [type, ...data];
    message.clientId = clientId;
    message.timestamp = Date.now();
    return message;
}
/**
 * Connection states for WebSocket client
 */
export var ConnectionState;
(function (ConnectionState) {
    ConnectionState["CONNECTING"] = "CONNECTING";
    ConnectionState["CONNECTED"] = "CONNECTED";
    ConnectionState["DISCONNECTED"] = "DISCONNECTED";
    ConnectionState["RECONNECTING"] = "RECONNECTING";
    ConnectionState["FAILED"] = "FAILED";
})(ConnectionState || (ConnectionState = {}));
//# sourceMappingURL=messages.js.map