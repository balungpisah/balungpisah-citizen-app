# Contributing to Web Citizen

Thank you for your interest in contributing to Web Citizen! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/balungpisah-citizen-app.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Code Style

This project uses ESLint and Prettier for code formatting. The configuration is set up to run automatically on staged files via Husky.

- **ESLint**: Enforces code quality rules
- **Prettier**: Handles code formatting

To manually run linting and formatting:

```bash
# Run ESLint
npm run lint

# Run ESLint with auto-fix
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without modifying files
npm run format:check
```

### Commit Messages

We follow conventional commit messages for clarity:

```
type(scope): description

Examples:
feat(reports): add filtering by status
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(ui): adjust button spacing
refactor(api): simplify data fetching hooks
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Pull Request Process

1. Ensure your code passes all linting checks
2. Update documentation if needed
3. Create a pull request with a clear title and description
4. Link any related issues

### Branch Naming

Use descriptive branch names:

- `feature/add-report-filtering`
- `fix/login-redirect-bug`
- `docs/update-api-guide`
- `refactor/simplify-hooks`

## Project Guidelines

### Architecture

Please read our [Architecture Guide](docs/development/ARCHITECTURE.md) before making changes. Key points:

- Write UI directly in `page.tsx` files
- Extract components only when used 3+ times
- Use direct imports, avoid barrel exports
- Use underscore prefix for non-route folders (`_components/`)

### API Integration

See [API Integration Guide](docs/development/API_INTEGRATION.md) for data fetching patterns:

- Use `useOne` for single resources
- Use `useList` for collections
- Use `useMutation` for create/update/delete

### Frontend Guidelines

Review [Frontend Guidelines](docs/development/FRONTEND_GUIDELINES.md) for:

- Component patterns
- Loading states
- Error handling
- Form guidelines

## Reporting Issues

When reporting issues, please include:

1. A clear description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Browser/environment information
5. Screenshots if applicable

## Questions?

If you have questions, feel free to open an issue for discussion.

---

Thank you for contributing!
