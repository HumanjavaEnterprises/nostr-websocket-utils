"use strict";
/**
 * @file NIPs implementation index
 * @module nips
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
// Basic protocol flow
__exportStar(require("./nip-01.js"), exports);
// Contact List and Petnames
__exportStar(require("./nip-02.js"), exports);
// Encrypted Direct Messages
__exportStar(require("./nip-04.js"), exports);
// DNS Identity Verification
__exportStar(require("./nip-05.js"), exports);
// Event Deletion
__exportStar(require("./nip-09.js"), exports);
// bech32-encoded entities
__exportStar(require("./nip-19.js"), exports);
// Delegated Event Signing
__exportStar(require("./nip-26.js"), exports);
// Relay Information Document
__exportStar(require("./nip-11.js"), exports);
// Command Results
__exportStar(require("./nip-20.js"), exports);
// Proof of Work
__exportStar(require("./nip-13.js"), exports);
// Event Treatment
__exportStar(require("./nip-16.js"), exports);
// End of Stored Events Notice
__exportStar(require("./nip-15.js"), exports);
// Event Created At Limits
__exportStar(require("./nip-22.js"), exports);
// Public Chat
__exportStar(require("./nip-28.js"), exports);
// Parameterized Replaceable Events
__exportStar(require("./nip-33.js"), exports);
//# sourceMappingURL=index.js.map