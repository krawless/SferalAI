# Quick Start Guide

Get up and running with this template in 5 minutes!

## Prerequisites

- [Bun](https://bun.sh) installed (or Node.js 18+)
- MySQL 5.7+ running locally or remotely

## Quick Setup

### 1. Install Dependencies (2 minutes)

```bash
# Install all dependencies
bun install

# Install frontend dependencies
cd frontend && bun install && cd ..

# Install server dependencies
cd server && bun install && cd ..
```

### 2. Configure Environment Variables (2 minutes)

```bash
# Copy environment template
cp env.template .env

# Edit .env and REPLACE all placeholder values:
# REQUIRED:
# - PORT=YOUR_BACKEND_PORT → Replace with actual port
# - VITE_PORT=YOUR_FRONTEND_PORT → Replace with actual port
# - VITE_API_URL=http://localhost:YOUR_BACKEND_PORT → Match your PORT
# - DB_USER_PROD=your_username
# - DB_PASSWORD_PROD=your_password
# - DB_NAME_PROD=your_database_name
```

**⚠️ Important:** Port configuration is **required**. The application will not start without valid PORT and VITE_PORT values.

### 3. Setup Prisma (1 minute)

```bash
# Generate Prisma client
bun run prisma:generate

# Push schema to database (creates tables)
bun run prisma:push
```

### 4. Start Development (1 minute)

**⚠️ Before starting, check for environment conflicts:**

```bash
# Verify no shell environment variables will conflict with .env
bun run check-env
```

If you see warnings about conflicting shell variables, run:
```bash
unset VITE_API_URL PORT VITE_PORT NODE_ENV
```

**Why this matters:** Shell environment variables (from `export` or `.bashrc`/`.zshrc`) override `.env` file values. This check ensures your `.env` configuration will be used correctly.

#### Option A: Simple Start

```bash
# Start both frontend and backend
bun run dev

# Frontend will be available at: http://localhost:${VITE_PORT} (check your .env)
# Backend will be available at: http://localhost:${PORT} (check your .env)
```

#### Option B: Using PM2 (recommended for better process management)

```bash
# Install PM2 globally (one time)
npm install -g pm2

# Start with PM2 (with automatic environment check)
bun run pm2:dev:safe

# Or without the check:
# bun run pm2:dev

# View status: pm2 list
# View logs: bun run pm2:logs
# Stop all: bun run pm2:stop
```

See [PM2_GUIDE.md](./PM2_GUIDE.md) for complete PM2 documentation.

## That's It! 🎉

You should now see:

- Frontend running with dark/light mode toggle
- Example charts with Recharts
- Decimal.js math calculations
- shadcn/ui components
- Phosphor icons

## Next Steps

1. **Customize the database schema**: Edit `prisma/schema.prisma`
2. **Add API endpoints**: Edit `server/index.ts`
3. **Create new components**: Add them to `frontend/src/components/`
4. **Add shadcn components**: Run `cd frontend && npx shadcn@latest add [component-name]`

## Troubleshooting

### Environment Variable Issues (Most Common!)

If your app connects to the wrong port or `.env` changes don't take effect:

```bash
# 1. Check for shell environment conflicts
bun run check-env

# 2. If found, unset them
unset VITE_API_URL PORT VITE_PORT NODE_ENV

# 3. Clean restart
pm2 delete all && pm2 start ecosystem.config.cjs
```

**Why:** Shell environment variables (from `export` or `.bashrc`) override `.env` file values.

### Database connection fails

- Ensure MySQL is running
- Check credentials in `.env`
- Verify the database exists

### Frontend won't start

- Clear node_modules: `rm -rf frontend/node_modules && cd frontend && bun install`
- Check for port conflicts (configured in .env as VITE_PORT)
- Ensure VITE_PORT is set in your .env file (required, no default)

### Prisma errors

- Run `bun run prisma:generate` to regenerate the client
- Check your DATABASE_URL in `.env`

### Port configuration errors

- **Error: "PORT environment variable is required"** - Set PORT in your .env file
- **Error: "VITE_PORT environment variable is required"** - Set VITE_PORT in your .env file
- These variables are required and have no defaults - this is intentional to prevent confusion

### Need More Help?

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for comprehensive troubleshooting guide covering:
- Detailed environment variable debugging
- PM2 process management issues
- Database connection problems
- Port conflicts
- And more...

## Available Commands

```bash
# Environment Check
bun run check-env       # Check for conflicting shell environment variables

# Development
bun run dev              # Run both frontend and backend
bun run dev:frontend     # Run only frontend
bun run dev:server       # Run only backend

# PM2 Process Management
bun run pm2:dev:safe     # Start with PM2 (with environment check - recommended)
bun run pm2:dev          # Start with PM2 (without check)
bun run pm2:stop         # Stop all PM2 processes
bun run pm2:logs         # View PM2 logs

# Build
bun run build           # Build frontend for production

# Database
bun run prisma:generate  # Generate Prisma client
bun run prisma:push      # Push schema to database
bun run prisma:studio    # Open Prisma Studio GUI

# Code Quality
bun run lint            # Run ESLint
bun run format          # Format with Prettier
```

## Learn More

See [README.md](./README.md) for comprehensive documentation.
