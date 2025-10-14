import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import prisma from './lib/prisma.ts';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: '../.env' });

// Environment variable validation schema
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

// Validate environment variables at startup
function validateEnvironment() {
  try {
    const validated = envSchema.parse({
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
    });
    
    console.log('✅ Environment variables validated successfully');
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:');
      console.error('');
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
      console.error('');
      console.error('Please check your .env file and ensure all required variables are set correctly.');
      console.error('See env.template for reference.');
      process.exit(1);
    }
    throw error;
  }
}

// Validate and extract environment variables
const env = validateEnvironment();
const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;

const app = express();

// Error logging utility
interface ErrorLogContext {
  req?: Request;
  errorId?: string;
  additionalContext?: Record<string, any>;
}

const logError = (error: Error, context: ErrorLogContext = {}) => {
  const errorId = context.errorId || crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  // Log to console in structured format
  console.error('='.repeat(80));
  console.error(`ERROR [${errorId}] at ${timestamp}`);
  console.error('Message:', error.message);
  console.error('Name:', error.name);
  if (context.req) {
    console.error('Request:', `${context.req.method} ${context.req.originalUrl || context.req.url}`);
    console.error('IP:', context.req.ip);
    console.error('Query:', JSON.stringify(context.req.query, null, 2));
    console.error('Params:', JSON.stringify(context.req.params, null, 2));
    console.error('Body:', JSON.stringify(context.req.body, null, 2));
  }
  if (context.additionalContext) {
    console.error('Context:', JSON.stringify(context.additionalContext, null, 2));
  }
  console.error('Stack:', error.stack);
  console.error('='.repeat(80));

  // In production, you would send this to a logging service
  // e.g., Sentry, LogRocket, CloudWatch, etc.
  
  return errorId;
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validation middleware factory
const validate = (schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body) as any;
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query) as any;
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params) as any;
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation Error',
          details: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
};

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
});

const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid user ID format').transform(Number),
});

const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default('1').transform(Number),
  limit: z.string().regex(/^\d+$/).optional().default('10').transform(Number),
});

// Health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  const checks: {
    database: { status: 'ok' | 'error'; message?: string };
    configuration: { status: 'ok' | 'error'; message?: string; missing?: string[] };
  } = {
    database: { status: 'ok' },
    configuration: { status: 'ok' },
  };

  // Check database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database.status = 'ok';
    checks.database.message = 'Database connection successful';
  } catch (error) {
    checks.database.status = 'error';
    checks.database.message = error instanceof Error ? error.message : 'Database connection failed';
  }

  // Check required environment variables
  const requiredEnvVars = ['PORT', 'NODE_ENV', 'DATABASE_URL'];
  const missingVars: string[] = [];
  const invalidVars: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  // Validate NODE_ENV value
  if (process.env.NODE_ENV && !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    invalidVars.push(`NODE_ENV (must be development, production, or test)`);
  }

  // Validate PORT value
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      invalidVars.push(`PORT (must be between 1 and 65535)`);
    }
  }

  // Validate DATABASE_URL format
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('mysql://')) {
    invalidVars.push(`DATABASE_URL (must start with mysql://)`);
  }

  if (missingVars.length > 0 || invalidVars.length > 0) {
    checks.configuration.status = 'error';
    const errorMessages: string[] = [];
    if (missingVars.length > 0) {
      errorMessages.push(`Missing: ${missingVars.join(', ')}`);
    }
    if (invalidVars.length > 0) {
      errorMessages.push(`Invalid: ${invalidVars.join(', ')}`);
    }
    checks.configuration.message = errorMessages.join('; ');
    checks.configuration.missing = missingVars;
  } else {
    checks.configuration.message = 'All required environment variables are configured';
  }

  // Determine overall health status
  const isHealthy = checks.database.status === 'ok' && checks.configuration.status === 'ok';
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    status: isHealthy ? 'ok' : 'error',
    timestamp,
    environment: NODE_ENV,
    checks,
    uptime: process.uptime(),
    ...(NODE_ENV === 'development' && {
      // Include additional debug info in development
      version: process.version,
      platform: process.platform,
    }),
  });
});

// API routes
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
  });
});

// Example endpoint - replace with your actual endpoints
app.get('/api/example', (_req: Request, res: Response) => {
  res.json({
    data: 'This is an example endpoint',
    timestamp: new Date().toISOString(),
  });
});

// Example Prisma endpoint - get all users with pagination
app.get('/api/users', validate({ query: paginationSchema }), async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);
    
    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const errorId = logError(err, { 
      req,
      additionalContext: { operation: 'fetch_users', query: req.query }
    });
    
    res.status(500).json({
      error: 'Failed to fetch users',
      errorId,
      ...(NODE_ENV === 'development' && { message: err.message }),
    });
  }
});

// Example POST endpoint with validation - create user
app.post('/api/users', validate({ body: createUserSchema }), async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    
    res.status(201).json({
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const errorId = logError(err, { 
      req,
      additionalContext: { operation: 'create_user', email: req.body.email }
    });
    
    res.status(500).json({
      error: 'Failed to create user',
      errorId,
      ...(NODE_ENV === 'development' && { message: err.message }),
    });
  }
});

// Example GET endpoint with param validation - get user by ID
app.get('/api/users/:id', validate({ params: userIdSchema }), async (req: Request, res: Response) => {
  try {
    const { id } = req.params as unknown as { id: number };
    
    const user = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      res.status(404).json({
        error: 'User not found',
      });
      return;
    }
    
    res.json({
      data: user,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const errorId = logError(err, { 
      req,
      additionalContext: { operation: 'fetch_user_by_id', userId: req.params.id }
    });
    
    res.status(500).json({
      error: 'Failed to fetch user',
      errorId,
      ...(NODE_ENV === 'development' && { message: err.message }),
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Log error with full context server-side
  const errorId = logError(err, { req });
  
  // Return safe response to client
  const response: any = {
    error: 'Internal Server Error',
    errorId, // Include error ID for support/debugging correlation
  };

  // In development, include detailed error information
  if (NODE_ENV === 'development') {
    response.message = err.message;
    response.stack = err.stack;
    response.name = err.name;
  } else {
    // In production, provide a generic message but tell user to reference the errorId
    response.message = 'An unexpected error occurred. Please contact support with the error ID if the problem persists.';
  }

  res.status(500).json(response);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
});
