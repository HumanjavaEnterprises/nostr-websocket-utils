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
- ⚡ Full Nostr protocol support with type-safe events

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
- Added comprehensive Nostr event support

## Breaking Changes in v0.2.0

- Introduced required handlers pattern
- Added subscription management
- NestJS integration support

## Nostr Protocol Support

### Event Types

The library provides full support for Nostr event types:

```typescript
type NostrEvent = {
  id?: string;        // Event identifier
  pubkey?: string;    // Author's public key
  created_at?: number; // Unix timestamp
  kind: NostrEventKind; // Event type (0-44)
  tags: string[][];   // Event tags
  content: string;    // Event content
  sig?: string;       // Event signature
};
```

### Supported Event Kinds

- 0: Metadata
- 1: Text Note
- 2: Recommend Server
- 3: Contacts
- 4: Encrypted Direct Message
- 40: Channel Creation
- 41: Channel Metadata
- 42: Channel Message
- 43: Channel Hide Message
- 44: Channel Mute User

### Message Types

The library supports all standard Nostr message types:

```typescript
type NostrWSMessage = [string, NostrEvent] | [string, string];
```

Common message formats:
- `['AUTH', event]`: Authentication messages
- `['EVENT', event]`: Event messages
- `['REQ', subscription_id, filters]`: Subscription requests
- `['CLOSE', subscription_id]`: Close subscription

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
      // Access client state
      console.log('Client authenticated:', ws.authenticated);
      console.log('Client subscriptions:', ws.subscriptions);
      
      // Handle different message types
      if (message[0] === 'AUTH') {
        // Handle authentication
        ws.authenticated = true;
        ws.pubkey = message[1].pubkey;
      } else if (message[0] === 'EVENT') {
        // Handle events
        const event = message[1];
        // Process event based on kind
        switch (event.kind) {
          case 1: // Text Note
            // Handle text note
            break;
          case 4: // Encrypted Direct Message
            // Handle DM
            break;
          // ... handle other kinds
        }
      }
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
import winston from 'winston';

// Create a logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Create WebSocket client
const client = new NostrWSClient('ws://localhost:3000', {
  logger,
  heartbeatInterval: 30000,
  handlers: {
    message: async (ws, message) => {
      // Handle different message types
      if (message[0] === 'EVENT') {
        const event = message[1];
        console.log('Received event:', event);
      }
    },
    error: (ws, error) => {
      console.error('Connection error:', error);
    },
    close: (ws) => {
      console.log('Connection closed');
    }
  }
});

// Connect to server
client.connect();

// Authenticate
const authEvent = {
  id: 'unique-event-id',
  pubkey: 'your-public-key',
  kind: 1,
  content: 'authentication message',
  tags: [],
  created_at: Math.floor(Date.now() / 1000),
  sig: 'event-signature'
};
client.authenticate(['AUTH', authEvent]);

// Subscribe to a channel
client.subscribe('test-channel');

// Send an event
const event = {
  id: 'event-id',
  pubkey: 'your-public-key',
  kind: 1,
  content: 'Hello, Nostr!',
  tags: [],
  created_at: Math.floor(Date.now() / 1000),
  sig: 'event-signature'
};
client.send(['EVENT', event]);
```

## Advanced Features

### Connection Management

- Automatic reconnection with exponential backoff
- Configurable heartbeat intervals
- Message queueing during disconnections
- Connection state tracking

### Authentication

- Support for Nostr authentication protocol
- Client state tracking (authenticated, subscriptions)
- Public key verification

### Subscription Management

- Channel-based subscriptions
- Subscription state tracking
- Automatic resubscription after reconnection

### Error Handling

- Comprehensive error propagation
- Custom error handlers
- Connection error recovery

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
