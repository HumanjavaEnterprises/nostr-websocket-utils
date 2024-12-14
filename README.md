# Nostr Websocket Utils

[![npm version](https://img.shields.io/npm/v/nostr-websocket-utils.svg)](https://www.npmjs.com/package/nostr-websocket-utils)
[![License](https://img.shields.io/npm/l/nostr-websocket-utils.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/LICENSE)
[![Build Status](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/workflows/CI/badge.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A TypeScript library providing WebSocket utilities for Nostr applications, focusing on robust connection handling, automatic reconnection, and channel-based messaging. This library has been streamlined to remove any DOM-related code, enhancing performance and maintainability.

## Features

- 🔄 Automatic reconnection with configurable attempts
- 💓 Heartbeat monitoring with configurable intervals
- 📨 Message queueing during disconnections
- 📢 Channel-based broadcasting with filtered subscriptions
- 🔒 Type-safe message handling with required handlers
- 📝 Built-in logging with Winston integration
- 🛡️ Comprehensive error handling and validation
- 🧪 100% test coverage with Jest
- 📦 Zero DOM dependencies

## Installation

```bash
npm install nostr-websocket-utils
```

## Breaking Changes in v0.2.2

- 🔥 Removed all DOM-related code for better server-side compatibility
- 🆔 Added UUID support for message tracking and correlation
- 🔌 Introduced `WebSocketImpl` option for custom WebSocket implementations
- 🛡️ Enhanced TypeScript type safety and validation
- 🔄 Improved reconnection and error handling logic
- 📝 Added comprehensive logging support

## Usage

### Server Example

```typescript
import { NostrWSServer } from 'nostr-websocket-utils';
import { WebSocketServer } from 'ws';
import { getLogger } from './utils/logger';

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// Initialize NostrWSServer with handlers
const server = new NostrWSServer(wss, {
  logger: getLogger('nostr-server'),
  heartbeatInterval: 30000, // Optional: 30 seconds
  handlers: {
    // Required: Handle incoming messages
    message: async (ws, message) => {
      switch (message.type) {
        case 'subscribe':
          // Handle subscription
          ws.subscriptions?.add(message.data.channel);
          break;
        case 'event':
          // Broadcast to relevant subscribers
          server.broadcastToChannel(message.data.channel, message);
          break;
      }
    },
    // Optional: Handle errors
    error: (ws, error) => {
      logger.error('WebSocket error:', error);
    },
    // Optional: Handle client disconnection
    close: (ws) => {
      logger.info(`Client ${ws.clientId} disconnected`);
    }
  }
});
```

### Client Example

```typescript
import { NostrWSClient } from 'nostr-websocket-utils';
import { getLogger } from './utils/logger';

const client = new NostrWSClient('ws://localhost:8080', {
  logger: getLogger('nostr-client'),
  heartbeatInterval: 30000,
  handlers: {
    // Required: Handle incoming messages
    message: async (ws, message) => {
      console.log('Received:', message);
    }
  }
});

// Listen for connection events
client.on('connect', () => {
  console.log('Connected to server');
  
  // Subscribe to a channel
  client.subscribe('my-channel');
  
  // Send an event
  client.send({
    type: 'event',
    data: {
      channel: 'my-channel',
      content: 'Hello, Nostr!'
    }
  });
});

// Connect to server
client.connect();
```

## API Reference

### NostrWSServer

The server-side WebSocket handler with support for channels and broadcasting.

```typescript
class NostrWSServer {
  constructor(wss: WebSocketServer, options: NostrWSOptions);
  
  // Broadcast to all connected clients
  broadcast(message: NostrWSMessage): void;
  
  // Broadcast to specific channel subscribers
  broadcastToChannel(channel: string, message: NostrWSMessage): void;
  
  // Close the server and all connections
  close(): void;
}
```

### NostrWSClient

The client-side WebSocket handler with automatic reconnection and message queueing.

```typescript
class NostrWSClient {
  constructor(url: string, options: NostrWSOptions);
  
  // Connect to the server
  connect(): void;
  
  // Subscribe to a channel
  subscribe(channel: string, filter?: unknown): void;
  
  // Unsubscribe from a channel
  unsubscribe(channel: string): void;
  
  // Send a message to the server
  send(message: NostrWSMessage): Promise<void>;
  
  // Close the connection
  close(): void;
}
```

### NostrWSMessage

The standard message format for communication.

```typescript
interface NostrWSMessage {
  id?: string;           // Auto-generated UUID if not provided
  type: string;          // Message type (e.g., 'subscribe', 'event')
  data: {
    channel?: string;    // Target channel for subscription/broadcast
    [key: string]: any;  // Additional message data
  };
}
```

## Why Choose This Library

### 1. Nostr-Optimized
- Built specifically for Nostr protocol requirements
- Efficient pub/sub model with filtered subscriptions
- Type-safe message handling for all Nostr events

### 2. Production-Ready
- Comprehensive error handling and recovery
- Memory-efficient subscription management
- Built-in logging and monitoring
- Extensive test coverage

### 3. Developer-Friendly
- Clear TypeScript definitions
- Flexible configuration options
- Detailed documentation
- Active maintenance

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
