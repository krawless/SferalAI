# Reusable Project Template

A modern, production-ready full-stack template with React, Vite, Tailwind CSS 3, shadcn/ui, Bun, Express, and Prisma ORM.

## 🚀 Tech Stack

### Frontend

- **React 19** - UI library
- **Vite 7** - Fast build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Recharts** - Powerful charting library
- **Phosphor Icons** - Flexible icon family
- **Decimal.js** - Precise decimal math operations
- **Inter Font** - Modern, clean typography

### Backend

- **Bun** - Fast JavaScript runtime
- **Express 5** - Web application framework
- **TypeScript** - Type safety
- **Zod** - TypeScript-first schema validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database

- **MySQL 5.7** - Relational database
- **Prisma ORM** - Next-generation ORM
- **UTF-8 (utf8mb4_general_ci)** - Full Unicode support

### Developer Experience

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Hot Module Replacement** - Instant feedback during development
- **Dark/Light Mode** - Built-in theme system with persistence

## 📁 Project Structure

```file
.
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   └── ...       # Custom components
│   │   ├── contexts/     # React contexts (Theme, etc.)
│   │   ├── lib/          # Utility functions
│   │   ├── App.tsx       # Main app component
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Global styles with Tailwind
│   ├── public/           # Static assets
│   └── package.json
│
├── server/               # Bun + Express backend
│   ├── index.ts         # Server entry point
│   └── package.json
│
├── prisma/              # Database schema and migrations
│   └── schema.prisma   # Prisma schema definition
│
├── .eslintrc.json      # ESLint configuration (root/server)
├── .prettierrc         # Prettier configuration
└── package.json        # Root package.json with scripts

Note: Frontend uses eslint.config.js (flat config format)
```

## 🛠️ Setup Instructions

### Prerequisites

