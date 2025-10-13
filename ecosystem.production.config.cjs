module.exports = {
  apps: [
    {
      name: 'backend-prod',
      cwd: './server',
      script: 'bun',
      args: 'run start',
      interpreter: 'none',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: './logs/backend-prod-error.log',
      out_file: './logs/backend-prod-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M',
    },
  ],
};
