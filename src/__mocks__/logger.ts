type LoggerFunction = (message: string, ...args: unknown[]) => void;

interface MockLogger {
  debug: LoggerFunction;
  info: LoggerFunction;
  warn: LoggerFunction;
  error: LoggerFunction;
}

export const getLogger = (_name: string): MockLogger => ({
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
});
