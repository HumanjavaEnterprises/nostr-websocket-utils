import { EventEmitter } from 'events';
import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HttpServer } from 'http';
import { ConnectionManager } from './connection-manager.js';
import { NostrWSErrorHandler, NostrWSError, ErrorCodes } from './error-handler.js';
import type {
  NostrWSOptions,
  NostrWSMessage,
  NostrWSServerEvents,
} from './types/index.js';
import { EnhancedWebSocket } from './types/enhanced-websocket.js';

function createLogger() {
  return console;
}

export class NostrWSServer extends EventEmitter {
  private wss: WebSocketServer;
  protected connectionManager: ConnectionManager;
  private options: NostrWSOptions;
  private errorHandler: NostrWSErrorHandler;

  constructor(server: HttpServer, options: Partial<NostrWSOptions> = {}) {
    super();
    this.options = {
      logger: options.logger || createLogger(),
      heartbeatInterval: options.heartbeatInterval || 30000,
      handlers: {
        message: options.handlers?.message || (async () => {}),
        error: options.handlers?.error || (() => {}),
        close: options.handlers?.close || (() => {})
      }
    };

    this.wss = new WebSocketServer({ server });
    this.connectionManager = new ConnectionManager(this.options.logger);
    this.errorHandler = new NostrWSErrorHandler(this.options.logger);
    
    this.setupErrorHandling();
    this.setupServer();
  }

  private setupErrorHandling(): void {
    this.errorHandler.on('error', (error: Error) => {
      this.options.handlers.error(null as any, error);
    });

    this.errorHandler.on('messageError', ({ ws, error }) => {
      this.options.handlers.error(ws, error);
    });

    this.errorHandler.on('protocolError', ({ ws, error }) => {
      this.options.handlers.error(ws, error);
    });
  }

  private setupServer(): void {
    this.wss.on('connection', (ws: WebSocket & Partial<EnhancedWebSocket>) => {
      const extWs = this.connectionManager.addConnection(ws);
      
      extWs.on('message', async (data: Buffer) => {
        const messageStr = data.toString();
        try {
          const message = JSON.parse(messageStr) as NostrWSMessage;
          if (!Array.isArray(message) || message.length !== 2) {
            this.errorHandler.handleProtocolError(
              extWs,
              new NostrWSError('Invalid message format', ErrorCodes.INVALID_MESSAGE_FORMAT, messageStr)
            );
            return;
          }
          
          await this.options.handlers.message(extWs, message);
        } catch (error) {
          this.errorHandler.handleMessageError(extWs, error as Error, messageStr);
        }
      });

      extWs.on('close', () => {
        this.connectionManager.removeConnection(extWs);
        this.options.handlers.close(extWs);
      });

      extWs.on('error', (error: Error) => {
        this.errorHandler.handleConnectionError(error, `Client ${extWs.id}`);
      });
    });

    this.wss.on('error', (error: Error) => {
      this.errorHandler.handleServerError(error);
    });
  }

  public async broadcast(message: NostrWSMessage): Promise<void> {
    await this.connectionManager.broadcast(message);
  }

  public async broadcastToAuthenticated(message: NostrWSMessage): Promise<void> {
    await this.connectionManager.broadcastToAuthenticated(message);
  }

  public async broadcastToSubscription(subscription: string, message: NostrWSMessage): Promise<void> {
    await this.connectionManager.broadcastToSubscription(subscription, message);
  }

  public getStats() {
    return this.connectionManager.getStats();
  }

  public close(): void {
    this.wss.close(() => {
      this.options.logger.info('WebSocket server closed');
    });
  }
}
