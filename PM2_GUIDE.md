# PM2 Process Management Guide

This project includes PM2 configuration for managing frontend and backend processes in development and production environments.

## Installation

First, install PM2 globally:

```bash
npm install -g pm2
# or
bun add -g pm2
```

## Development Mode

### Start Both Frontend and Backend

```bash
bun run pm2:dev
# or
pm2 start ecosystem.config.cjs
```

This starts:

- **Frontend** on `http://localhost:${VITE_PORT}` (configured in .env)
- **Backend** on `http://localhost:${PORT}` (configured in .env)

### View Running Processes

```bash
pm2 list
# or
pm2 status
```

### View Logs

```bash
# View all logs
bun run pm2:logs
# or
pm2 logs

# View specific app logs
pm2 logs frontend
pm2 logs backend

# Clear logs
pm2 flush
```

### Monitor Processes

```bash
# Interactive monitoring dashboard
bun run pm2:monit
# or
pm2 monit
```

### Stop Processes

```bash
# Stop all
bun run pm2:stop
# or
pm2 stop all

# Stop specific app
pm2 stop frontend
pm2 stop backend
```

### Restart Processes

```bash
# Restart all
bun run pm2:restart
# or
pm2 restart all

# Restart specific app
pm2 restart frontend
pm2 restart backend
```

### Delete Processes

```bash
# Delete all from PM2
bun run pm2:delete
# or
pm2 delete all

# Delete specific app
pm2 delete frontend
pm2 delete backend
```

## Production Mode

For production, use the production ecosystem file which only runs the backend (frontend should be built and served by Nginx, Caddy, or similar):

### Build Frontend

```bash
bun run build
```

### Start Backend in Production Mode

```bash
bun run pm2:prod
# or
pm2 start ecosystem.production.config.cjs --env production
```

This runs the backend with:

- **Cluster mode** - Uses all available CPU cores
- **Auto-restart** - Restarts if crashes
- **Memory limits** - Restarts if memory exceeds 500MB
- **Production environment** variables

### Production Management

```bash
# View status
pm2 status

# View logs
pm2 logs backend-prod

# Restart
pm2 restart backend-prod

# Stop
pm2 stop backend-prod

# Delete
pm2 delete backend-prod
```

## PM2 Startup (Auto-start on Server Reboot)

To automatically start your application when the server reboots:

```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save

# To disable startup
pm2 unstartup
```

## Log Files

Logs are stored in the `logs/` directory:

- `logs/frontend-out.log` - Frontend stdout
- `logs/frontend-error.log` - Frontend errors
- `logs/backend-out.log` - Backend stdout
- `logs/backend-error.log` - Backend errors
- `logs/backend-prod-out.log` - Production backend stdout
- `logs/backend-prod-error.log` - Production backend errors

## Configuration Files

### Development: `ecosystem.config.cjs`

```javascript
{
  apps: [
    { name: 'frontend', ... },
    { name: 'backend', ... }
  ]
}
```

### Production: `ecosystem.production.config.cjs`

```javascript
{
  apps: [
    { name: 'backend-prod', ... }
  ]
}
```

## Common PM2 Commands

```bash
pm2 list                 # List all processes
pm2 status              # Show status of all apps
pm2 logs                # Show all logs
pm2 logs [app-name]     # Show specific app logs
pm2 monit               # Monitor all processes
pm2 stop all            # Stop all processes
pm2 stop [app-name]     # Stop specific process
pm2 restart all         # Restart all processes
pm2 restart [app-name]  # Restart specific process
pm2 delete all          # Delete all processes
pm2 delete [app-name]   # Delete specific process
pm2 reload all          # Zero-downtime reload (cluster mode)
pm2 describe [app-name] # Show detailed info about app
pm2 flush               # Clear all logs
pm2 reset [app-name]    # Reset restart counter
```

## Troubleshooting

### Environment Variables Not Loading from .env

**⚠️ This is the most common issue!**

**Symptoms:**
- Application uses unexpected port numbers
- Frontend connects to wrong backend URL
- Changes to `.env` file don't take effect
- `pm2 restart --update-env` doesn't fix it

**Root Cause:**
Shell environment variables override `.env` file values. PM2 inherits the shell's environment, and dotenv (by default) doesn't override existing variables.

**Solution:**

1. **Check for shell environment variables:**
   ```bash
   bun run check-env
   ```

2. **If conflicts found, unset them:**
   ```bash
   unset VITE_API_URL PORT VITE_PORT NODE_ENV
   ```

3. **Do a clean restart (important: DELETE, not restart!):**
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.cjs
   ```

4. **Verify the correct values are loaded:**
   ```bash
   pm2 list  # Get process ID
   pm2 env 0 | grep -E 'VITE|PORT'  # Replace 0 with your process ID
   ```

**Why this happens:**
- Shell environment variables (from `export` or `.bashrc`/`.zshrc`) have highest priority
- PM2 inherits the shell's environment
- dotenv doesn't override existing variables by default
- This template now uses `dotenv.config({ override: true })` to help prevent this

**Prevention:**
- Use `bun run pm2:dev:safe` which checks for conflicts first
- Never export project-specific env vars in `.bashrc` or `.zshrc`
- Always use the `.env` file for configuration

**Debugging:**
```bash
# Check what dotenv sees
node -e "require('dotenv').config({debug: true}); console.log(process.env.VITE_API_URL)"

# Check shell variables
env | grep -E 'VITE|PORT'

# Check what PM2 loaded
pm2 env [process-id]
```

### Processes Won't Start

1. **Check .env configuration first** - Ensure PORT and VITE_PORT are set (required, no defaults)
2. **Check for environment conflicts:** `bun run check-env`
3. Check if Bun is installed: `bun --version`
4. Check if ports are available: `lsof -i :${VITE_PORT}` and `lsof -i :${PORT}`
5. View error logs: `pm2 logs`

### High Memory Usage

PM2 will automatically restart processes if they exceed memory limits. Check current memory:

```bash
pm2 list
# Look at the "memory" column
```

### Processes Keep Restarting

1. Check logs for errors: `pm2 logs`
2. **Check for environment variable conflicts:** `bun run check-env`
3. **Verify .env file** - Ensure PORT and VITE_PORT are set with actual values (not placeholders)
4. Check if `.env` file exists and is configured
5. Increase `min_uptime` in ecosystem config
6. Verify database connection

### More Troubleshooting

For more detailed troubleshooting information, including database connection issues, port conflicts, and installation problems, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

## PM2 Plus (Optional)

For advanced monitoring and management, consider [PM2 Plus](https://pm2.io/):

```bash
pm2 link [secret_key] [public_key]
```

Features:

- Real-time monitoring dashboard
- Email/Slack alerts
- Performance metrics
- Transaction tracing
- Custom metrics

## Best Practices

1. **Development**: Use `bun run dev` or `bun run pm2:dev` for hot-reload
2. **Production**: Use `bun run pm2:prod` with cluster mode
3. **Always save**: Run `pm2 save` after starting processes you want to persist
4. **Monitor logs**: Regularly check `pm2 logs` for errors
5. **Use ecosystem files**: Keep configuration in ecosystem files for consistency
6. **Set memory limits**: Prevent memory leaks from crashing your server
7. **Enable startup**: Use `pm2 startup` for production servers

## Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [PM2 Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [PM2 Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/)
