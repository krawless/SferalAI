import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Validate required environment variables
const VITE_PORT = process.env.VITE_PORT;
if (!VITE_PORT) {
  throw new Error('VITE_PORT environment variable is required. Please set it in your .env file.');
}

const VITE_API_URL = process.env.VITE_API_URL;
if (!VITE_API_URL) {
  throw new Error('VITE_API_URL environment variable is required. Please set it in your .env file.');
}

// Validate VITE_API_URL format
try {
  new URL(VITE_API_URL);
} catch (error) {
  throw new Error(`VITE_API_URL must be a valid URL. Current value: ${VITE_API_URL}`);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Listen on all addresses including IPv4
    port: parseInt(VITE_PORT),
  },
});
