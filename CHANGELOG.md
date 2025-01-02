# Changelog

All notable changes to this project will be documented in this file.

## [0.3.9] - 2025-01-02

### Fixed
- Enhanced Node.js compatibility with proper CJS/ESM module support
- Improved module resolution for both CommonJS and ES Module environments
- Fixed package exports to ensure consistent behavior across different Node.js versions

## [0.3.1] - 2024-12-30

### Changed
- Switched testing framework from Jest to Vitest
- Removed nostr-tools dependency
- Updated pino logger to version 8.17.2
- Fixed TypeScript type issues and linting errors
- Improved type safety across the codebase

### Removed
- Removed nostr-tools peer dependency
- Removed Jest-related dependencies

## [0.3.0] - 2024-12-30

### Added
- Comprehensive TypeScript type definitions
- Enhanced WebSocket connection management
- Improved message queue implementation
- Better error handling and logging

### Changed
- Updated to nostr-crypto-utils 0.4.2
- Refactored core functionality for better type safety
- Enhanced documentation
