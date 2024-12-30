import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { getLogger } from '../utils/logger';
import { NostrWSServerSocket, NostrWSServerOptions, NostrWSServerMessage } from '../types/websocket';

const logger = getLogger('NostrWSServer');

/**
 * Represents a Nostr WebSocket server
 */
export class NostrWSServer {
  /**
   * The underlying WebSocket server instance
   */
  private server: WebSocketServer;

  /**
   * Creates a new Nostr WebSocket server instance
   * 
   * @param {NostrWSServerOptions} options - Server configuration options
   */
  constructor(options: NostrWSServerOptions) {
    this.server = new WebSocketServer({ 
      port: options.port,
      host: options.host
    });

    /**
     * Handles incoming WebSocket connections
     * 
     * @param {WebSocket} ws - The connected WebSocket client
     */
    this.server.on('connection', async (ws: WebSocket) => {
      const socket = ws as NostrWSServerSocket;
      socket.clientId = uuidv4();
      socket.subscriptions = new Set();
      socket.isAlive = true;

      logger.info(`Client connected: ${socket.clientId}`);

      /**
       * Calls the onConnection handler if provided
       */
      await options.onConnection?.(socket);

      /**
       * Handles incoming messages from the client
       * 
       * @param {Buffer} data - The incoming message data
       */
      socket.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as NostrWSServerMessage;
          /**
           * Calls the onMessage handler if provided
           */
          await options.onMessage?.(message, socket);
        } catch (error) {
          logger.error('Error processing message:', error);
          /**
           * Calls the onError handler if provided
           */
          options.onError?.(error as Error, socket);
        }
      });

      /**
       * Handles WebSocket errors
       * 
       * @param {Error} error - The error that occurred
       */
      socket.on('error', (error: Error) => {
        logger.error(`Client error (${socket.clientId}):`, error);
        /**
         * Calls the onError handler if provided
         */
        options.onError?.(error, socket);
      });

      /**
       * Handles client disconnections
       */
      socket.on('close', () => {
        logger.info(`Client disconnected: ${socket.clientId}`);
        /**
         * Calls the onClose handler if provided
         */
        options.onClose?.(socket);
      });
    });
  }

  /**
   * Closes the WebSocket server
   */
  public stop(): void {
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
