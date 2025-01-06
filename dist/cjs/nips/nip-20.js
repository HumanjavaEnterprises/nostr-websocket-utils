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
    const [type, data] = message;
    if (typeof data !== 'object' || !data) {
        logger.debug('Invalid command message data');
        return false;
    }
    const commandData = data;
    // For OK/NOTICE messages
    if (type === 'OK') {
        if (!commandData.event_id || typeof commandData.event_id !== 'string') {
            logger.debug('Invalid event_id in OK message');
            return false;
        }
        if (typeof commandData.status !== 'boolean') {
            logger.debug('Invalid status in OK message');
            return false;
        }
    }
    // For NOTICE messages
    if (type === 'NOTICE' && commandData.code) {
        if (!Object.values(CommandStatus).includes(commandData.code)) {
            logger.debug('Invalid command status code');
            return false;
        }
    }
    // Optional fields validation
    if (commandData.message && typeof commandData.message !== 'string') {
        logger.debug('Invalid message field');
        return false;
    }
    if (commandData.details && typeof commandData.details !== 'object') {
        logger.debug('Invalid details field');
        return false;
    }
    return true;
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
 * Creates an OK message
 */
function createOkMessage(eventId, success = true, details) {
    return ['OK', {
            event_id: eventId,
            status: success,
            ...details && { details }
        }];
}
/**
 * Creates a NOTICE message
 */
function createCommandNoticeMessage(code, message, details) {
    return ['NOTICE', {
            code,
            message,
            ...details && { details }
        }];
}
//# sourceMappingURL=nip-20.js.map