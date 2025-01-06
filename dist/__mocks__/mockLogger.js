import { vi } from 'vitest';
export class MockPinoLogger {
    constructor() {
        this.level = 'debug';
        this.levelVal = 20;
        this.version = '8.0.0';
        this.LOG_VERSION = 1;
        this.useLevelLabels = true;
        this.useOnlyCustomLevels = false;
        this.customLevels = {};
        this.debug = vi.fn();
        this.info = vi.fn();
        this.warn = vi.fn();
        this.error = vi.fn();
        this.fatal = vi.fn();
        this.trace = vi.fn();
        this.silent = vi.fn();
        this.levels = {
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
        this.bindings = () => ({});
        this.flush = () => Promise.resolve();
        this.isLevelEnabled = () => true;
    }
    child(_bindings, _options) {
        return new MockPinoLogger();
    }
    static create() {
        return new MockPinoLogger();
    }
}
export const createMockLogger = () => MockPinoLogger.create();
//# sourceMappingURL=mockLogger.js.map