/**
 * @file Logger utility
 * @module utils/logger
 */

import pino, { Logger } from 'pino';

/**
 * Create a new logger instance
 * @param name Name of the logger
 * @returns Logger instance
 */
export function createLogger(name: string): Logger {
  return pino({
    name,
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime
  });
}

/**
 * Get a logger instance for a specific component
 * @param component Component name for the logger
 * @returns Logger instance
 */
export function getLogger(component: string): Logger {
  return createLogger(component);
}

/**
 * Get a child logger instance
 * @param parent Parent logger instance
 * @param bindings Additional bindings for the child logger
 * @returns Child logger instance
 */
export function getChildLogger(parent: Logger, bindings: object): Logger {
  return parent.child(bindings);
}

export { Logger };
