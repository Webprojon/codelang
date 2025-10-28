# CodeLang

A React application with TypeScript and Tailwind CSS.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Building

```bash
npm run build
```

## Pre-commit Hooks

This project uses Husky and lint-staged to ensure code quality before commits.

### What happens on commit:

- ESLint automatically runs on staged TypeScript and JavaScript files
- Code formatting issues are automatically fixed when possible
- Commit is blocked if there are unfixable linting errors

### Manual linting:

```bash
npm run lint
```

### Setup (already configured):

The pre-commit hooks are already set up with:

- **Husky**: Git hooks management
- **lint-staged**: Runs linters only on staged files
- **ESLint**: Code quality and style checking

### Files configured:

- `.husky/pre-commit`: Runs lint-staged before each commit
- `package.json`: Contains lint-staged configuration
- `eslint.config.js`: ESLint rules and configuration

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-specific components
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API services
├── store/          # State management
├── styles/         # Global styles
└── utils/          # Utility functions
```
