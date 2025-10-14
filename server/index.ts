import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z, ZodError } from 'zod';
import prisma from './lib/prisma.ts';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('PORT environment variable is required. Please set it in your .env file.');
}

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
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation Error',
          details: error.errors.map(err => ({
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
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
});

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

// API routes
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
  });
});

// Example endpoint - replace with your actual endpoints
app.get('/api/example', (req: Request, res: Response) => {
  res.json({
    data: 'This is an example endpoint',
    timestamp: new Date().toISOString(),
  });
});

// Example Prisma endpoint - get all users with pagination
app.get('/api/users', validate({ query: paginationSchema }), async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query as { page: number; limit: number };
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
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
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
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Failed to create user',
    });
  }
});

// Example GET endpoint with param validation - get user by ID
app.get('/api/users/:id', validate({ params: userIdSchema }), async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: number };
    
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
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
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

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
