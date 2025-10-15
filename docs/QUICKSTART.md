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
# Copy environment templates
cp .env.example .env
cp frontend/.env.example frontend/.env
```

**Edit `.env` (root) - Backend + Database:**

```bash
PORT=YOUR_BACKEND_PORT  # Replace with your desired port
NODE_ENV=development
DATABASE_URL="mysql://user:password@localhost:3306/dbname?charset=utf8mb4&collation=utf8mb4_general_ci"
```

**Edit `frontend/.env` - Frontend:**

```bash
VITE_PORT=YOUR_FRONTEND_PORT  # Replace with your desired port
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT  # Must match PORT above
```

⚠️ **Important:** Replace ALL placeholder values (YOUR_*). The applications will not start without valid configuration.

### 3. Setup Prisma (1 minute)

```bash
# Generate Prisma client
bun run prisma:generate

# Push schema to database (creates tables)
bun run prisma:push
```

### 4. Start Development (1 minute)

```bash
# Start both frontend and backend
bun run dev

# Frontend will be available at: http://localhost:{VITE_PORT}
# Backend will be available at: http://localhost:{PORT}
```

**Note:** The servers will run concurrently. To stop them, press `Ctrl+C` in your terminal.

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

### Environment Variable Issues

If your app connects to the wrong port or `.env` changes don't take effect:

```bash
# Stop the servers (Ctrl+C) and restart
bun run dev
```

### Database connection fails

- Ensure MySQL is running
- Check credentials in `.env` (at root)
- Verify the database exists

### Frontend won't start

- Clear node_modules: `rm -rf frontend/node_modules && cd frontend && bun install`
- Check for port conflicts (configured in frontend/.env as VITE_PORT)
- Ensure VITE_PORT is set in your frontend/.env file

### Prisma errors

- Run `bun run prisma:generate` to regenerate the client
- Check your DATABASE_URL in `.env` (at root)

### Port configuration errors

- **Error: "PORT environment variable is required"** - Set PORT in root `.env` file
- **Error: "VITE_PORT environment variable is required"** - Set VITE_PORT in `frontend/.env` file
- These variables are required and have no defaults

### Need More Help?

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for comprehensive troubleshooting guide covering:

- Detailed environment variable debugging
- Database connection problems
- Port conflicts
- And more...

## Available Commands

```bash
# Development
bun run dev              # Run both frontend and backend
bun run dev:frontend     # Run only frontend
bun run dev:server       # Run only backend

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

See [../README.md](../README.md) for comprehensive documentation.

---

**Last Updated:** October 2025
