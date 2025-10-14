# Environment Variable Validation

This document explains the comprehensive environment variable validation system implemented in this project.

## Overview

Both the **frontend** and **backend** validate all required environment variables at startup. If any variable is missing or invalid, the application will:
1. **Fail to start**
2. **Display clear error messages** explaining what's wrong
3. **Reference the `env.template` file** for guidance

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
See env.template for reference.
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
See env.template for reference.
```

### How It Works

The frontend uses a **custom validation function** (no external dependencies):

```typescript
function validateEnvironment(): { VITE_PORT: number; VITE_API_URL: string } {
  const errors: ValidationError[] = [];

  // Validate VITE_PORT
  const VITE_PORT = process.env.VITE_PORT;
  if (!VITE_PORT) {
    errors.push({ field: 'VITE_PORT', message: 'VITE_PORT is required' });
  } else if (!/^\d+$/.test(VITE_PORT)) {
    errors.push({ field: 'VITE_PORT', message: 'VITE_PORT must be a valid port number' });
  } else {
    const port = parseInt(VITE_PORT, 10);
    if (port < 1 || port > 65535) {
      errors.push({ field: 'VITE_PORT', message: 'VITE_PORT must be between 1 and 65535' });
    }
  }

  // Validate VITE_API_URL
  const VITE_API_URL = process.env.VITE_API_URL;
  if (!VITE_API_URL) {
    errors.push({ field: 'VITE_API_URL', message: 'VITE_API_URL is required' });
  } else {
    try {
      const url = new URL(VITE_API_URL);
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push({ 
          field: 'VITE_API_URL', 
          message: 'VITE_API_URL must use http:// or https:// protocol' 
        });
      }
    } catch {
      errors.push({ 
        field: 'VITE_API_URL', 
        message: `VITE_API_URL must be a valid URL. Current value: ${VITE_API_URL}` 
      });
    }
  }

  if (errors.length > 0) {
    // Display errors and exit
    console.error('❌ Frontend environment variable validation failed:');
    errors.forEach((error) => console.error(`  - ${error.field}: ${error.message}`));
    process.exit(1);
  }

  return { VITE_PORT: parseInt(VITE_PORT!, 10), VITE_API_URL: VITE_API_URL! };
}
```

---

## Setting Up Your Environment

### 1. Copy the Template

```bash
cp env.template .env
```

### 2. Update Required Values

Open `.env` and replace placeholder values:

```bash
# Backend
PORT=3000                           # Your backend server port
NODE_ENV=development                # development, production, or test
DATABASE_URL="mysql://user:pass@localhost:3306/dbname?charset=utf8mb4&collation=utf8mb4_general_ci"

# Frontend
VITE_PORT=5173                      # Your frontend dev server port
VITE_API_URL=http://localhost:3000  # Must match backend PORT
```

### 3. Start the Application

Both frontend and backend will validate environment variables on startup:

```bash
# Backend
cd server
bun run index.ts

# Frontend
cd frontend
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

**Solution:** Use a valid port number (e.g., 3000, 5173, 8080).

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

**Solution:** Ensure your DATABASE_URL starts with `mysql://` and follows the correct format.

---

## Benefits

✅ **Early Error Detection** - Catches configuration issues before runtime  
✅ **Clear Error Messages** - Tells you exactly what's wrong and where  
✅ **Prevents Silent Failures** - Won't start with invalid configuration  
✅ **Type Safety** - Validated values have correct types (number, string, enum)  
✅ **Documentation** - `env.template` serves as living documentation  
✅ **Developer Experience** - Fast feedback loop for configuration issues  

---

## Adding New Variables

### Backend (with Zod)

1. Add to the schema in `server/index.ts`:

```typescript
const envSchema = z.object({
  // ... existing fields
  NEW_VARIABLE: z.string().min(1, 'NEW_VARIABLE is required'),
});
```

2. Add to validation call:

```typescript
const validated = envSchema.parse({
  // ... existing fields
  NEW_VARIABLE: process.env.NEW_VARIABLE,
});
```

3. Extract the value:

```typescript
const NEW_VARIABLE = env.NEW_VARIABLE;
```

### Frontend (custom validation)

1. Add validation in `frontend/vite.config.ts`:

```typescript
const NEW_VAR = process.env.NEW_VAR;
if (!NEW_VAR) {
  errors.push({ field: 'NEW_VAR', message: 'NEW_VAR is required' });
}
```

2. Add to return object:

```typescript
return {
  // ... existing fields
  NEW_VAR: NEW_VAR!,
};
```

### Don't Forget

- Update `env.template` with the new variable
- Document validation rules in the template
- Update this file (`ENV_VALIDATION.md`)

---

## Runtime Monitoring

In addition to startup validation, the application includes a **health check endpoint** that continuously monitors configuration:

```bash
curl http://localhost:3000/health
```

The health check verifies:
- ✅ All required environment variables are set
- ✅ All variables have valid values
- ✅ Database connection is working

See [HEALTH_CHECK.md](./HEALTH_CHECK.md) for complete documentation.

---

## Related Files

- **`env.template`** - Template with all required variables and documentation
- **`server/index.ts`** - Backend validation implementation
- **`frontend/vite.config.ts`** - Frontend validation implementation
- **`HEALTH_CHECK.md`** - Runtime health and configuration monitoring
- **`.env`** - Your local environment configuration (gitignored)

---

## Questions?

See the comments in:
- `server/index.ts` (lines 11-53) for backend validation
- `frontend/vite.config.ts` (lines 5-64) for frontend validation
- `env.template` for variable documentation
- `HEALTH_CHECK.md` for runtime monitoring

