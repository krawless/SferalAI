# How to Use This Template (AI Assistant Guide)

This guide is designed for AI assistants implementing features on this full-stack template. It provides a comprehensive reference for the template's structure, configuration, libraries, and workflows.

## Template Overview

This is a modern, production-ready full-stack template with a React frontend and Express backend connected to a MySQL database. The template is fully configured with type safety, validation, theming, and developer tools.

### Tech Stack Summary

**Frontend:**

- React 19 - UI library
- React Router 7 - Client-side routing
- Vite 7 - Build tool and dev server
- TypeScript - Type safety
- Tailwind CSS 3 - Utility-first CSS framework
- shadcn/ui - Component library
- Recharts - Charting library
- Phosphor Icons - Icon library
- Decimal.js - Precise decimal math

**Backend:**

- Bun - JavaScript runtime
- Express 5 - Web framework
- TypeScript - Type safety
- Zod - Schema validation
- CORS - Cross-origin support
- dotenv - Environment management

**Database:**

- MySQL 5.7+ - Relational database
- Prisma ORM - Database toolkit

### Project Structure

```
.
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # shadcn/ui components (Button, Card, Input)
│   │   │   ├── ChartWrapper.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── contexts/     # React contexts
│   │   │   └── ThemeContext.tsx  # Dark/light theme system
│   │   ├── pages/        # Page components
│   │   │   ├── HomePage.tsx
│   │   │   └── ConnectionPage.tsx
│   │   ├── lib/
│   │   │   └── utils.ts  # Utilities including Decimal.js helpers
│   │   ├── App.tsx       # Main app with routing
│   │   ├── main.tsx      # Entry point with providers
│   │   └── index.css     # Global styles with Tailwind
│   ├── .env              # Frontend environment variables (VITE_*)
│   ├── vite.config.ts    # Vite configuration with validation
│   ├── tailwind.config.js
│   ├── components.json   # shadcn/ui configuration
│   └── package.json
│
├── server/               # Bun + Express backend
│   ├── index.ts         # Server entry point with routes
│   ├── lib/
│   │   └── prisma.ts    # Prisma client singleton
│   └── package.json
│
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Database schema definition
│   └── seed.ts          # Database seeding script
│
├── docs/                # Project documentation
├── .env                 # Backend + database environment variables
└── package.json         # Root package.json with all scripts
```

## Environment Variables (CRITICAL)

This template uses **TWO separate `.env` files**. Both are required and all values must be configured.

### Root `.env` (Backend + Database)

Located at project root. Used by both the Express server and Prisma CLI.

```bash
# Server Port - The backend API will run on this port
PORT=YOUR_BACKEND_PORT

# Application Environment
NODE_ENV=development

# Database Connection String
# Used by both Prisma and the server application
# Note: 3306 is the standard MySQL port
DATABASE_URL="mysql://user:password@localhost:3306/database?charset=utf8mb4&collation=utf8mb4_general_ci"
```

**Required Variables:**

- `PORT` - Backend server port (1-65535)
- `NODE_ENV` - Environment mode (development, production, or test)
- `DATABASE_URL` - MySQL connection string starting with `mysql://`

### `frontend/.env` (Frontend Only)

Located at `frontend/.env`. Used by the Vite development server.

```bash
# Frontend Development Server Port
VITE_PORT=YOUR_FRONTEND_PORT

# Backend API URL - MUST match PORT in root .env
VITE_API_URL=http://localhost:${PORT}
```

**Required Variables:**

