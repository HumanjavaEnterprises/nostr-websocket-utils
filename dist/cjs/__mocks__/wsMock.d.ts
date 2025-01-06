declare class MockWebSocket {
    static OPEN: number;
    static CLOSED: number;
    static CONNECTING: number;
    static CLOSING: number;
    url: string;
    readyState: number;
    onopen: ((event: Event) => void) | null;
    onclose: ((event: CloseEvent) => void) | null;
    onmessage: ((event: MessageEvent) => void) | null;
    eventListeners: {
        [type: string]: ((data: Buffer) => void)[];
    };
    constructor(url: string | URL, _protocols?: string | string[]);
    send(_data: unknown): void;
    close(): void;
    simulateOpen(): void;
    simulateMessage(data: unknown): void;
    simulateClose(): void;
    addEventListener(type: string, listener: (data: Buffer) => void): void;
    dispatchEvent(event: Event | CloseEvent | MessageEvent): boolean;
}
declare const mockWebSocket: MockWebSocket;
export default mockWebSocket;
//# sourceMappingURL=wsMock.d.ts.map