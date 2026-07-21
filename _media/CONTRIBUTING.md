# Contributing to @humanjavaenterprises/nostr-websocket-utils

First off, thank you for considering contributing to our WebSocket utilities for Nostr! It's people like you that make the Nostr ecosystem thrive.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include any error messages or logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* A clear and descriptive title
* A detailed description of the proposed functionality
* Explain why this enhancement would be useful
* List any similar features in other projects if applicable

### Development Process

1. Fork the repo
2. Create a new branch from `main`
3. Make your changes
4. Run the tests (`npm test`)
5. Push to your fork
6. Submit a Pull Request

### Setup Development Environment

```bash
# Clone your fork
git clone git@github.com:your-username/nostr-websocket-utils.git

# Install dependencies
cd nostr-websocket-utils
npm install

# Run tests
npm test

# Build the project
npm run build
```

### Testing

We use Jest for testing. Please ensure all new code includes appropriate tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Coding Style

* We use ESLint and Prettier for code formatting
* Use TypeScript for all new code
* Follow existing patterns in the codebase
* Document all public APIs using TSDoc comments

### Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update documentation for any changed functionality
3. Add tests for new functionality
4. Ensure all tests pass
5. Update the version number in package.json following [SemVer](http://semver.org/)
6. The PR will be merged once you have the sign-off of at least one maintainer

## Documentation

* Update the README.md if you change functionality
* Document new functions/types with TSDoc comments
* Include code examples for new features

## Financial Contributions

We accept donations through:
* GitHub Sponsors
* Bitcoin/Lightning Network
* NOSTR Zaps

## Questions?

Feel free to create an issue labeled 'question' if you need help or clarification.

Thank you for contributing! 🚀
