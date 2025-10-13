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

### 2. Configure Database (1 minute)

```bash
# Copy environment template
cp env.template .env

# Edit .env with your database credentials
# At minimum, update these values:
# - DB_USER_PROD=your_username
# - DB_PASSWORD_PROD=your_password
# - DB_NAME_PROD=your_database_name
```

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

# Frontend will be available at: http://localhost:5173
# Backend will be available at: http://localhost:3001
```

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

### Database connection fails

- Ensure MySQL is running
- Check credentials in `.env`
- Verify the database exists

### Frontend won't start

- Clear node_modules: `rm -rf frontend/node_modules && cd frontend && bun install`
- Check for port conflicts (default: 5173)

### Prisma errors

- Run `bun run prisma:generate` to regenerate the client
- Check your DATABASE_URL in `.env`

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

See [README.md](./README.md) for comprehensive documentation.
