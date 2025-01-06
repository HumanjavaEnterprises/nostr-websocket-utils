import { EventEmitter } from 'events';
interface WebSocketEventBase {
    type: string;
    target: WebSocket;
    currentTarget: WebSocket;
}
interface WebSocketMessageEvent extends WebSocketEventBase {
    data: string | Buffer;
    isBinary: boolean;
}
interface WebSocketCloseEvent extends WebSocketEventBase {
    code: number;
    reason: string;
    wasClean: boolean;
}
interface WebSocketErrorEvent extends WebSocketEventBase {
    error: Error;
    message: string;
}
export declare class ExtendedWsMock extends EventEmitter {
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSING: 2;
    readonly CLOSED: 3;
    readyState: 0 | 1 | 2 | 3;
    protocol: string;
    url: string;
    bufferedAmount: number;
    extensions: string;
    binaryType: 'nodebuffer' | 'arraybuffer' | 'fragments';
    isPaused: boolean;
    onopen: ((event: WebSocketEventBase) => void) | null;
    onclose: ((event: WebSocketCloseEvent) => void) | null;
    onerror: ((event: WebSocketErrorEvent) => void) | null;
    onmessage: ((event: WebSocketMessageEvent) => void) | null;
    constructor();
    private bindMethods;
    private createWsEvent;
    addEventListener(type: string, listener: (event: WebSocketEventBase) => void): void;
    removeEventListener(type: string, listener: (event: WebSocketEventBase) => void): void;
    send: import("vitest").Mock<[data: string | Buffer<ArrayBufferLike>], this>;
    ping: import("vitest").Mock<[data?: Uint8Array<ArrayBufferLike> | Buffer<ArrayBufferLike> | undefined], this>;
    pong: import("vitest").Mock<[data?: Uint8Array<ArrayBufferLike> | Buffer<ArrayBufferLike> | undefined], this>;
    close: import("vitest").Mock<[code?: number | undefined, reason?: string | undefined], this>;
    terminate: import("vitest").Mock<[], this>;
    pause(): this;
    resume(): this;
    setMaxListeners(n: number): this;
}
export declare const mockWebSocket: ExtendedWsMock;
export {};
//# sourceMappingURL=extendedWsMock.d.ts.map