/**
 * @file Logger utility for Nostr WebSocket operations
 * @module logger
 */

import winston from 'winston';

/**
 * Creates a logger instance with a specific context
 * 
 * @param {string} context - The context identifier for the logger
 * @returns {Logger} A logger instance with debug, info, warn, and error methods
 * 
 * @example
 * ```typescript
 * const logger = getLogger('MyComponent');
 * logger.info('Component initialized');
 * logger.error('An error occurred', new Error('Failed to connect'));
 * ```
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export function getLogger(context: string): winston.Logger {
  return logger.child({ service: context });
}
