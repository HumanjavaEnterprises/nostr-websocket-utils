/**
 * @file NIP-20 Command Results implementation
 * @module nips/nip-20
 */

import { NostrWSMessage } from '../types';
import { getLogger } from '../utils/logger';

const logger = getLogger('NIP-20');

/**
 * Command status types
 */
export enum CommandStatus {
  SUCCESS = 'success',
  ERROR = 'error',
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
 * Command message data interface
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
  if (!message.data || typeof message.data !== 'object') {
    logger.debug('Invalid command message data');
    return false;
  }

  const data = message.data as CommandMessageData;

  // For OK/NOTICE messages
  if (message.type === 'OK') {
    if (!data.event_id || typeof data.event_id !== 'string') {
      logger.debug('Invalid event_id in OK message');
      return false;
    }

    if (typeof data.status !== 'boolean') {
      logger.debug('Invalid status in OK message');
      return false;
    }
  }

  // For NOTICE messages
  if (message.type === 'NOTICE' && data.code) {
    if (!Object.values(CommandStatus).includes(data.code as CommandStatus)) {
      logger.debug('Invalid command status code');
      return false;
    }
  }

  // Optional fields validation
  if (data.message && typeof data.message !== 'string') {
    logger.debug('Invalid message field');
    return false;
  }

  if (data.details && typeof data.details !== 'object') {
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
  return {
    type: 'OK',
    data: {
      event_id: eventId,
      status: success,
      ...details && { details }
    }
  };
}

/**
 * Creates a NOTICE message
 */
export function createCommandNoticeMessage(code: CommandStatusType, message: string, details?: Record<string, unknown>): NostrWSMessage {
  return {
    type: 'NOTICE',
    data: {
      code,
      message,
      ...details && { details }
    }
  };
}
