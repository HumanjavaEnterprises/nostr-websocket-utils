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

  const [type, data] = message;
  if (typeof data !== 'object' || !data) {
    logger.debug('Invalid command message data');
    return false;
  }

  const commandData = data as CommandMessageData;

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
    if (!Object.values(CommandStatus).includes(commandData.code as CommandStatus)) {
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
 * Creates an OK message
 */
export function createOkMessage(eventId: string, success = true, details?: Record<string, unknown>): NostrWSMessage {
  return ['OK', {
    event_id: eventId,
    status: success,
    ...details && { details }
  }];
}

/**
 * Creates a NOTICE message
 */
export function createCommandNoticeMessage(code: CommandStatusType, message: string, details?: Record<string, unknown>): NostrWSMessage {
  return ['NOTICE', {
    code,
    message,
    ...details && { details }
  }];
}
