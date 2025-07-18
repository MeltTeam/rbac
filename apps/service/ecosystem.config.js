module.exports = {
  apps: [
    {
      name: '@app/api',
      script: './dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      error_file: '/dev/null',
      out_file: '/dev/null',
    },
  ],
}
