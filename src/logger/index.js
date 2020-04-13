const setLogLevel = () => {
  // couple LOG_LEVEL to ENV
  // suppress logs for local unit tests
  switch (process.env.CONFIG_ENV) {
    case 'production':
      return 'info';
    case 'development':
      return 'trace';
    case 'local-test':
      return 'silent';
    default:
      return 'debug';
  }
};

module.exports = require('pino')({ level: setLogLevel() });
