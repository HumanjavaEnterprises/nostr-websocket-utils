import { Server as WebSocketServer } from 'ws';
import { getLogger } from './utils/logger';
import { NostrWSSocket, NostrWSServerOptions, NostrWSServerMessage } from './types/nostr';

export class NostrWSServer {
  private server: WebSocketServer;
  private logger = getLogger('NostrWSServer');

  constructor(options: NostrWSServerOptions) {
    this.server = new WebSocketServer({ port: options.port });
    
    this.server.on('connection', (socket: NostrWSSocket) => {
      socket.subscriptions = new Set();
      socket.isAlive = true;
      
      if (options.onConnection) {
        options.onConnection(socket);
      }

      const handleMessage = async (data: Buffer | ArrayBuffer | Buffer[]) => {
        try {
          const message = JSON.parse(data.toString()) as NostrWSServerMessage;
          if (options.handlers?.message) {
            await options.handlers.message(socket, message);
          }
        } catch (error) {
          if (options.handlers?.error) {
            options.handlers.error(socket, error as Error);
          }
        }
      };

      socket.on('message', handleMessage);

      socket.on('close', () => {
        if (options.handlers?.close) {
          options.handlers.close(socket);
        }
      });

      socket.on('error', (error: Error) => {
        if (options.handlers?.error) {
          options.handlers.error(socket, error);
        }
      });

      // Setup heartbeat
      if (options.heartbeatInterval) {
        const interval = setInterval(() => {
          if (!socket.isAlive) {
            socket.terminate();
            clearInterval(interval);
            return;
          }
          socket.isAlive = false;
          socket.ping();
        }, options.heartbeatInterval);

        socket.on('pong', () => {
          socket.isAlive = true;
        });

        socket.on('close', () => {
          clearInterval(interval);
        });
      }
    });
  }

  public close(): void {
    this.server.close();
  }
}

export function createWSServer(options: NostrWSServerOptions): NostrWSServer {
  return new NostrWSServer(options);
}
