module.exports = {
  apps: [
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'bun',
      args: 'run dev',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
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
      name: 'backend',
      cwd: './server',
      script: 'bun',
      args: 'run dev',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
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
