import { EventEmitter } from 'events';
import type { NostrWSMessage } from '../types/messages.js';
import type { NostrWSSocket } from '../types/socket.js';
import type { IncomingMessage } from 'http';
import type { Socket } from 'net';
import type { WebSocket } from 'ws';
interface MockServerOptions {
    port?: number;
    host?: string;
    [key: string]: unknown;
}
export declare class MockServer extends EventEmitter {
    clients: Set<NostrWSSocket>;
    options: MockServerOptions;
    path: string;
    address: string;
    constructor(options?: MockServerOptions);
    listen(port: number, cb?: () => void): void;
    handleConnection: import("vitest").Mock<(socket: NostrWSSocket) => void>;
    handleMessage: import("vitest").Mock<(socket: NostrWSSocket, message: NostrWSMessage) => void>;
    handleClose: import("vitest").Mock<(socket: NostrWSSocket) => void>;
    broadcast: import("vitest").Mock<(message: NostrWSMessage) => void>;
    handleUpgrade: import("vitest").Mock<(request: IncomingMessage, socket: Socket, head: Buffer, callback: (ws: WebSocket) => void) => void>;
    shouldHandle: import("vitest").Mock<(_request: IncomingMessage) => boolean>;
}
export {};
//# sourceMappingURL=mockserver.d.ts.map