**nostr-websocket-utils v0.2.4**

***

# @humanjavaenterprises/nostr-websocket-utils

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

Full API documentation is available in the [docs](./docs) directory. The documentation includes:

- Detailed API reference
- Type definitions
- Examples and usage patterns
- Best practices

To generate the documentation locally:

```bash
npm run docs
```

This will create a `docs` directory with the full API documentation.

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
  type: 'EVENT',
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

1. Check the [documentation](./docs)
2. Open an [issue](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/issues)
3. Join our [Discord community](https://discord.gg/your-discord)
