"use strict";
/**
 * @file NIP-20 Command Results implementation
 * @module nips/nip-20
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandStatus = void 0;
exports.validateCommandMessage = validateCommandMessage;
exports.createCommandResult = createCommandResult;
exports.createOkMessage = createOkMessage;
exports.createCommandNoticeMessage = createCommandNoticeMessage;
const logger_js_1 = require("../utils/logger.js");
const logger = (0, logger_js_1.getLogger)('NIP-20');
/**
 * Command status types
 */
var CommandStatus;
(function (CommandStatus) {
    CommandStatus["SUCCESS"] = "success";
    CommandStatus["error"] = "error";
    CommandStatus["PENDING"] = "pending";
    CommandStatus["RATE_LIMITED"] = "rate_limited";
    CommandStatus["AUTH_REQUIRED"] = "auth_required";
    CommandStatus["RESTRICTED"] = "restricted";
})(CommandStatus || (exports.CommandStatus = CommandStatus = {}));
/**
 * Validates a command message according to NIP-20
 */
function validateCommandMessage(message) {
    if (!Array.isArray(message) || message.length < 2) {
        logger.debug('Invalid command message format');
        return false;
    }
    const type = message[0];
    // NIP-20 OK: ["OK", <eventId:string>, <status:boolean>, <message:string?>]
    if (type === 'OK') {
        if (typeof message[1] !== 'string') {
            logger.debug('Invalid event id in OK message');
            return false;
        }
        if (typeof message[2] !== 'boolean') {
            logger.debug('Invalid status in OK message');
            return false;
        }
        if (message[3] !== undefined && typeof message[3] !== 'string') {
            logger.debug('Invalid message field in OK message');
            return false;
        }
        return true;
    }
    // NIP-01 NOTICE: ["NOTICE", <message:string>]
    if (type === 'NOTICE') {
        if (typeof message[1] !== 'string') {
            logger.debug('Invalid message field in NOTICE');
            return false;
        }
        return true;
    }
    logger.debug(`Unsupported command message type: ${type}`);
    return false;
}
/**
 * Creates a command result message
 */
function createCommandResult(data) {
    const status = data.status ?? false;
    const code = status ? CommandStatus.SUCCESS : data.code;
    return {
        status,
        code,
        message: data.message,
        details: data.details
    };
}
/**
 * Creates an OK message: ["OK", <eventId>, <success>, <message>]
 * per NIP-20 / NIP-01. The message string defaults to empty.
 */
function createOkMessage(eventId, success = true, message = '') {
    return ['OK', eventId, success, message];
}
/**
 * Creates a NOTICE message: ["NOTICE", <message>] per NIP-01.
 * The optional code is prefixed into the human-readable message.
 */
function createCommandNoticeMessage(code, message) {
    const text = code ? `${code}: ${message}` : message;
    return ['NOTICE', text];
}
//# sourceMappingURL=nip-20.js.map