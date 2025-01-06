/**
 * @file Core type definitions
 * @module types
 */
export * from './filters.js';
export * from './relays.js';
export * from './logger.js';
export * from './priority.js';
/**
 * WebSocket connection states
 */
export var ConnectionState;
(function (ConnectionState) {
    ConnectionState["CONNECTING"] = "CONNECTING";
    ConnectionState["CONNECTED"] = "CONNECTED";
    ConnectionState["DISCONNECTED"] = "DISCONNECTED";
    ConnectionState["RECONNECTING"] = "RECONNECTING";
    ConnectionState["FAILED"] = "FAILED";
})(ConnectionState || (ConnectionState = {}));
//# sourceMappingURL=index.js.map