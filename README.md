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
├── env.template        # Environment variables template
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
   # Copy the environment template
   cp env.template .env

   # Edit .env with your database credentials
   nano .env
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

   **Option A: Simple (using &)**

   ```bash
   # Run both frontend and backend concurrently
   bun run dev

   # Or run them separately:
   bun run dev:frontend  # Frontend on http://localhost:${VITE_PORT} (from .env)
   bun run dev:server    # Backend on http://localhost:${PORT} (from .env)
   ```

   **Option B: Using PM2 (recommended for production-like environments)**

   ```bash
   # Install PM2 globally (one time)
   npm install -g pm2

   # Start both servers with PM2
   bun run pm2:dev

   # View logs
   bun run pm2:logs

   # Stop all
   bun run pm2:stop
   ```

   See [PM2_GUIDE.md](./PM2_GUIDE.md) for detailed PM2 usage.

## 📝 Environment Variables

Create a `.env` file in the root directory based on `env.template`:

```bash
# Database Configuration (MySQL 5.7)
DB_HOST_PROD=localhost
DB_USER_PROD=your_username
DB_PASSWORD_PROD=your_password
DB_NAME_PROD=your_database
DB_PORT_PROD=3306

# Prisma Database URL
DATABASE_URL="mysql://your_username:your_password@localhost:3306/your_database?charset=utf8mb4&collation=utf8mb4_general_ci"

# Server Configuration
NODE_ENV=development
# REQUIRED: Replace with your chosen backend port
PORT=YOUR_BACKEND_PORT

# Frontend Configuration
# REQUIRED: Replace with your chosen frontend port
VITE_PORT=YOUR_FRONTEND_PORT
# REQUIRED: Must match your backend PORT above
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT
```

**⚠️ Important:** The `PORT` and `VITE_PORT` variables are **required** and have no default fallbacks. You must replace the placeholder values with actual port numbers. If these are not set, the application will throw an error with a clear message.

### Environment Variable Precedence

**Important:** Understanding how environment variables are loaded can prevent configuration issues.

When using PM2, variables are loaded in this order (highest to lowest priority):

1. **Shell environment** (e.g., `export VITE_API_URL=...`) - ⚠️ **Highest priority**
2. **PM2 ecosystem config** (`env` section in `ecosystem.config.cjs`)
3. **.env file** (loaded by dotenv) - ⚠️ **Lowest priority**

**Best Practice:** Avoid setting project environment variables in your shell (`.bashrc`, `.zshrc`, etc.). Always use the `.env` file.

**Troubleshooting:** If your app connects to the wrong port after changing `.env`:

```bash
# 1. Check for conflicting shell variables
bun run check-env

# 2. If found, unset them
unset VITE_API_URL PORT VITE_PORT NODE_ENV

# 3. Clean restart (delete, not restart!)
pm2 delete all && pm2 start ecosystem.config.cjs
```

**Use safe startup scripts** that automatically check for conflicts:

```bash
bun run pm2:dev:safe   # Instead of pm2:dev
bun run pm2:prod:safe  # Instead of pm2:prod
```

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more details on environment variable issues.

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

**Environment Check:**

- `bun run check-env` - Check for conflicting shell environment variables

**PM2 Process Management:**

- `bun run pm2:dev` - Start both servers with PM2
- `bun run pm2:dev:safe` - Start with environment check (recommended)
- `bun run pm2:prod` - Start backend in production mode with PM2
- `bun run pm2:prod:safe` - Start production with environment check (recommended)
- `bun run pm2:stop` - Stop all PM2 processes
- `bun run pm2:restart` - Restart all PM2 processes
- `bun run pm2:delete` - Delete all PM2 processes
- `bun run pm2:logs` - View PM2 logs
- `bun run pm2:monit` - Open PM2 monitoring dashboard

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
# Use a process manager like PM2 or systemd
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

## 📖 Documentation Links

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
