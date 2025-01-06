/**
 * @file NIP-20 Command Results implementation
 * @module nips/nip-20
 */
import { NostrWSMessage } from '../types/index.js';
/**
 * Command status types
 */
export declare enum CommandStatus {
    SUCCESS = "success",
    error = "error",
    PENDING = "pending",
    RATE_LIMITED = "rate_limited",
    AUTH_REQUIRED = "auth_required",
    RESTRICTED = "restricted"
}
export type CommandStatusType = CommandStatus;
/**
 * Command result interface
 */
export interface CommandResult {
    status: boolean;
    message?: string;
    code?: CommandStatusType;
    details?: Record<string, unknown>;
}
/**
 * Represents the data structure for command messages
 * @interface CommandMessageData
 * @property {string} [event_id] - ID of the event this command relates to
 * @property {boolean} [status] - Status of the command execution
 * @property {string} [message] - Human-readable message about the command result
 * @property {CommandStatusType} [code] - Status code of the command result
 * @property {Record<string, unknown>} [details] - Additional details about the command result
 */
interface CommandMessageData {
    event_id?: string;
    status?: boolean;
    message?: string;
    code?: CommandStatusType;
    details?: Record<string, unknown>;
}
/**
 * Validates a command message according to NIP-20
 */
export declare function validateCommandMessage(message: NostrWSMessage): boolean;
/**
 * Creates a command result message
 */
export declare function createCommandResult(data: CommandMessageData): CommandResult;
/**
 * Creates an OK message
 */
export declare function createOkMessage(eventId: string, success?: boolean, details?: Record<string, unknown>): NostrWSMessage;
/**
 * Creates a NOTICE message
 */
export declare function createCommandNoticeMessage(code: CommandStatusType, message: string, details?: Record<string, unknown>): NostrWSMessage;
export {};
//# sourceMappingURL=nip-20.d.ts.map