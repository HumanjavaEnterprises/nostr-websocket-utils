/**
 * @file Logger utility
 * @module utils/logger
 */

import pino from 'pino';
import { Logger } from '../types/logger';

const rootLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: true,
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => bindings,
  },
});

/**
 * Creates a logger instance for a specific component
 * @param component Component name for the logger
 * @returns Logger instance
 */
export function getLogger(component: string): Logger {
  return rootLogger.child({ component }) as Logger;
}
