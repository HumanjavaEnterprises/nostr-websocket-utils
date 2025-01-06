"use strict";
/**
 * @file Main entry point for the nostr-websocket-utils library
 * @module nostr-websocket-utils
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
exports.getLogger = exports.createServer = exports.NostrServer = exports.NostrWSServer = exports.NostrWSClient = void 0;
// Core functionality
var client_js_1 = require("./core/client.js");
Object.defineProperty(exports, "NostrWSClient", { enumerable: true, get: function () { return client_js_1.NostrWSClient; } });
var server_js_1 = require("./core/server.js");
Object.defineProperty(exports, "NostrWSServer", { enumerable: true, get: function () { return server_js_1.NostrWSServer; } });
var nostr_server_js_1 = require("./core/nostr-server.js");
Object.defineProperty(exports, "NostrServer", { enumerable: true, get: function () { return nostr_server_js_1.NostrWSServer; } });
var nostr_server_js_2 = require("./core/nostr-server.js");
Object.defineProperty(exports, "createServer", { enumerable: true, get: function () { return nostr_server_js_2.createWSServer; } });
// Utilities
var logger_js_1 = require("./utils/logger.js");
Object.defineProperty(exports, "getLogger", { enumerable: true, get: function () { return logger_js_1.getLogger; } });
// Crypto operations
__exportStar(require("./crypto/index.js"), exports);
// NIP implementations
__exportStar(require("./nips/index.js"), exports);
// Type definitions
__exportStar(require("./types/index.js"), exports);
//# sourceMappingURL=index.js.map