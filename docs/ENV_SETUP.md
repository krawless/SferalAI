# Environment Configuration Guide

This document explains how environment variables are configured in this template.

## Environment File Structure

This project uses a **single root `.env` file** for backend and database configuration, with a separate `.env` file for frontend configuration.

```
/
├── .env                  ← Backend + Database config (Prisma + Server)
└── frontend/
    └── .env              ← Frontend config (Vite variables)
```

## Why This Structure?

**Single Root `.env`:**
- ✅ Shared by both Prisma CLI and the server application
- ✅ No duplication of `DATABASE_URL`
- ✅ Single source of truth for backend/database config
- ✅ Server loads it via `dotenv.config({ path: '../.env' })`
- ✅ Prisma CLI automatically finds it at root

**Separate Frontend `.env`:**
- ✅ Frontend needs different variables (`VITE_*` prefix required by Vite)
- ✅ Keeps frontend config isolated
- ✅ Vite automatically loads variables from `frontend/.env`

## Setup Instructions

### 1. Copy Environment Templates

```bash
# Backend + Database configuration
cp .env.example .env

# Frontend configuration
cp frontend/.env.example frontend/.env
```

### 2. Configure Backend + Database (`.env`)

Edit `.env` at the root:

```bash
# ==============================================
# SERVER CONFIGURATION
# ==============================================

# Server Port - The port your backend server will run on
# Replace YOUR_BACKEND_PORT with your desired port
PORT=YOUR_BACKEND_PORT

# Application Environment
# Options: development, production, test
NODE_ENV=development

# ==============================================
# DATABASE CONFIGURATION
# ==============================================

# Database Connection String
# Used by both Prisma and the server application
DATABASE_URL="mysql://root:password@localhost:3306/myapp?charset=utf8mb4&collation=utf8mb4_general_ci"
```

**Important:** This single `.env` file is used by:
1. **Prisma CLI** - When running `prisma migrate`, `prisma generate`, etc.
2. **Server Application** - Loaded via `dotenv.config()` in `server/index.ts`

### 3. Configure Frontend (`frontend/.env`)

Edit `frontend/.env`:

```bash
# Frontend Development Server Port
# Replace YOUR_FRONTEND_PORT with your desired port
VITE_PORT=YOUR_FRONTEND_PORT

# Backend API URL
# Replace YOUR_BACKEND_PORT with the PORT value from root .env
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT
```

## How Prisma Finds DATABASE_URL

When you run Prisma commands, Prisma looks for `.env` files in this order:

1. **`prisma/.env`** (if exists)
2. **`.env` at root** ← This is where we put it
3. **System environment variables**

The `env("DATABASE_URL")` function in `prisma/schema.prisma` reads from these locations.

## How the Server Loads Environment Variables

In `server/index.ts`:

```typescript
import dotenv from 'dotenv';

// Load environment variables from root .env
dotenv.config({ path: '../.env' });
```

This loads:
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production/test)
- `DATABASE_URL` - Database connection (used by Prisma Client)

## Environment Variable Validation

Both frontend and backend validate environment variables at startup.

### Backend Validation

**Location:** `server/index.ts`

**Validated Variables:**
- `PORT` - Must be a number between 1-65535
- `NODE_ENV` - Must be `development`, `production`, or `test`
- `DATABASE_URL` - Must be a valid MySQL connection string (`mysql://...`)

If validation fails, the server exits with clear error messages.

### Frontend Validation

**Location:** `frontend/vite.config.ts`

**Validated Variables:**
- `VITE_PORT` - Must be a number between 1-65535
- `VITE_API_URL` - Must be a valid HTTP/HTTPS URL

If validation fails, the dev server won't start and displays error messages.

## Required vs Optional Variables

### Required (Root `.env`)

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `YOUR_BACKEND_PORT` | Backend server port |
| `NODE_ENV` | `development` | Application environment |
| `DATABASE_URL` | `mysql://user:pass@host:3306/db` | MySQL connection string |

### Required (Frontend `.env`)

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_PORT` | `YOUR_FRONTEND_PORT` | Frontend dev server port |
| `VITE_API_URL` | `http://localhost:YOUR_BACKEND_PORT` | Backend API URL |

## Common Issues

### ❌ Server can't find DATABASE_URL

**Solution:** Make sure `.env` exists at the **root** of the project (not in `server/`).

### ❌ Prisma can't find DATABASE_URL

**Solution:** Run Prisma commands from the **root** directory:

```bash
bun run prisma:generate  # Not: cd prisma && bun prisma generate
```

### ❌ Changes to .env don't take effect

**Solution:** Restart your development servers:

```bash
# Stop with Ctrl+C, then:
bun run dev
```

### ❌ Frontend can't connect to backend

**Solution:** Verify `VITE_API_URL` in `frontend/.env` matches the `PORT` in root `.env`:

```bash
# Root .env
PORT=YOUR_BACKEND_PORT

# frontend/.env
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT  ← Must match PORT value
```

## Best Practices

1. ✅ **Never commit `.env` files** - They're in `.gitignore`
2. ✅ **Use `.env.example` as template** - Copy and customize
3. ✅ **Keep secrets in `.env`** - Database passwords, API keys
4. ✅ **Restart after changes** - Environment variables load at startup
5. ✅ **Document new variables** - Add to `.env.example` with comments

## Related Documentation

- [ENV_VALIDATION.md](./ENV_VALIDATION.md) - Environment variable validation details
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide

---

**Last Updated:** October 2025

