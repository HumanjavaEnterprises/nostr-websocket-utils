# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-03-06

### Changed
- **Pino 10:** Upgraded logger from pino ^8.x to ^10.3.1
- **UUID 13:** Upgraded from uuid ^9.x to ^13.0.0
- **Vitest 4:** Upgraded test framework
- **esbuild:** Replaced webpack with esbuild for browser bundling
- **nostr-crypto-utils** dependency upgraded to ^0.6.0
- Dropped Node.js 16 support, CI runs on Node 20.x + 22.x

### Added
- NIP-44 encryption and NIP-46 transport via nostr-crypto-utils v0.5.1
- CommonJS `package.json` in dist/cjs for Node-RED compatibility

### Fixed
- WSS enforcement, payload size limits, backoff jitter, rate limiter cleanup
- Resolved npm audit vulnerabilities
- Fixed broken typedoc links in README

## [0.3.14] - 2025-02-19

### Changed
- Updated dependencies and fixed broken validateResponse import
- Fixed import from nostr-crypto-utils

## [0.3.13] - 2025-01-13

### Added
- Browser support via webpack bundle
- New browser entry point for direct browser usage
- Example HTML file demonstrating browser usage
- Source maps for better debugging
- UMD bundle for CDN usage

### Changed
- Updated package.json to include browser field
- Enhanced build process to support browser environments

## [0.3.11] - 2025-01-05

### Added
- CommonJS support and included dist/ in package

## [0.3.10] - 2025-01-02

### Changed
- Updated nostr-crypto-utils dependency to ^0.4.10 for better ESM compatibility
- Updated to use npm-published nostr-crypto-utils package

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
