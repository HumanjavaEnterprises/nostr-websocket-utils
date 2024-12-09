Nostr Websocket Utils

[![npm version](https://img.shields.io/npm/v/@humanjavaenterprises/nostr-websocket-utils.svg)](https://www.npmjs.com/package/@humanjavaenterprises/nostr-websocket-utils)
[![License](https://img.shields.io/npm/l/@humanjavaenterprises/nostr-websocket-utils.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/LICENSE)
[![Build Status](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/workflows/CI/badge.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A TypeScript library providing WebSocket utilities for Nostr applications, with robust connection handling, automatic reconnection, and channel-based messaging. Perfect for building Nostr relays and clients with enterprise-grade reliability.

## Features

- 🔄 Automatic reconnection with exponential backoff
- 💓 Heartbeat monitoring with configurable intervals
- 📨 Message queueing during disconnections
- 📢 Channel-based broadcasting with subscription management
- 🔒 Type-safe message handling with required handlers
- 📝 Built-in logging with customizable logger
- 🛡️ Comprehensive error handling and propagation
- 🧪 100% test coverage
- 🔌 Ready-to-use with NestJS and other frameworks

## Installation

```bash
npm install @humanjavaenterprises/nostr-websocket-utils
```

## What's New in v0.2.1

- Fixed WebSocket cleanup and termination issues
- Enhanced error handling and propagation
- Improved test coverage and reliability
- Better TypeScript type safety
- Updated documentation

## Breaking Changes in v0.2.0

- Introduced required handlers pattern
- Added subscription management
- NestJS integration support

## What's New in v0.2.0

- Enhanced error handling and propagation
- Improved WebSocket cleanup and termination
- Fixed message handler context in client
- Added subscription management
- Better TypeScript type safety
- Comprehensive test coverage
- NestJS integration support

## Usage

### Server Example

```typescript
import express from 'express';
import { createServer } from 'http';
import { NostrWSServer } from '@humanjavaenterprises/nostr-websocket-utils';
import winston from 'winston';

const app = express();
const server = createServer(app);

// Create a logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Create WebSocket server with options
const wsServer = new NostrWSServer(server, {
  logger,
  heartbeatInterval: 30000,
  handlers: {
    message: async (ws, message) => {
      // Handle incoming messages
      console.log('Received:', message);
      // You can use ws.authenticated and ws.subscriptions
      // to manage client state
    },
    error: (ws, error) => {
      console.error('WebSocket error:', error);
    },
    close: (ws) => {
      console.log('Client disconnected');
    }
  }
});

// Start HTTP server
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Client Example

```typescript
import { NostrWSClient } from '@humanjavaenterprises/nostr-websocket-utils';

const client = new NostrWSClient('ws://localhost:3000', {
  logger: console,
  heartbeatInterval: 30000,
  handlers: {
    message: async (ws, message) => {
      console.log('Received:', message);
    },
    error: (ws, error) => {
      console.error('Error:', error);
    },
    close: (ws) => {
      console.log('Connection closed');
    }
  }
});

// Connect to server
client.connect();

// Send a message
client.send({ type: 'EVENT', data: { /* ... */ } });

// Subscribe to a channel
client.subscribe('channel1');

// Authenticate (if needed)
client.authenticate({ /* auth event */ });

// Close connection when done
client.close();
```

## Framework Integration

### NestJS Integration

The library provides seamless integration with NestJS through a custom WebSocket adapter. See our [NestJS integration guide](docs/nestjs-integration.md) for details.

## Key Features

### 1. Nostr Protocol Support
- Built-in support for core Nostr protocol message types
- Perfectly aligned with Nostr's pub/sub model
- Type-safe message handling for all Nostr events

### 2. Advanced WebSocket Management
- Automatic reconnection with exponential backoff
- Heartbeat monitoring to detect stale connections
- Message queueing during disconnections
- Clean connection termination

### 3. Enterprise Features
- Comprehensive error handling and propagation
- Built-in logging with customizable logger
- Connection statistics and monitoring
- Channel-based broadcasting
- Authentication support

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