- `VITE_PORT` - Frontend dev server port (1-65535)
- `VITE_API_URL` - Backend API URL (must be valid http:// or https:// URL, must match PORT from root .env)

### Critical Notes

1. **Port Matching**: The port in `VITE_API_URL` MUST match the `PORT` in root `.env`
2. **Validation**: Both files validate environment variables at startup
3. **Error Messages**: Clear validation errors will be displayed if variables are missing or invalid
4. **Restart Required**: After changing any `.env` file, restart the development servers
5. **Templates Available**: `env.example` and `frontend/env.example` show the required format

## Key Files Reference

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `package.json` | Root scripts and workspace config | Root |
| `server/package.json` | Backend dependencies | `server/` |
| `frontend/package.json` | Frontend dependencies | `frontend/` |
| `vite.config.ts` | Vite config with env validation | `frontend/` |
| `tailwind.config.js` | Tailwind CSS configuration | `frontend/` |
| `components.json` | shadcn/ui configuration | `frontend/` |
| `schema.prisma` | Database schema | `prisma/` |
| `.eslintrc.json` | ESLint config (root/server) | Root |
| `frontend/eslint.config.js` | ESLint flat config (frontend) | `frontend/` |
| `.prettierrc` | Prettier formatting rules | Root |

### Frontend Core Files

- `frontend/src/main.tsx` - Entry point, sets up React with providers
- `frontend/src/App.tsx` - Main application component with routing
- `frontend/src/contexts/ThemeContext.tsx` - Theme provider (dark/light/system)
- `frontend/src/lib/utils.ts` - Utility functions including Decimal.js helpers
- `frontend/src/components/ui/*` - shadcn/ui components

### Backend Core Files

- `server/index.ts` - Express server with routes, validation, error handling
- `server/lib/prisma` - Prisma client singleton instance

### Database Files

- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Database seeding script

### Important Notes

- Both the backend server and Prisma CLI read from the root `.env` file
- The frontend reads only from `frontend/.env`
- Path alias `@/` resolves to `frontend/src/` in frontend code

## Libraries and Usage

### shadcn/ui

Beautiful, accessible React components built on Radix UI.

**Adding Components:**

```bash
cd frontend
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
```

**Using Components:**

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Button variant="default">Click me</Button>
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

**Available Components:**

- Button (variants: default, destructive, outline, secondary, ghost, link)
- Card (with Header, Title, Description, Content, Footer)
- Input (form input)

### Tailwind CSS 3

Utility-first CSS framework with custom theme configuration.

**Theme Variables:**

```css
/* Defined in frontend/src/index.css */
--primary: /* Primary color */
--secondary: /* Secondary color */
--accent: /* Accent color */
--destructive: /* Destructive action color */
--muted: /* Muted background color */
--card: /* Card background color */
```

**Usage:**

```tsx
<div className="bg-primary text-primary-foreground">
  <h1 className="text-2xl font-bold">Hello</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Phosphor Icons

Flexible icon family with multiple weights.

**Usage:**

```tsx
import { Cube, Sun, Moon, Database } from '@phosphor-icons/react';

<Cube size={32} weight="duotone" className="text-primary" />
<Sun size={24} weight="fill" />
<Moon size={20} weight="regular" />
<Database size={28} weight="bold" />
```

**Available Weights:** regular, thin, light, bold, fill, duotone

### Recharts

Charting library with theme-aware colors.

**Usage:**

```tsx
import { ChartWrapper } from '@/components/ChartWrapper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<ChartWrapper title="Sales Chart" description="Monthly sales data">
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line 
      type="monotone" 
      dataKey="sales" 
      stroke="hsl(var(--chart-1))" 
    />
  </LineChart>
</ChartWrapper>
```

**Theme Colors:** `--chart-1`, `--chart-2`, `--chart-3`, `--chart-4`, `--chart-5`

### Decimal.js

Precise decimal arithmetic for financial calculations.

**Utilities Available in `frontend/src/lib/utils.ts`:**

```typescript
import { formatDecimal, addDecimal, multiplyDecimal, subtractDecimal, divideDecimal } from '@/lib/utils';

// Format to 2 decimal places
const formatted = formatDecimal(19.99, 2); // "19.99"

// Precise addition
const sum = addDecimal(0.1, 0.2); // Decimal(0.3)

// Precise multiplication
const total = multiplyDecimal(19.99, 3); // Decimal(59.97)

// Precise subtraction
const diff = subtractDecimal(10.5, 3.2); // Decimal(7.3)

// Precise division
const quotient = divideDecimal(10, 3); // Decimal(3.333...)

// Format for display
const display = formatDecimal(total, 2); // "59.97"
```

**Important:** Always use Decimal.js utilities for financial calculations to avoid floating-point precision errors.

### Zod

TypeScript-first schema validation for API endpoints.

**Usage in Backend (`server/index.ts`):**

```typescript
import { z } from 'zod';

// Define schema
const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
});

