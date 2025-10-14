# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the project template.

## Environment Variable Issues

### Problem: Frontend/Backend Connecting to Wrong Port

**Symptoms:**
- Frontend shows "Failed to connect to backend"
- Console shows connection to unexpected port
- PM2 restart doesn't fix the issue
- Application connects to old/incorrect ports despite changing `.env`

**Root Cause:**
Environment variables set in your shell override `.env` file values. This is due to how environment variable precedence works in Node.js/PM2.

**Solution:**

1. **Check for shell environment variables:**
   ```bash
   bun run check-env
   # or manually check:
   echo $VITE_API_URL
   echo $PORT
   echo $VITE_PORT
   echo $NODE_ENV
   ```

2. **If conflicts detected, unset them:**
   ```bash
   unset VITE_API_URL PORT VITE_PORT NODE_ENV
   ```

3. **Clean restart PM2:**
   ```bash
   pm2 stop all
   pm2 delete all
   pm2 start ecosystem.config.cjs
   ```

4. **Verify environment variables loaded correctly:**
   ```bash
   pm2 list  # Get process ID
   pm2 env [process-id] | grep -E 'VITE|PORT'
   ```

### Understanding Environment Variable Precedence

When PM2 starts your application, environment variables are loaded in this order (highest to lowest priority):

1. **Shell environment variables** (highest priority)
   - Set via `export VAR=value` in terminal
   - Defined in `.bashrc`, `.zshrc`, or `.profile`
   - Persists across terminal sessions

2. **PM2 ecosystem config `env` section**
   - Explicitly defined in `ecosystem.config.cjs`
   - Can be different for development/production

3. **.env file** (lowest priority)
   - Loaded by `dotenv` package
   - By default, does NOT override existing variables

⚠️ **Important:** This means if you have `export VITE_API_URL=http://localhost:3001` in your shell or `.zshrc`, it will ALWAYS override your `.env` file, even after restarting PM2!

### Prevention

**Best Practice:** Never set project-specific environment variables in your shell configuration files (`.bashrc`, `.zshrc`, etc.). Always use the `.env` file.

**Use safe startup scripts** that check for conflicts automatically:
```bash
bun run pm2:dev:safe    # Instead of pm2:dev
bun run pm2:prod:safe   # Instead of pm2:prod
```

These scripts run `check-env` first and will warn you about conflicts before starting PM2.

### Debugging Environment Variables

#### Check what dotenv is loading:
```bash
node -e "require('dotenv').config({debug: true}); console.log('VITE_API_URL:', process.env.VITE_API_URL); console.log('PORT:', process.env.PORT);"
```

This shows:
- Which variables were loaded from `.env`
- Which variables were already defined (and NOT overwritten)

#### Check PM2 environment:
```bash
pm2 list  # Get process ID
pm2 env 0 # Replace 0 with your process ID
```

#### Check for shell variables:
```bash
env | grep -E 'VITE|PORT|NODE_ENV'
```

#### Test if .env file is being read:
```bash
cat .env
# Verify values are correct
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

2. **Check credentials in `.env`:**
   ```bash
   cat .env | grep DB_
   ```
   Verify: `DB_USER_PROD`, `DB_PASSWORD_PROD`, `DB_NAME_PROD`, `DB_HOST_PROD`

3. **Test database connection:**
   ```bash
   mysql -u ${DB_USER_PROD} -p${DB_PASSWORD_PROD} -h ${DB_HOST_PROD} ${DB_NAME_PROD}
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

## PM2 Process Management Issues

### Problem: Processes Won't Start

**Symptoms:**
- PM2 shows status "errored"
- Processes restart continuously
- Error: "script not found"

**Solutions:**

1. **Check .env configuration:**
   ```bash
   # Ensure required variables are set
   grep -E 'PORT|VITE_PORT' .env
   ```

2. **Check if Bun is installed:**
   ```bash
   bun --version
   ```

3. **Check if ports are available:**
   ```bash
   lsof -i :${PORT}
   lsof -i :${VITE_PORT}
   # If ports are in use, either:
   # - Stop the process: kill -9 <PID>
   # - Or change ports in .env
   ```

