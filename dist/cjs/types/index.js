"use strict";
/**
 * @file Core type definitions
 * @module types
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionState = void 0;
__exportStar(require("./filters.js"), exports);
__exportStar(require("./relays.js"), exports);
__exportStar(require("./logger.js"), exports);
__exportStar(require("./priority.js"), exports);
/**
 * WebSocket connection states
 */
var ConnectionState;
(function (ConnectionState) {
    ConnectionState["CONNECTING"] = "CONNECTING";
    ConnectionState["CONNECTED"] = "CONNECTED";
    ConnectionState["DISCONNECTED"] = "DISCONNECTED";
    ConnectionState["RECONNECTING"] = "RECONNECTING";
    ConnectionState["FAILED"] = "FAILED";
})(ConnectionState || (exports.ConnectionState = ConnectionState = {}));
//# sourceMappingURL=index.js.map