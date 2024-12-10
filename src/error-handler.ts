import { EventEmitter } from 'events';
import type { EnhancedWebSocket, Logger } from './types/index.js';

export class NostrWSErrorHandler extends EventEmitter {
  constructor(private logger: Logger) {
    super();
  }

  public handleConnectionError(error: Error, context?: string): void {
    this.logger.error(`Connection error${context ? ` (${context})` : ''}: ${error.message}`);
    this.emit('error', error);
  }

  public handleMessageError(ws: EnhancedWebSocket, error: Error, messageStr?: string): void {
    this.logger.error(`Message error for client ${ws.id}: ${error.message}`, messageStr || '');
    this.emit('messageError', { ws, error, messageStr });
  }

  public handleAuthenticationError(ws: EnhancedWebSocket, error: Error): void {
    this.logger.error(`Authentication error for client ${ws.id}: ${error.message}`);
    this.emit('authError', { ws, error });
  }

  public handleProtocolError(ws: EnhancedWebSocket, error: Error): void {
    this.logger.error(`Protocol error for client ${ws.id}: ${error.message}`);
    this.emit('protocolError', { ws, error });
  }

  public handleServerError(error: Error): void {
    this.logger.error(`Server error: ${error.message}`);
    this.emit('serverError', error);
  }
}

export class NostrWSError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'NostrWSError';
  }
}

export const ErrorCodes = {
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  MESSAGE_PARSE_ERROR: 'MESSAGE_PARSE_ERROR',
  INVALID_MESSAGE_FORMAT: 'INVALID_MESSAGE_FORMAT',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  PROTOCOL_ERROR: 'PROTOCOL_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;
