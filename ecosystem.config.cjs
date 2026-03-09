module.exports = {
  apps: [
    {
      name: "takdi",
      cwd: __dirname,
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      max_memory_restart: "1G",
      restart_delay: 3000,
    },
  ],
};
