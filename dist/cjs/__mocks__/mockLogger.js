"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockLogger = exports.MockPinoLogger = void 0;
const vitest_1 = require("vitest");
class MockPinoLogger {
    constructor() {
        this.level = 'debug';
        this.levelVal = 20;
        this.version = '8.0.0';
        this.LOG_VERSION = 1;
        this.useLevelLabels = true;
        this.useOnlyCustomLevels = false;
        this.customLevels = {};
        this.debug = vitest_1.vi.fn();
        this.info = vitest_1.vi.fn();
        this.warn = vitest_1.vi.fn();
        this.error = vitest_1.vi.fn();
        this.fatal = vitest_1.vi.fn();
        this.trace = vitest_1.vi.fn();
        this.silent = vitest_1.vi.fn();
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
exports.MockPinoLogger = MockPinoLogger;
const createMockLogger = () => MockPinoLogger.create();
exports.createMockLogger = createMockLogger;
//# sourceMappingURL=mockLogger.js.map