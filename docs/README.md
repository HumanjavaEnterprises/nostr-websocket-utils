**nostr-websocket-utils v0.2.5**

***

# nostr-websocket-utils

[![npm version](https://img.shields.io/npm/v/@humanjavaenterprises/nostr-websocket-utils.svg)](https://www.npmjs.com/package/@humanjavaenterprises/nostr-websocket-utils)
[![License](https://img.shields.io/npm/l/@humanjavaenterprises/nostr-websocket-utils.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/LICENSE)
[![Build Status](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/workflows/CI/badge.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/actions)
[![Documentation](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/workflows/Documentation/badge.svg)](https://humanjavaenterprises.github.io/nostr-websocket-utils/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A TypeScript library for building Nostr protocol WebSocket clients and servers.

## Features

- 🚀 Full Nostr protocol support
- 🔒 Secure WebSocket connections
- ♥️ Heartbeat mechanism for connection health
- 🔄 Automatic reconnection handling
- 📝 Comprehensive logging
- 🎯 Type-safe message handling
- 📦 Easy to use API

## Installation

```bash
npm install @humanjavaenterprises/nostr-websocket-utils
```

## Quick Start

### Creating a Nostr WebSocket Client

```typescript
import { NostrWSClient } from '@humanjavaenterprises/nostr-websocket-utils';

const client = new NostrWSClient('wss://relay.example.com', {
  logger: console,
  heartbeatInterval: 30000,
  handlers: {
    message: async (msg) => console.log('Received:', msg),
    error: (err) => console.error('Error:', err),
    close: () => console.log('Connection closed')
  }
});

await client.connect();
```

### Creating a Nostr WebSocket Server

```typescript
import { createNostrServer } from '@humanjavaenterprises/nostr-websocket-utils';

const server = await createNostrServer(8080, {
  logger: console,
  heartbeatInterval: 30000,
  handlers: {
    message: async (ws, msg) => {
      console.log('Received message:', msg);
      // Handle the message
    }
  }
});
```

## Documentation

Comprehensive API documentation is available in our [documentation site](https://humanjavaenterprises.github.io/nostr-websocket-utils/). Here's what you'll find:

### Core Components
- [NostrWSClient](_media/NostrWSClient.md) - WebSocket client implementation
- [NostrWSServer](_media/NostrWSServer.md) - WebSocket server implementation
- [NostrServer](_media/NostrServer.md) - High-level Nostr server

### Types and Interfaces
- [NostrWSMessage](_media/NostrWSMessage.md) - Message structure
- [NostrWSOptions](_media/NostrWSOptions.md) - Configuration options
- [NostrWSSubscription](_media/NostrWSSubscription.md) - Subscription interface
- [ExtendedWebSocket](_media/ExtendedWebSocket.md) - Enhanced WebSocket interface

### Utility Functions
- [createServer](_media/createServer.md) - Server creation helper
- [getLogger](_media/getLogger.md) - Logging utility

### Type Definitions
- [MessageType](_media/NostrWSMessageType.md) - Message type enumeration
- [Global Types](_media/globals.md) - Global type definitions

## Examples

### Subscribe to a Channel

```typescript
client.subscribe('my-channel', {
  filter: {
    authors: ['pubkey1', 'pubkey2'],
    kinds: [1]
  }
});
```

### Broadcast a Message

```typescript
server.broadcast({
  type: 'event',
  data: {
    content: 'Hello everyone!',
    kind: 1
  }
});
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](_media/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](_media/LICENSE) file for details.

## Related Projects

- [nostr-protocol](https://github.com/nostr-protocol/nostr)
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools)

## Support

If you have any questions or need help, please:

1. Check the [documentation](https://humanjavaenterprises.github.io/nostr-websocket-utils/)
2. Open an [issue](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/issues)
3. Join our [Discord community](https://discord.gg/your-discord)
