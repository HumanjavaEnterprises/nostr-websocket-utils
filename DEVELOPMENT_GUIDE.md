# Development Guide

## Architecture Overview

### Transport Layer
The package uses a modular transport layer architecture:

```
transport/
├── base.ts         # Base transport with core functionality
├── websocket.ts    # WebSocket-specific implementation
└── metrics/
    ├── base.ts     # Transport-agnostic metrics
    └── websocket.ts # WebSocket-specific metrics
```

### Key Principles

1. **Transport Agnosticism**
   - Core functionality in base transport
   - Transport-specific features in dedicated modules
   - Easy to add new transport types

2. **Metrics System**
   - Base metrics for all transports
   - Transport-specific metrics in respective modules
   - Optional metrics collection
   - Pluggable scoring strategies

3. **Parent App Integration**
   ```typescript
   // Basic usage
   const transport = new WebSocketTransport();

   // Custom scoring
   transport.setScoringStrategy({
     calculateScore(metrics) {
       return customScore;
     }
   });

   // Disable metrics
   const transport = new WebSocketTransport({ 
     metricsEnabled: false 
   });
   ```

## Adding New Features

### New Transport Type
1. Create new transport file in `transport/`
2. Extend `BaseTransport`
3. Implement required methods
4. Add transport-specific metrics

```typescript
class NewTransport extends BaseTransport {
  async connect(endpoint: string): Promise<void> {
    // Implementation
  }
  
  async disconnect(endpoint: string): Promise<void> {
    // Implementation
  }
  
  async send(endpoint: string, data: any): Promise<void> {
    // Implementation
  }
}
```

### New Metrics
1. Define in appropriate metrics file
2. Add to metrics provider
3. Implement tracking in transport

```typescript
interface CustomMetrics extends BaseMetrics {
  customMetric1: number;
  customMetric2: string;
}

class CustomMetricsProvider implements MetricsProvider<CustomMetrics> {
  // Implementation
}
```

## Testing

1. **Unit Tests**
   - Test each transport independently
   - Mock metrics collection
   - Test scoring strategies

2. **Integration Tests**
   - Test transport with real connections
   - Verify metrics collection
   - Test parent app integration

## Performance Considerations

1. **Metrics Collection**
   - Use sampling for high-frequency events
   - Batch metric updates
   - Allow disabling metrics

2. **Memory Usage**
   - Clean up old metrics
   - Use weak references where appropriate
   - Monitor memory usage

## Documentation

1. **Code Comments**
   - Document public APIs
   - Explain complex algorithms
   - Note performance implications

2. **Type Definitions**
   - Use proper TypeScript types
   - Document type constraints
   - Keep interfaces clean

## Contributing

1. **Pull Requests**
   - Follow architecture principles
   - Add tests for new features
   - Update documentation

2. **Code Style**
   - Use TypeScript
   - Follow existing patterns
   - Keep modules focused