// Use validation middleware
app.post('/api/users', validate({ body: createUserSchema }), async (req, res) => {
  // req.body is now type-safe and validated
  const { email, name } = req.body;
  // ... handle request
});
```

The `validate` middleware factory is already implemented in `server/index.ts`.

### Prisma ORM

Type-safe database client with auto-completion.

**Basic Usage:**

```typescript
import prisma from './lib/prisma';

// Find one
const connection = await prisma.connection.findUnique({ where: { id: 1 } });

// Find many
const connections = await prisma.connection.findMany({ where: { status: 'active' } });

// Create
const newConnection = await prisma.connection.create({
  data: { 
    name: 'Production DB',
    host: 'localhost',
    port: 3306,
    database: 'myapp'
  }
});

// Update
const updated = await prisma.connection.update({
  where: { id: 1 },
  data: { name: 'Updated Name' }
});

// Delete
await prisma.connection.delete({ where: { id: 1 } });
```

## Server Management

### Starting Servers

**Start Both Frontend and Backend:**

```bash
bun run dev
```

- Frontend runs on `http://localhost:${VITE_PORT}`
- Backend runs on `http://localhost:${PORT}`

**Start Frontend Only:**

```bash
bun run dev:frontend
```

**Start Backend Only:**

```bash
bun run dev:server
```

### Stopping Servers

Press `Ctrl+C` in the terminal where the servers are running.

### Restarting Servers

1. Stop servers with `Ctrl+C`
2. Run `bun run dev` again

**When to Restart:**

- After changing any `.env` file
- After modifying server configuration
- After installing new dependencies
- If servers become unresponsive

### Health Check

The backend includes a health check endpoint:

```bash
# Check if backend is running and healthy
curl http://localhost:${PORT}/health
```

Returns database connectivity, environment validation, and uptime information.

## Common Commands Quick Reference

### Development

```bash
bun run dev              # Run both frontend and backend
bun run dev:frontend     # Run only frontend
bun run dev:server       # Run only backend
```

### Database (Prisma)

```bash
bun run prisma:generate  # Generate Prisma client (after schema changes)
bun run prisma:push      # Push schema to database (development)
bun run prisma:migrate   # Create and run migrations (production)
bun run prisma:seed      # Seed database with initial data
bun run prisma:studio    # Open Prisma Studio GUI
```

### Build & Preview

```bash
bun run build           # Build frontend for production
bun run preview         # Preview production build locally
```

### Code Quality

```bash
bun run lint            # Run ESLint on frontend
bun run format          # Format all code with Prettier
```

## Adding Features Workflow

### Adding API Endpoints

Edit `server/index.ts`:

```typescript
// Define validation schema (optional but recommended)
const myDataSchema = z.object({
  field: z.string().min(1),
});

// Add endpoint
app.get('/api/my-endpoint', async (req, res) => {
  try {
    const data = await prisma.myModel.findMany();
    res.json({ data });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const errorId = logError(err, { req, additionalContext: { operation: 'my_operation' }});
    res.status(500).json({
      error: 'Failed to fetch data',
      errorId,
      ...(NODE_ENV === 'development' && { message: err.message }),
    });
  }
});

// With validation
app.post('/api/my-endpoint', validate({ body: myDataSchema }), async (req, res) => {
  // req.body is validated
});
```

### Creating React Components

Create in `frontend/src/components/`:

```tsx
// MyComponent.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Component</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Count: {count}</p>
        <Button onClick={() => setCount(count + 1)}>
          Increment
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Best Practices:**

- Use TypeScript for all components
- Import from `@/` alias for src files
- Use shadcn/ui components for consistency
- Implement proper error handling
- Use the theme system for colors

### Adding Database Models

1. Edit `prisma/schema.prisma`:

```prisma
model MyModel {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("my_models")
}
```

2. Generate Prisma client:

```bash
bun run prisma:generate
```

3. Push to database (development):

```bash
bun run prisma:push
```

Or create migration (production):

```bash
bun run prisma:migrate
```

### Adding shadcn/ui Components

```bash
cd frontend
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
npx shadcn@latest add form
```

Components will be added to `frontend/src/components/ui/`.

### Using the Theme System

The template includes a complete theme system with dark/light/system modes:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

Theme preference is automatically saved to localStorage.

## Database Workflow

### Schema Definition

Edit `prisma/schema.prisma`:

```prisma
model Connection {
  id        Int      @id @default(autoincrement())
  name      String
  host      String
  port      Int
  database  String
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("connections")
}

model YourModel {
  id        Int      @id @default(autoincrement())
  title     String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("your_models")
}
```

### Development Workflow

1. **Modify schema** in `prisma/schema.prisma`
2. **Generate client**: `bun run prisma:generate`
3. **Push to database**: `bun run prisma:push`
4. **Test with Studio**: `bun run prisma:studio`

### Production Workflow

1. **Modify schema** in `prisma/schema.prisma`
2. **Generate client**: `bun run prisma:generate`
3. **Create migration**: `bun run prisma:migrate`
4. **Commit migration files** to version control

### Seeding the Database

The seed script (`prisma/seed.ts`) requires the root `.env` file:

```bash
# Ensure .env is configured with DATABASE_URL
bun run prisma:seed
```

The template includes a seed script that reads the DATABASE_URL and creates a Connection record.

### Prisma Studio

Open a GUI to view and edit database data:

```bash
bun run prisma:studio
```

Runs at `http://localhost:5555` by default (Prisma Studio's default port).

## Important Notes for AI Assistants

### Environment Setup

1. **Always check if `.env` files exist** before running commands
2. If they don't exist, inform the user to create them from templates:
   - `cp env.example .env`
   - `cp frontend/env.example frontend/.env`
3. Both files validate environment variables at startup
4. Missing or invalid variables will cause clear error messages

### API Development

1. The backend uses structured error logging with unique error IDs
2. All endpoints should handle errors gracefully
3. Validation is done with Zod schemas via the `validate` middleware
4. CORS is enabled for cross-origin requests
5. The health check endpoint (`/health`) is available for monitoring

### Frontend Development

1. Path alias `@/` points to `frontend/src/`
2. Always use TypeScript with proper types
3. Theme system uses CSS variables (access via `hsl(var(--primary))`)
4. Use Decimal.js utilities for financial calculations
5. ErrorBoundary component is available for error handling

### Database Access

1. Prisma client is a singleton imported from `server/lib/prisma`
2. Always use try-catch blocks for database operations
3. The Connection model stores database connection metadata
4. Schema changes require `prisma:generate` to update the client

### Server Behavior

1. Both frontend and backend validate environment variables at startup
2. Servers must be restarted after `.env` changes
3. The backend runs with watch mode in development (`--watch`)
4. Frontend uses Vite's HMR for instant updates

### Common Patterns

1. **Error Handling**: Use the `logError` utility in backend
2. **Validation**: Use Zod schemas with the `validate` middleware
3. **Decimals**: Use Decimal.js utilities from `lib/utils.ts`
4. **Theming**: Use CSS variables with theme context
5. **Icons**: Use Phosphor Icons with consistent sizing

## MCP Integration

The project includes Model Context Protocol (MCP) configuration for enhanced AI tooling capabilities.

### What is MCP?

MCP (Model Context Protocol) enables AI assistants to interact with external tools and services. This template includes a Playwright MCP server configuration.

### Configuration