4. **View error logs:**
   ```bash
   pm2 logs
   # Or specific logs:
   cat logs/frontend-error.log
   cat logs/backend-error.log
   ```

5. **Delete and restart cleanly:**
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.cjs
   ```

### Problem: Processes Keep Restarting

**Symptoms:**
- PM2 shows high restart count
- Application unstable
- Logs show repeated errors

**Solutions:**

1. **Check error logs:**
   ```bash
   pm2 logs [app-name]
   ```

2. **Common causes:**
   - Missing or invalid environment variables (check `.env`)
   - Port already in use
   - Database connection failure
   - Missing dependencies (`bun install`)

3. **Increase minimum uptime:**
   Edit `ecosystem.config.cjs`:
   ```javascript
   min_uptime: '30s',  // Increase from 10s
   ```

4. **Check for environment variable issues:**
   ```bash
   bun run check-env
   ```

### Problem: Environment Variables Not Updating

**Symptoms:**
- Changed `.env` values not reflected
- `pm2 restart --update-env` doesn't work
- Old configuration persists

**Solution:**

This is the issue described at the top of this guide. Follow the "Frontend/Backend Connecting to Wrong Port" solution:

```bash
# 1. Check for shell conflicts
bun run check-env

# 2. Unset conflicting variables
unset VITE_API_URL PORT VITE_PORT NODE_ENV

# 3. Clean restart (DELETE, not restart)
pm2 delete all
pm2 start ecosystem.config.cjs

# 4. Verify
pm2 env 0 | grep -E 'VITE|PORT'
```

**Why `pm2 restart` doesn't work:**
- PM2 restart doesn't reload the ecosystem config file
- Shell environment variables persist across restarts
- You must `delete` and `start` fresh to reload the config

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
   # Ensure VITE_* variables are set
   grep VITE .env
   ```

## Port Conflicts

### Problem: Address Already in Use

**Symptoms:**
- Error: "EADDRINUSE"
- Error: "port already in use"

**Solutions:**

1. **Find what's using the port:**
   ```bash
   # Check frontend port
   lsof -i :${VITE_PORT}
   
   # Check backend port
   lsof -i :${PORT}
   ```

2. **Kill the process:**
   ```bash
   kill -9 <PID>
   ```

3. **Or change the port in `.env`:**
   ```bash
   nano .env
   # Update PORT and/or VITE_PORT
   # Update VITE_API_URL to match new PORT
   ```

4. **Restart with new configuration:**
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.cjs
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

## Still Having Issues?

If you're still experiencing problems:

1. **Check all configuration files:**
   - `.env` (ensure all required variables are set)
   - `ecosystem.config.cjs` (verify paths and settings)
   - `prisma/schema.prisma` (ensure DATABASE_URL is correct)

2. **Run diagnostics:**
   ```bash
   # Check environment
   bun run check-env
   
   # Check PM2 status
   pm2 status
   
   # Check logs
   pm2 logs
   
   # Check database connection
   npx prisma db pull
   ```

3. **Start fresh:**
   ```bash
   # Stop everything
   pm2 delete all
   
   # Clear shell environment
   unset VITE_API_URL PORT VITE_PORT NODE_ENV
   
   # Verify .env
   cat .env
   
   # Start clean
   bun run pm2:dev:safe
   ```

4. **Review recent changes:**
   ```bash
   git status
   git diff
   ```

## Getting Help

If you need additional help:

1. Check the main documentation files:
   - [README.md](./README.md) - Full documentation
   - [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
   - [PM2_GUIDE.md](./PM2_GUIDE.md) - PM2 usage guide

2. Gather diagnostic information:
   ```bash
   # Environment check
   bun run check-env
   
   # PM2 status
   pm2 status
   pm2 logs --lines 50
   
   # System info
   bun --version
   node --version
   pm2 --version
   mysql --version
   
   # Configuration
   cat .env (without sensitive data!)
   ```

3. Check for common mistakes:
   - ✅ Did you copy `env.template` to `.env`?
   - ✅ Did you replace ALL placeholder values in `.env`?
   - ✅ Is MySQL running?
   - ✅ Did you run `bun run prisma:generate`?
   - ✅ Are there shell environment variables conflicting?
   - ✅ Did you `delete` PM2 processes (not just `restart`)?

