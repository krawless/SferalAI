# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack monorepo template built with React + Vite frontend, Bun + Express backend, and Prisma ORM with MySQL. The project uses Bun as the runtime and package manager for all workspaces.

## Essential Commands

Always read .env before doing any changes. Use only the vars from the .env
When using icons, check if our current icon library have them, and use an appropiate icon, because we often have the issue where you are using icons that doesn't exists.

### Development

```bash
# Run both frontend and backend concurrently (from root)
bun run dev

# Run individually
bun run dev:frontend  # Frontend only
bun run dev:server    # Backend only
```

### Build & Preview

```bash
bun run build    # Build frontend for production
bun run preview  # Preview production build
```

### Database (Prisma)

```bash
bun run prisma:generate  # Generate Prisma client (required after schema changes)
bun run prisma:push      # Push schema changes to database (development)
bun run prisma:migrate   # Create and run migrations (production)
bun run prisma:studio    # Open Prisma Studio GUI
```

### Code Quality

```bash
bun run lint     # Lint frontend code
bun run format   # Format all code with Prettier
```

## Architecture Overview

### Monorepo Structure

- **Root**: Workspace coordination and shared dependencies (Prisma, dotenv)
- **frontend/**: React 19 + Vite 7 SPA with React Router
- **server/**: Bun + Express 5 API server
- **prisma/**: Database schema shared by backend

### Environment Configuration

The project uses **two separate** `.env` files with strict validation:

1. **Root `.env`** (Backend + Database):
   - `PORT`: Backend server port
   - `NODE_ENV`: development | production | test
   - `DATABASE_URL`: MySQL connection string

2. **`frontend/.env`** (Frontend only):
   - `VITE_PORT`: Frontend dev server port
   - `VITE_API_URL`: Backend API URL (must match root PORT)

Both environments are validated at startup with detailed error messages. See `server/index.ts:30-54` and `frontend/vite.config.ts:11-61` for validation logic.

### Backend Architecture

**Key Files:**

- `server/index.ts`: Main Express app with all routes
- `server/lib/prisma`: Prisma client singleton

**Patterns:**

- **Validation Middleware**: Zod-based validation factory at `server/index.ts:104-135`. Use `validate()` to validate body, query, or params before handlers
- **Error Logging**: Centralized error logging utility at `server/index.ts:70-96`. Use `logError(error, { req, additionalContext })` to log errors with correlation IDs
- **Health Check**: `/health` endpoint validates database and environment at `server/index.ts:148-228`
- **CRUD Pattern**: See Connection endpoints (`server/index.ts:247-350`) for reference implementation with pagination, validation, and error handling

**Important**: After modifying `prisma/schema.prisma`, always run `bun run prisma:generate` to regenerate the client.

### Frontend Architecture

**Key Files:**

- `frontend/src/App.tsx`: Root component with React Router setup
- `frontend/src/main.tsx`: Entry point with ThemeProvider
- `frontend/src/lib/utils.ts`: Decimal.js utilities for precise math
- `frontend/src/contexts/ThemeContext.tsx`: Theme management with localStorage persistence

**Patterns:**

- **Routing**: React Router v7 with page components in `frontend/src/pages/`
- **Theming**: Use `useTheme()` hook from ThemeContext for dark/light/system modes
- **Styling**: Tailwind CSS 3 + shadcn/ui components in `frontend/src/components/ui/`
- **Icons**: Phosphor Icons with React (`@phosphor-icons/react`)
- **Precise Math**: Use Decimal.js utilities from `lib/utils.ts` for financial calculations. Always format to 2 decimal places in UI.

**Adding shadcn/ui Components:**

```bash
cd frontend
npx shadcn@latest add <component-name>
```

### Database Patterns

**Schema Location**: `prisma/schema.prisma`

**Current Models:**

- `Connection`: Database connection metadata with CRUD endpoints

**Workflow After Schema Changes:**

1. Edit `prisma/schema.prisma`
2. Run `bun run prisma:generate` (regenerate client)
3. Run `bun run prisma:push` (dev) or `bun run prisma:migrate` (prod)

### API Conventions

**Response Format:**

```typescript
// Success with data
{ data: T, message?: string }

// Success with pagination
{ data: T[], pagination: { page, limit, total, totalPages } }

// Error
{ error: string, errorId?: string, message?: string, details?: ValidationError[] }
```

**Status Codes:**

- 200: Success
- 201: Created
- 400: Validation error (with details array)
- 404: Not found
- 500: Internal error (with errorId for correlation)
- 503: Service unhealthy (health check)

## Important Practices

### Always Use Bun

Use `bun` instead of npm, pnpm, yarn, or node. This applies to:

- Installing dependencies: `bun install`
- Running scripts: `bun run <script>`
- Executing files: `bun <file>`

### Type Safety

- All files use TypeScript
- Use Zod for runtime validation in backend
- Leverage Prisma's generated types for database operations

### Error Handling

- Backend: Use `logError()` utility for structured logging with correlation IDs
- Always include error IDs in 500 responses
- In development mode, include detailed error info; in production, provide generic messages

### Decimal Math

Use Decimal.js utilities from `frontend/src/lib/utils.ts`:

- `formatDecimal(value, decimals)`: Format for display
- `addDecimal(...values)`: Precise addition
- `multiplyDecimal(...values)`: Precise multiplication
- Always format to 2 decimal places in UI

### Code Style

- Run `bun run format` before committing
- ESLint configured differently: frontend uses flat config (`eslint.config.js`), root/server use `.eslintrc.json`

## Common Workflows

### Adding a New Database Model

1. Add model to `prisma/schema.prisma`
2. Run `bun run prisma:generate`
3. Run `bun run prisma:push` (or migrate)
4. Create Zod validation schemas in `server/index.ts`
5. Add CRUD endpoints following Test model pattern
6. Create frontend page/component as needed

### Adding a New API Endpoint

1. Define Zod validation schemas if needed
2. Add route with `validate()` middleware
3. Implement handler with try-catch and `logError()`
4. Return standard response format
5. Test with frontend or API client

### Adding a New Frontend Page

1. Create page component in `frontend/src/pages/`
2. Add route to `App.tsx`
3. Add navigation link to `Navigation.tsx` if needed
4. Use `useTheme()` for theme-aware components
5. Use Decimal.js utilities for any numeric operations

## Health Monitoring

The `/health` endpoint at `server/index.ts:148-228` provides:

- Database connectivity check
- Environment variable validation
- System uptime and metadata
- HTTP 200 (healthy) or 503 (unhealthy)

Use for Docker health checks, Kubernetes probes, or monitoring services.

## MCP Integration

The project includes Model Context Protocol (MCP) server configuration for enhanced AI tooling:

**.mcp.json Configuration:**

- Playwright MCP server configured for browser automation testing
- Enables AI assistants to interact with browser-based features
- Useful for E2E testing and automated UI interactions

## Documentation

Comprehensive documentation available in `docs/`:

- `HOW_TO_USE_TEMPLATE.md`: AI assistant guide
- `ENV_SETUP.md`: Environment configuration details
- `ENV_VALIDATION.md`: Validation system explanation
- `HEALTH_CHECK.md`: Health endpoint integration
- `QUICKSTART.md`: 5-minute setup guide
- `TROUBLESHOOTING.md`: Common issues and solutions
