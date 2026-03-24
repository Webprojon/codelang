# Codelang

A modern code sharing and Q&A platform built with React and TypeScript. Share code snippets, ask programming questions, and collaborate with developers worldwide.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Code Quality](#code-quality)
- [Contributing](#contributing)

## Features

### Code Snippets

- Share code snippets with syntax highlighting
- Support for multiple programming languages (JavaScript, Python, Java, C++, HTML, CSS, JSON)
- Like and dislike snippets
- Comment on snippets
- Edit and delete your own snippets
- View all your snippets in one place

### Questions & Answers

- Post programming questions with attached code
- Provide answers to questions
- Mark questions as resolved
- Edit and delete your own questions and answers
- Browse questions with pagination

### User Management

- User registration and authentication
- Protected routes for authenticated users
- User profiles with statistics
- Account management (change username, password)
- Browse all users

### Additional Features

- Responsive design with modern UI
- Code editor with CodeMirror
- Real-time form validation
- Error handling and user feedback
- Pagination for large datasets
- Code splitting for optimal performance

## Tech Stack

### Core

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing

### State Management & Data Fetching

- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Server state management and data fetching

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management
- **React Hot Toast** - Toast notifications
- **CodeMirror** - Code editor component

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Testing Library** - React component testing
- **Husky** - Git hooks
- **lint-staged** - Pre-commit hooks

### HTTP Client

- **Axios** - HTTP client for API requests

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **Git**

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Webprojon/codelang.git
cd codelang
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see [Configuration](#configuration))

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://codelang.vercel.app
```

- `VITE_API_BASE_URL`: Base URL for the API backend (default: `https://codelang.vercel.app`)

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@shared` - Shared components, utilities, and types
- `@features` - Feature-specific modules
- `@assets` - Static assets
- `@src` - Source directory root

These are configured in `vite.config.ts` and `tsconfig.json`.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Development Server

The development server runs on port 3000 by default. It includes:

- Hot Module Replacement (HMR)
- API proxy configuration for `/api` routes
- Source maps for debugging

### Code Splitting

The build configuration includes automatic code splitting:

- React vendor bundle
- React Query vendor bundle
- CodeMirror editor vendor bundle
- Icons vendor bundle
- Form libraries vendor bundle
- Utility libraries vendor bundle

## Building for Production

1. Build the application:

```bash
npm run build
```

2. The production build will be in the `dist` directory

3. Preview the production build:

```bash
npm run preview
```

### Build Optimizations

- Code splitting for optimal bundle sizes
- Tree shaking to remove unused code
- Minification with esbuild
- CSS code splitting
- Asset optimization (inline limit: 4KB)
- Source maps disabled for production

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

Tests are located alongside the components they test:

- Component tests: `src/**/components/__tests__/`
- Hook tests: `src/**/hooks/__tests__/`
- Store tests: `src/**/store/__tests__/`
- Utility tests: `src/shared/utils/__tests__/`

### Test Configuration

- Jest with `ts-jest` for TypeScript support
- `jsdom` environment for React component testing
- Testing Library for component testing utilities
- Coverage reports in `coverage/` directory

## Project Structure

```
codelang/
├── src/
│   ├── features/           # Feature-based modules
│   │   ├── account/        # User account management
│   │   ├── auth/           # Authentication
│   │   ├── home/           # Home page
│   │   ├── questions/      # Q&A feature
│   │   ├── snippets/       # Code snippets feature
│   │   └── users/          # User profiles
│   ├── shared/             # Shared resources
│   │   ├── api/            # API client configuration
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Shared custom hooks
│   │   ├── layouts/        # Layout components
│   │   ├── types/          # Shared TypeScript types
│   │   └── utils/          # Utility functions
│   ├── assets/             # Static assets
│   ├── styles/             # Global styles
│   ├── __tests__/          # Test utilities and setup
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Application entry point
├── public/                 # Public assets
├── dist/                   # Production build output
├── coverage/               # Test coverage reports
├── jest.config.cjs         # Jest configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies and scripts
```

### Architecture

The project follows a **feature-based architecture**:

- **Features**: Self-contained modules containing pages, components, hooks, API calls, and types for a specific feature
- **Shared**: Reusable components, utilities, hooks, and types used across multiple features
- **Separation of Concerns**: Each feature manages its own state, API calls, and UI components

## API Integration

### API Client

The application uses Axios with a configured client (`src/shared/api/client.ts`):

- Base URL: `/api` (proxied in development)
- Timeout: 10 seconds
- Credentials: Included in requests (for authentication)
- Automatic error handling
- 401 response handling (automatic logout)

### API Structure

API calls are organized by feature:

- `src/features/*/api/` - Feature-specific API functions
- Uses TanStack Query for caching, refetching, and state management

### Authentication

- JWT-based authentication with HTTP-only cookies
- Automatic token refresh handling
- Protected routes using `ProtectedRoute` component
- Auth state managed with Zustand store

## Deployment

### Vercel Deployment

The project is configured for Vercel deployment with `vercel.json`:

- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- API proxy configuration
- SPA routing support
- Asset caching headers

### Environment Variables

Set the following environment variables in your deployment platform:

- `VITE_API_BASE_URL` - Backend API URL

### Build Process

1. Install dependencies: `npm ci`
2. Build application: `npm run build`
3. Serve `dist` directory

## Code Quality

### Linting

ESLint is configured with:

- React hooks rules
- TypeScript support
- Modern JavaScript standards

### Formatting

Prettier is configured for consistent code formatting:

- Automatic formatting on save (if configured in IDE)
- Pre-commit hooks via lint-staged

### Pre-commit Hooks

Husky and lint-staged ensure code quality:

- Format code with Prettier
- Fix ESLint errors automatically
- Run on staged files before commit

### Type Safety

- Strict TypeScript configuration
- Type checking during build
- Comprehensive type definitions

## Contributing

1. Create a feature branch from `features`
2. Make your changes
3. Write or update tests
4. Ensure all tests pass: `npm test`
5. Ensure linting passes: `npm run lint`
6. Format code: `npm run format`
7. Commit your changes (pre-commit hooks will run automatically)
8. Push to your branch
9. Create a pull request

### Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing project structure
- Write tests for new features
- Use functional components with hooks
- Keep components small and focused
- Use path aliases for imports
- Follow ESLint and Prettier configurations
