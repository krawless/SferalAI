# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the project template.

## Environment Variable Issues

### Problem: Frontend/Backend Connecting to Wrong Port

**Symptoms:**

- Frontend shows "Failed to connect to backend"
- Console shows connection to unexpected port
- Application connects to old/incorrect ports despite changing `.env`

**Root Cause:**
Environment variables in `.env` files are not properly configured or the application was not restarted after changes.

**Solution:**

1. **Verify your `.env` files:**

   ```bash
   # Check backend/database config (root)
   cat .env
   
   # Check frontend config
   cat frontend/.env
   ```

2. **Ensure PORT values match:**

   ```bash
   # Root .env
   PORT=YOUR_BACKEND_PORT
   
   # frontend/.env
   VITE_API_URL=http://localhost:YOUR_BACKEND_PORT  ← Must match PORT value
   ```

3. **Restart the development servers:**

   ```bash
   # Stop servers (Ctrl+C) and restart
   bun run dev
   ```

### Problem: DATABASE_URL Not Found

**Symptoms:**

- Error: "DATABASE_URL is required"
- Prisma can't connect to database

**Solution:**

1. **Check .env file location:**
   - DATABASE_URL should be in **root `.env`** (not `server/.env` or `prisma/.env`)

2. **Verify file exists:**

   ```bash
   ls -la .env
   cat .env | grep DATABASE_URL
   ```

3. **Run Prisma commands from root:**

   ```bash
   # Correct (from root directory)
   bun run prisma:generate
   
   # Incorrect
   cd prisma && bunx prisma generate  ← Don't do this
   ```

## Database Connection Issues

### Problem: Cannot Connect to MySQL Database

**Symptoms:**

- Error: "Can't connect to MySQL server"
- Error: "Access denied for user"
- Prisma client errors

**Solutions:**

1. **Verify MySQL is running:**

   ```bash
   # macOS
   brew services list | grep mysql
   
   # Linux
   sudo systemctl status mysql
   ```

2. **Check credentials in root `.env`:**

   ```bash
   cat .env | grep DATABASE_URL
   ```

3. **Test database connection:**

   ```bash
   # Extract values from your DATABASE_URL
   mysql -u username -p -h localhost database_name
   ```

4. **Verify DATABASE_URL format:**

   ```
   mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE?charset=utf8mb4&collation=utf8mb4_general_ci
   ```

5. **Regenerate Prisma client:**

   ```bash
   bun run prisma:generate
   ```

### Problem: Prisma Schema Sync Issues

**Symptoms:**

- Error: "Table doesn't exist"
- Error: "Unknown column"
- Schema changes not reflected

**Solutions:**

1. **Push schema to database (development):**

   ```bash
   bun run prisma:push
   ```

2. **Create and run migrations (production):**

   ```bash
   bun run prisma:migrate
   ```

3. **Reset database (⚠️ deletes all data):**

   ```bash
   npx prisma migrate reset
   ```

## Frontend Build Issues

### Problem: Vite Build Fails

**Symptoms:**

- Error during `bun run build`
- Type errors
- Import errors

**Solutions:**

1. **Clear cache and reinstall:**

   ```bash
   cd frontend
   rm -rf node_modules .vite
   bun install
   bun run build
   ```

2. **Check TypeScript errors:**

   ```bash
   cd frontend
   bun run lint
   ```

3. **Verify environment variables:**

   ```bash
   # Ensure VITE_* variables are set in frontend/.env
   cat frontend/.env
   ```

## Port Conflicts

### Problem: Address Already in Use

**Symptoms:**

- Error: "EADDRINUSE"
- Error: "port already in use"

**Solutions:**

1. **Find what's using the port:**

   ```bash
   # Check frontend port (replace with your VITE_PORT)
   lsof -i :YOUR_FRONTEND_PORT
   
   # Check backend port (replace with your PORT)
   lsof -i :YOUR_BACKEND_PORT
   ```

2. **Kill the process:**

   ```bash
   kill -9 <PID>
   ```

3. **Or change the port:**

   ```bash
   # Edit root .env
   nano .env
   # Update PORT
   
   # Edit frontend/.env
   nano frontend/.env
   # Update VITE_PORT and/or VITE_API_URL to match new PORT
   ```

4. **Restart with new configuration:**

   ```bash
   # Stop servers (Ctrl+C) and restart
   bun run dev
   ```

## Installation Issues

### Problem: Dependencies Won't Install

**Symptoms:**

- Error during `bun install`
- Missing packages
- Version conflicts

**Solutions:**

1. **Clear lock files and reinstall:**

   ```bash
   # Root
   rm -rf node_modules bun.lock
   bun install
   
   # Frontend
   cd frontend
   rm -rf node_modules bun.lock
   bun install
   
   # Backend
   cd ../server
   rm -rf node_modules bun.lock
   bun install
   ```

2. **Check Bun version:**

   ```bash
   bun --version
   # Update if needed:
   curl -fsSL https://bun.sh/install | bash
   ```

## Environment File Structure Issues

### Problem: Confused About Which .env to Use

**Answer:**

This project uses **TWO** `.env` files:

1. **Root `.env`** - Backend + Database (Prisma + Server)
   - `PORT`
   - `NODE_ENV`
   - `DATABASE_URL`

2. **`frontend/.env`** - Frontend only
   - `VITE_PORT`
   - `VITE_API_URL`

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed explanation.

## Still Having Issues?

If you're still experiencing problems:

1. **Check all configuration files:**
   - `.env` at root (backend/database config)
   - `frontend/.env` (frontend config)
   - `prisma/schema.prisma` (ensure using `env("DATABASE_URL")`)

2. **Run diagnostics:**

   ```bash
   # Check database connection
   npx prisma db pull
   
   # Verify .env files
   cat .env
   cat frontend/.env
   ```

3. **Start fresh:**

   ```bash
   # Stop servers (Ctrl+C)
   
   # Verify .env files
   cat .env
   cat frontend/.env
   
   # Start clean
   bun run dev
   ```

4. **Review recent changes:**

   ```bash
   git status
   git diff
   ```

## Getting Help

If you need additional help:

1. Check the main documentation files:
   - [../README.md](../README.md) - Full documentation
   - [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
   - [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration guide

2. Gather diagnostic information:

   ```bash
   # System info
   bun --version
   node --version
   mysql --version
   
   # Configuration (without sensitive data!)
   cat .env | grep -v PASSWORD
   cat frontend/.env
   
   # Check running processes
   lsof -i -P | grep LISTEN | grep bun
   ```

3. Check for common mistakes:
   - ✅ Did you copy `env.example` to `.env` at root?
   - ✅ Did you copy `frontend/env.example` to `frontend/.env`?
   - ✅ Did you replace ALL placeholder values in both files?
   - ✅ Is MySQL running?
   - ✅ Did you run `bun run prisma:generate`?
   - ✅ Did you restart the servers after changing `.env`?
   - ✅ Does `VITE_API_URL` match the `PORT` in root `.env`?

---

**Last Updated:** October 2025
