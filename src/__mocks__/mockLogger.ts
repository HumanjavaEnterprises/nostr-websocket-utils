import { vi } from 'vitest';
import type { Logger, ChildLoggerOptions, Bindings } from 'pino';

export class MockPinoLogger implements Partial<Logger> {
  level: string = 'debug';
  levelVal: number = 20;
  version: string = '8.0.0';
  LOG_VERSION: number = 1;
  useLevelLabels: boolean = true;
  useOnlyCustomLevels: boolean = false;
  customLevels = {};

  debug = vi.fn();
  info = vi.fn();
  warn = vi.fn();
  error = vi.fn();
  fatal = vi.fn();
  trace = vi.fn();
  silent = vi.fn();

  levels = {
    values: {
      fatal: 60,
      error: 50,
      warn: 40,
      info: 30,
      debug: 20,
      trace: 10
    },
    labels: {
      10: 'trace',
      20: 'debug',
      30: 'info',
      40: 'warn',
      50: 'error',
      60: 'fatal'
    }
  };

  bindings = () => ({});
  flush = () => Promise.resolve();
  isLevelEnabled = () => true;
  
  child<ChildCustomLevels extends string = never>(
    _bindings: Bindings,
    _options?: ChildLoggerOptions<ChildCustomLevels>
  ): Logger<ChildCustomLevels> {
    return new MockPinoLogger() as unknown as Logger<ChildCustomLevels>;
  }

  static create(): Logger {
    return new MockPinoLogger() as unknown as Logger;
  }
}

export const createMockLogger = (): Logger => MockPinoLogger.create();
