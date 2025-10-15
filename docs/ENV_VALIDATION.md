# Environment Variable Validation

This document explains the comprehensive environment variable validation system implemented in this project.

## Overview

Both the **frontend** and **backend** validate all required environment variables at startup. If any variable is missing or invalid, the application will:

1. **Fail to start**
2. **Display clear error messages** explaining what's wrong
3. **Reference the `.env.example` files** for guidance

This prevents runtime failures and ensures proper configuration before the application runs.

---

## Backend Validation (Server)

**Location:** `server/index.ts`

### Validated Variables

| Variable | Required | Validation Rules |
|----------|----------|-----------------|
| `PORT` | ✅ Yes | Must be a number between 1 and 65535 |
| `NODE_ENV` | ✅ Yes | Must be one of: `development`, `production`, `test` |
| `DATABASE_URL` | ✅ Yes | Must be a valid MySQL connection string starting with `mysql://` |

### Example Error Output

If validation fails, you'll see:

```
❌ Environment variable validation failed:

  - PORT: PORT must be a valid port number
  - NODE_ENV: NODE_ENV must be one of: development, production, test
  - DATABASE_URL: DATABASE_URL is required

Please check your .env file and ensure all required variables are set correctly.
See .env.example for reference.
```

### How It Works

The backend uses **Zod** for schema-based validation:

```typescript
const envSchema = z.object({
  PORT: z.string()
    .min(1, 'PORT is required')
    .regex(/^\d+$/, 'PORT must be a valid port number')
    .transform(Number)
    .refine((port) => port > 0 && port < 65536, 'PORT must be between 1 and 65535'),
  
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    message: 'NODE_ENV must be one of: development, production, test'
  }),
  
  DATABASE_URL: z.string()
    .min(1, 'DATABASE_URL is required')
    .regex(/^mysql:\/\/.+/, 'DATABASE_URL must be a valid MySQL connection string (mysql://...)'),
});
```

---

## Frontend Validation

**Location:** `frontend/vite.config.ts`

### Validated Variables

| Variable | Required | Validation Rules |
|----------|----------|-----------------|
| `VITE_PORT` | ✅ Yes | Must be a number between 1 and 65535 |
| `VITE_API_URL` | ✅ Yes | Must be a valid HTTP/HTTPS URL |

### Example Error Output

If validation fails, you'll see:

```
❌ Frontend environment variable validation failed:

  - VITE_PORT: VITE_PORT must be between 1 and 65535
  - VITE_API_URL: VITE_API_URL must use http:// or https:// protocol

Please check your .env file and ensure all required variables are set correctly.
See frontend/.env.example for reference.
```

---

## Setting Up Your Environment

### 1. Copy the Templates

```bash
# Backend + Database (root)
cp .env.example .env

# Frontend
cp frontend/.env.example frontend/.env
```

### 2. Update Required Values

**Root `.env` (Backend + Database):**

```bash
PORT=3001
NODE_ENV=development
DATABASE_URL="mysql://user:password@localhost:3306/dbname?charset=utf8mb4&collation=utf8mb4_general_ci"
```

**Frontend `.env`:**

```bash
VITE_PORT=5173
VITE_API_URL=http://localhost:3001  # Must match PORT above
```

### 3. Start the Application

Both frontend and backend will validate environment variables on startup:

```bash
# Start both
bun run dev
```

---

## Common Validation Errors

### ❌ Missing Variable

```
- PORT: PORT is required
```

**Solution:** Add the variable to your `.env` file.

### ❌ Invalid Port Number

```
- PORT: PORT must be between 1 and 65535
```

**Solution:** Use a valid port number (e.g., 3000, 3001, 8080).

### ❌ Invalid URL Format

```
- VITE_API_URL: VITE_API_URL must be a valid URL
```

**Solution:** Ensure the URL includes protocol (http:// or https://).

### ❌ Wrong NODE_ENV Value

```
- NODE_ENV: NODE_ENV must be one of: development, production, test
```

**Solution:** Use one of the allowed values: `development`, `production`, or `test`.

### ❌ Invalid Database URL

```
- DATABASE_URL: DATABASE_URL must be a valid MySQL connection string (mysql://...)
```

**Solution:** Ensure your DATABASE_URL starts with `mysql://` and follows the correct format:
```
mysql://username:password@host:port/database?charset=utf8mb4&collation=utf8mb4_general_ci
```

---

## Benefits

✅ **Early Error Detection** - Catches configuration issues before runtime  
✅ **Clear Error Messages** - Tells you exactly what's wrong and where  
✅ **Prevents Silent Failures** - Won't start with invalid configuration  
✅ **Type Safety** - Validated values have correct types (number, string, enum)  
✅ **Documentation** - `.env.example` files serve as living documentation  
✅ **Developer Experience** - Fast feedback loop for configuration issues  

---

## Runtime Monitoring

In addition to startup validation, the application includes a **health check endpoint** that continuously monitors configuration:

```bash
curl http://localhost:3001/health
```

The health check verifies:

- ✅ All required environment variables are set
- ✅ All variables have valid values
- ✅ Database connection is working

See [HEALTH_CHECK.md](./HEALTH_CHECK.md) for complete documentation.

---

## Related Files

- **`.env.example`** - Backend/database environment template
- **`frontend/.env.example`** - Frontend environment template
- **`server/index.ts`** - Backend validation implementation
- **`frontend/vite.config.ts`** - Frontend validation implementation
- **[HEALTH_CHECK.md](./HEALTH_CHECK.md)** - Runtime health and configuration monitoring
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Complete environment setup guide

---

**Last Updated:** October 2025
