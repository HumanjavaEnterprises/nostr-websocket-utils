import type { Logger, ChildLoggerOptions, Bindings } from 'pino';
export declare class MockPinoLogger implements Partial<Logger> {
    level: string;
    levelVal: number;
    version: string;
    LOG_VERSION: number;
    useLevelLabels: boolean;
    useOnlyCustomLevels: boolean;
    customLevels: {};
    debug: import("vitest").Mock<any, any>;
    info: import("vitest").Mock<any, any>;
    warn: import("vitest").Mock<any, any>;
    error: import("vitest").Mock<any, any>;
    fatal: import("vitest").Mock<any, any>;
    trace: import("vitest").Mock<any, any>;
    silent: import("vitest").Mock<any, any>;
    levels: {
        values: {
            fatal: number;
            error: number;
            warn: number;
            info: number;
            debug: number;
            trace: number;
        };
        labels: {
            10: string;
            20: string;
            30: string;
            40: string;
            50: string;
            60: string;
        };
    };
    bindings: () => {};
    flush: () => Promise<void>;
    isLevelEnabled: () => boolean;
    child<ChildCustomLevels extends string = never>(_bindings: Bindings, _options?: ChildLoggerOptions<ChildCustomLevels>): Logger<ChildCustomLevels>;
    static create(): Logger;
}
export declare const createMockLogger: () => Logger;
//# sourceMappingURL=mockLogger.d.ts.map