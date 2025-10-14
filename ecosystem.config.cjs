// Load environment variables from .env file
// Using override option to ensure .env values take precedence
require('dotenv').config({ override: true });

module.exports = {
  apps: [
    {
      name: 'frontend', // WorkshopManager will replace this with unique name
      namespace: 'PROJECT_NAME_PLACEHOLDER', // WorkshopManager replaces this
      cwd: './frontend',
      script: 'bun',
      args: 'run dev',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
        // Explicitly pass through environment variables from .env
        VITE_PORT: process.env.VITE_PORT,
        VITE_API_URL: process.env.VITE_API_URL,
      },
      env_production: {
        NODE_ENV: 'production',
        VITE_PORT: process.env.VITE_PORT,
        VITE_API_URL: process.env.VITE_API_URL,
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'backend', //WorkshopManager will replace this with unique name
      namespace: 'PROJECT_NAME_PLACEHOLDER', // WorkshopManager replaces this
      cwd: './server',
      script: 'bun',
      args: 'run dev',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
        // Explicitly pass through environment variables from .env
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
