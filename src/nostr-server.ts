import { Server as WebSocketServer } from 'ws';
import { getLogger } from './utils/logger';
import { NostrWSSocket, NostrWSServerOptions, NostrWSServerMessage } from './types/nostr';

/**
 * Represents a Nostr WebSocket server
 */
export class NostrWSServer {
  /**
   * The underlying WebSocket server instance
   */
  private server: WebSocketServer;

  /**
   * Logger instance for this server
   */
  private logger = getLogger('NostrWSServer');

  /**
   * Creates a new Nostr WebSocket server instance
   * 
   * @param {NostrWSServerOptions} options - Server configuration options
   */
  constructor(options: NostrWSServerOptions) {
    this.server = new WebSocketServer({ port: options.port });
    
    /**
     * Handles incoming WebSocket connections
     * 
     * @param {NostrWSSocket} socket - The connected WebSocket client
     */
    this.server.on('connection', (socket: NostrWSSocket) => {
      socket.subscriptions = new Set();
      socket.isAlive = true;
      
      if (options.onConnection) {
        options.onConnection(socket);
      }

      /**
       * Handles incoming messages from the client
       * 
       * @param {Buffer | ArrayBuffer | Buffer[]} data - The incoming message data
       */
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

      /**
       * Handles client disconnections
       */
      socket.on('close', () => {
        if (options.handlers?.close) {
          options.handlers.close(socket);
        }
      });

      /**
       * Handles WebSocket errors
       * 
       * @param {Error} error - The error that occurred
       */
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

        /**
         * Handles WebSocket pong responses
         */
        socket.on('pong', () => {
          socket.isAlive = true;
        });

        /**
         * Handles client disconnections (again, to clear the interval)
         */
        socket.on('close', () => {
          clearInterval(interval);
        });
      }
    });
  }

  /**
   * Closes the WebSocket server
   */
  public close(): void {
    this.server.close();
  }
}

/**
 * Creates a new Nostr WebSocket server instance
 * 
 * @param {NostrWSServerOptions} options - Server configuration options
 * @returns {NostrWSServer} The created server instance
 */
export function createWSServer(options: NostrWSServerOptions): NostrWSServer {
  return new NostrWSServer(options);
}
