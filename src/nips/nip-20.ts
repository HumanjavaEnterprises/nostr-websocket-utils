/**
 * @file NIP-20 Command Results implementation
 * @module nips/nip-20
 */

import { NostrWSMessage } from '../types/index.js';
import { getLogger } from '../utils/logger.js';

const logger = getLogger('NIP-20');

/**
 * Command status types
 */
export enum CommandStatus {
  SUCCESS = 'success',
  error = 'error',
  PENDING = 'pending',
  RATE_LIMITED = 'rate_limited',
  AUTH_REQUIRED = 'auth_required',
  RESTRICTED = 'restricted'
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
export function validateCommandMessage(message: NostrWSMessage): boolean {
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
export function createCommandResult(data: CommandMessageData): CommandResult {
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
export function createOkMessage(eventId: string, success = true, message = ''): NostrWSMessage {
  return ['OK', eventId, success, message];
}

/**
 * Creates a NOTICE message: ["NOTICE", <message>] per NIP-01.
 * The optional code is prefixed into the human-readable message.
 */
export function createCommandNoticeMessage(code: CommandStatusType, message: string): NostrWSMessage {
  const text = code ? `${code}: ${message}` : message;
  return ['NOTICE', text];
}
