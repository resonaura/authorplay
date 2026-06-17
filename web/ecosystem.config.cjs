module.exports = {
  apps: [
    {
      name: 'authorplay',
      script: 'npm',
      args: 'run serve',
      cwd: '.',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
