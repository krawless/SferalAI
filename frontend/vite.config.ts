import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Environment variable validation
interface ValidationError {
  field: string;
  message: string;
}

function validateEnvironment(env: Record<string, string>): { VITE_PORT: number; VITE_API_URL: string } {
  const errors: ValidationError[] = [];

  // Validate VITE_PORT
  const VITE_PORT = env.VITE_PORT;
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
  const VITE_API_URL = env.VITE_API_URL;
  if (!VITE_API_URL) {
    errors.push({ field: 'VITE_API_URL', message: 'VITE_API_URL is required' });
  } else {
    try {
      const url = new URL(VITE_API_URL);
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push({ field: 'VITE_API_URL', message: 'VITE_API_URL must use http:// or https:// protocol' });
      }
    } catch {
      errors.push({ field: 'VITE_API_URL', message: `VITE_API_URL must be a valid URL. Current value: ${VITE_API_URL}` });
    }
  }

  // If there are validation errors, display them and exit
  if (errors.length > 0) {
    console.error('❌ Frontend environment variable validation failed:');
    console.error('');
    errors.forEach((error) => {
      console.error(`  - ${error.field}: ${error.message}`);
    });
    console.error('');
    console.error('Please check your .env file and ensure all required variables are set correctly.');
    console.error('See env.example for reference.');
    process.exit(1);
  }

  console.log('✅ Frontend environment variables validated successfully');
  
  return {
    VITE_PORT: parseInt(VITE_PORT!, 10),
    VITE_API_URL: VITE_API_URL!,
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Validate and extract environment variables
  const validatedEnv = validateEnvironment(env);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true, // Listen on all addresses including IPv4
      port: validatedEnv.VITE_PORT,
    },
  };
});