**Location:** `.mcp.json` at project root

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {}
    }
  }
}
```

### Use Cases

The Playwright MCP server enables AI assistants to:

- **Browser Automation**: Automate browser interactions for testing
- **E2E Testing**: Test frontend functionality with AI assistance
- **UI Validation**: Verify user interface behavior
- **Screenshot Testing**: Capture and compare visual states
- **Form Testing**: Test form submissions and validation

### Benefits

- ✅ AI assistants can interact directly with your application in a browser
- ✅ Automated testing without manual test writing
- ✅ Quick validation of frontend features
- ✅ Enhanced development workflow with AI tooling

### Usage

AI development tools like Claude can use the MCP configuration to perform browser automation tasks. This is particularly useful when:

- Testing new features in the browser
- Validating UI changes
- Debugging frontend issues
- Creating automated test scenarios

## Troubleshooting Quick Fixes

### 404 Errors

**Problem:** API endpoint returns 404

**Solutions:**

1. Check if the endpoint exists in `server/index.ts`
2. Verify the route path matches the request
3. For `/api/connection`: Ensure database is seeded with `bun run prisma:seed`
4. Check if backend server is running on the correct port

### Port Conflicts

**Problem:** Port already in use

**Solutions:**

1. Check if another process is using the port: `lsof -i :${PORT_NUMBER}` (replace with actual port number)
2. Kill the process: `kill -9 PID`
3. Change the port in `.env` (for backend PORT) or `frontend/.env` (for frontend VITE_PORT)
4. Ensure `VITE_API_URL` matches the backend `PORT`

### Database Connection Errors

**Problem:** Cannot connect to database

**Solutions:**

1. Verify MySQL is running
2. Check `DATABASE_URL` format in root `.env`
3. Ensure database exists
4. Test connection: `bun run prisma:studio`
5. Regenerate Prisma client: `bun run prisma:generate`

### Environment Variable Errors

**Problem:** Missing or invalid environment variables

**Solutions:**

1. Check if `.env` files exist (root and `frontend/`)
2. Verify all required variables are set
3. Match ports: `VITE_API_URL` port must equal `PORT`
4. Restart servers after `.env` changes
5. Check validation error messages in console

### Build Errors

**Problem:** Build fails or dependencies missing

**Solutions:**

1. Install dependencies: `bun install`
2. Install frontend: `cd frontend && bun install`
3. Install backend: `cd server && bun install`
4. Clear node_modules: `rm -rf node_modules && bun install`
5. Regenerate Prisma: `bun run prisma:generate`

### TypeScript Errors

**Problem:** Type errors in code

**Solutions:**

1. Ensure Prisma client is generated: `bun run prisma:generate`
2. Check imports are correct (use `@/` for frontend)
3. Verify TypeScript versions match
4. Restart TypeScript server in IDE

### Frontend Not Loading

**Problem:** Frontend shows blank page or errors

**Solutions:**

1. Check console for errors
2. Verify `VITE_API_URL` in `frontend/.env`
3. Ensure backend is running
4. Check ErrorBoundary isn't catching an error
5. Clear browser cache

### Prisma Errors

**Problem:** Prisma schema or client errors

**Solutions:**

1. Generate client: `bun run prisma:generate`
2. Check `DATABASE_URL` in root `.env`
3. Verify schema syntax in `prisma/schema.prisma`
4. Push schema: `bun run prisma:push`
5. Check MySQL version compatibility (5.7+)

## Additional Resources

### Documentation Files

- `README.md` - Main project documentation
- `docs/QUICKSTART.md` - 5-minute quick start guide
- `docs/ENV_SETUP.md` - Environment configuration details
- `docs/ENV_VALIDATION.md` - Validation system explanation
- `docs/HEALTH_CHECK.md` - Health check endpoint documentation
- `docs/TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- `docs/IMPLEMENTATION_SUMMARY.md` - Detailed feature list
- `docs/PROJECT_STATUS.md` - Current project status

### External Documentation

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [Phosphor Icons](https://phosphoricons.com)
- [Bun](https://bun.sh)
- [Express](https://expressjs.com)
- [Prisma](https://prisma.io)
- [Zod](https://zod.dev)
- [Decimal.js](https://mikemcl.github.io/decimal.js)

---

**Last Updated:** October 2025  
**Version:** 1.0.0
