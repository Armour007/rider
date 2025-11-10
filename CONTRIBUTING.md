# Contributing to UMA Platform

Thank you for your interest in contributing to UMA! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+
- Docker & Docker Compose
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR_USERNAME/rider.git
   cd rider
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Armour007/rider.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   cd packages/backend
   npm install
   ```

4. **Setup environment**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   # Edit .env with your local credentials
   ```

5. **Start development environment**
   ```bash
   # With Docker
   docker-compose up -d
   
   # Or manually
   npm run dev:backend
   ```

## Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow coding standards
   - Add tests for new features
   - Update documentation

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in the PR template

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all backend code
- Use ESLint and Prettier for formatting
- Follow existing code style
- Use meaningful variable names
- Add JSDoc comments for functions

```typescript
/**
 * Execute the reimbursement handshake
 * @param request - Handshake request containing QR data
 * @returns Handshake response with success status
 */
async executeHandshake(request: HandshakeRequest): Promise<HandshakeResponse> {
  // Implementation
}
```

### File Organization

```
src/
├── services/      # Business logic
├── models/        # Database models
├── controllers/   # Request handlers
├── routes/        # API routes
├── middleware/    # Express middleware
├── utils/         # Utility functions
└── types/         # TypeScript types
```

### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `handshake.service.ts`)
- **Classes**: `PascalCase` (e.g., `HandshakeEngine`)
- **Functions**: `camelCase` (e.g., `executeHandshake`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_STRIKES`)

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(handshake): add CPA bonus calculation
fix(ondc): handle timeout in search API
docs(readme): update installation instructions
test(handshake): add integration tests
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New code has tests
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented code
- [ ] Commits follow convention

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. Automated checks must pass
2. At least one reviewer approval required
3. All comments addressed
4. Branch up to date with main
5. No merge conflicts

## Testing

### Running Tests

```bash
# All tests
npm test

# Backend tests only
cd packages/backend
npm test

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage
```

### Writing Tests

```typescript
describe('HandshakeEngine', () => {
  describe('executeHandshake', () => {
    it('should execute successful handshake', async () => {
      // Arrange
      const engine = new HandshakeEngine();
      const request = { qrData: 'valid-qr' };
      
      // Act
      const result = await engine.executeHandshake(request);
      
      // Assert
      expect(result.success).toBe(true);
    });
  });
});
```

### Test Coverage

- Aim for 80%+ coverage
- Critical paths must be covered
- Edge cases should be tested

## Documentation

### Code Documentation

- Add JSDoc comments to public APIs
- Document complex logic
- Include usage examples
- Keep README updated

### API Documentation

When adding new endpoints:

1. Update `docs/API.md`
2. Include request/response examples
3. Document error codes
4. Add authentication requirements

### Architecture Documentation

For significant changes:

1. Update `docs/ARCHITECTURE.md`
2. Update diagrams if needed
3. Document design decisions

## Project Structure

### Backend

```
packages/backend/
├── src/
│   ├── services/       # Core business logic
│   ├── models/         # Database models
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript definitions
├── tests/              # Test files
└── config/             # Configuration files
```

### Mobile Apps

```
apps/
├── business-app/       # Merchant app
└── rider-app/          # User app
```

## Common Tasks

### Adding a New API Endpoint

1. Create controller in `src/controllers/`
2. Add route in `src/routes/`
3. Register route in `src/index.ts`
4. Add tests in `tests/controllers/`
5. Update API documentation

### Adding a New Service

1. Create service in `src/services/`
2. Add types in `src/types/`
3. Add tests in `tests/services/`
4. Update architecture docs

### Database Changes

1. Update model in `src/models/`
2. Create migration (if needed)
3. Update types
4. Add tests
5. Update seed data

## Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Questions and ideas
- **Email**: dev@uma.com

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing to UMA! 🚀
