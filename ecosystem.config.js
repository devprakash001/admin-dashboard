module.exports = {
  apps: [{
    name: '19pays-admin',
    script: 'npm',
    args: 'start',
    instances: 1, // Change from 'max' to 1
    exec_mode: 'fork', // Change from 'cluster' to 'fork'
    env: {
      NODE_ENV: 'production',
      PORT: 3090
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true
  }]
};