1. Install [Bun](https://bun.sh) (recommended) or Node.js 18+

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. Install MySQL 5.7+ and create a database

### Installation

1. **Clone or download this template**

   ```bash
   git clone <repository-url>
   cd reusable-project-template
   ```

2. **Install dependencies**

   ```bash
   # Install all dependencies (root, frontend, and server)
   bun install
   cd frontend && bun install
   cd ../server && bun install
   cd ..
   ```

3. **Configure environment variables**

   ```bash
   # Copy environment templates
   cp env.example .env                      # Backend + Database config
   cp frontend/env.example frontend/.env    # Frontend config

   # Edit each .env file with your configuration
   nano .env                                 # Backend + Database
   nano frontend/.env                        # Frontend
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   bun run prisma:generate

   # Push schema to database (for development)
   bun run prisma:push

   # Or create and run migrations (for production)
   bun run prisma:migrate
   ```

5. **Start development servers**

   ```bash
   # Run both frontend and backend concurrently
   bun run dev

   # Or run them separately:
   bun run dev:frontend  # Frontend on http://localhost:${VITE_PORT} (from .env)
   bun run dev:server    # Backend on http://localhost:${PORT} (from .env)
   ```

## 📝 Environment Variables

This project uses **TWO** `.env` files:

**Root `.env`** (Backend + Database):
```bash
# Server Port
# Replace YOUR_BACKEND_PORT with your desired port
PORT=YOUR_BACKEND_PORT

# Application Environment
NODE_ENV=development

# Database Connection (used by both Prisma and server)
DATABASE_URL="mysql://user:password@localhost:3306/dbname?charset=utf8mb4&collation=utf8mb4_general_ci"
```

**`frontend/.env`** (Frontend only):
```bash
# Frontend Development Server Port
# Replace YOUR_FRONTEND_PORT with your desired port
VITE_PORT=YOUR_FRONTEND_PORT

# Backend API URL (must match PORT in root .env)
# Replace YOUR_BACKEND_PORT with the PORT value from root .env
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT
```

**⚠️ Important:** Replace ALL placeholder values (YOUR_*, user, password, dbname, etc.). All values are **required** and must be configured. The applications will throw clear error messages if required variables are missing.

**Note:** The root `.env` is shared by both Prisma CLI and the server application. After making changes, restart the development servers with `bun run dev`.

See [docs/ENV_SETUP.md](./docs/ENV_SETUP.md) for detailed explanation of the environment file structure.

## 🎯 Available Scripts

### Root Level

**Development:**

- `bun run dev` - Run both frontend and backend concurrently
- `bun run dev:frontend` - Run only frontend
- `bun run dev:server` - Run only backend

**Build & Preview:**

- `bun run build` - Build frontend for production
- `bun run preview` - Preview production build

**Database (Prisma):**

- `bun run prisma:generate` - Generate Prisma client
- `bun run prisma:migrate` - Create and run migrations
- `bun run prisma:studio` - Open Prisma Studio
- `bun run prisma:push` - Push schema to database

**Code Quality:**

- `bun run lint` - Run ESLint on frontend
- `bun run format` - Format code with Prettier

### Frontend Sferal App

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

### Backend Sferal App

- `bun run dev` - Start development server with watch mode
- `bun run start` - Start production server

## 🎨 Adding shadcn/ui Components

This template includes basic shadcn/ui components (Button, Card, Input). To add more:

```bash
cd frontend
npx shadcn@latest add <component-name>

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
```

## 🔢 Using Decimal.js for Precise Math

The template includes Decimal.js utilities in `frontend/src/lib/utils.ts`:

```typescript
import { formatDecimal, addDecimal, multiplyDecimal } from '@/lib/utils';

// Format to 2 decimal places
const formatted = formatDecimal(19.99, 2); // "19.99"

// Precise addition
const sum = addDecimal(0.1, 0.2); // Decimal(0.3) instead of 0.30000000000000004

// Precise multiplication
const total = multiplyDecimal(19.99, 3); // Decimal(59.97)

// Format for display
const display = formatDecimal(total, 2); // "59.97"
```

## 🎨 Theme System

The template includes a complete dark/light theme system:

```typescript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme } = useTheme();

  // Switch themes
  setTheme('dark'); // Dark mode
  setTheme('light'); // Light mode
  setTheme('system'); // Follow system preference
}
```

The theme preference is automatically saved to localStorage.

## 📊 Using Recharts

Charts automatically adapt to the current theme:

```tsx
import { ChartWrapper } from '@/components/ChartWrapper';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

function MyChart() {
  return (
    <ChartWrapper title="My Chart" description="Chart description">
      <LineChart data={data}>
        <Line stroke="hsl(var(--chart-1))" /> {/* Theme-aware colors */}
      </LineChart>
    </ChartWrapper>
  );
}
```

## 🎭 Using Phosphor Icons

```tsx
import { Cube, Sun, Moon } from '@phosphor-icons/react';

function MyComponent() {
  return (
    <>
      <Cube size={32} weight="duotone" />
      <Sun size={24} className="text-primary" />
      <Moon size={24} weight="fill" />
    </>
  );
}
```

## 🗄️ Database Schema

The template includes a minimal User model. Extend it based on your needs:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

// Add your models here
model YourModel {
  id Int @id @default(autoincrement())
  // ... your fields
}
```

After modifying the schema:

```bash
bun run prisma:generate  # Generate Prisma client
bun run prisma:push      # Push to database (dev)
# or
bun run prisma:migrate   # Create migration (prod)
```

## 🚀 Deployment

### Frontend (Vite)

```bash
cd frontend
bun run build
# Deploy the 'dist' folder to your hosting service
```

### Backend (Bun + Express)

```bash
cd server
bun run start
# For production, use a process manager like systemd or Docker
```

### Database MySQL

- Ensure MySQL 5.7+ is installed and running
- Run migrations: `bun run prisma:migrate`
- Update `.env` with production credentials

## 📚 Best Practices

1. **Type Safety**: Use TypeScript for all files
2. **Component Organization**: Keep components small and focused
3. **State Management**: Use React context for global state, local state for component-specific data
4. **API Calls**: Create a dedicated API service layer
5. **Error Handling**: Always handle errors gracefully
6. **Decimal Math**: Use Decimal.js utilities for financial calculations [[memory:7176972]]
7. **Formatting**: Always format numbers to 2 decimal places in the UI [[memory:7176977]]
8. **Code Style**: Run `bun run format` before committing

## 🏥 Health Check & Monitoring

The application includes a comprehensive health check endpoint for monitoring:

```bash
# Check application health (replace {PORT} with your PORT value)
curl http://localhost:{PORT}/health
```

**Features:**

- ✅ Database connectivity validation
- ✅ Environment variable validation
- ✅ Configuration status checking
- ✅ Uptime reporting
- ✅ HTTP 200 (healthy) / 503 (unhealthy) status codes

**Example Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-14T12:00:00.000Z",
  "environment": "development",
  "checks": {
    "database": {
      "status": "ok",
      "message": "Database connection successful"
    },
    "configuration": {
      "status": "ok",
      "message": "All required environment variables are configured"
    }
  },
  "uptime": 123.456
}
```

Perfect for:

- 🐳 Docker health checks
- ☸️ Kubernetes liveness/readiness probes
- ⚖️ Load balancer health monitoring
- 📊 Uptime monitoring services
- 🔄 Process monitoring

See [docs/HEALTH_CHECK.md](./docs/HEALTH_CHECK.md) for complete documentation and integration examples.

## 🔧 Customization

### Change Primary Color

Edit `frontend/src/index.css` and modify the CSS variables:

```css
:root {
  --primary: 222.2 47.4% 11.2%; /* Change these values */
}
```

### Add API Routes

Edit `server/index.ts` and add your routes:

```typescript
app.get('/api/your-route', (req, res) => {
  res.json({ data: 'Your data' });
});
```

### Add Database Models

Edit `prisma/schema.prisma` and add your models, then:

```bash
bun run prisma:generate
bun run prisma:migrate
```

## 📖 Documentation

### Project Documentation

- [docs/ENV_SETUP.md](./docs/ENV_SETUP.md) - Environment configuration guide
- [docs/ENV_VALIDATION.md](./docs/ENV_VALIDATION.md) - Environment variable validation system
- [docs/HEALTH_CHECK.md](./docs/HEALTH_CHECK.md) - Health check endpoint and monitoring
- [docs/QUICKSTART.md](./docs/QUICKSTART.md) - Quick start guide (5 minutes)
- [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - Common issues and solutions
- [docs/IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md) - Detailed feature list
- [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md) - Current status and verification

### Technology Documentation

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [Phosphor Icons](https://phosphoricons.com)
- [Bun](https://bun.sh)
- [Express](https://expressjs.com)
- [Prisma](https://prisma.io)
- [Decimal.js](https://mikemcl.github.io/decimal.js)

## 📄 License

This template is available as open source under the terms of your chosen license.

## 🤝 Contributing

Feel free to customize this template for your needs. Add features, modify the structure, and make it your own!
