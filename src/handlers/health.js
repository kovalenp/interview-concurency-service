const log = require('../logger')

const healthHandler = (event) => {

  log.debug({ event }, 'Executed healthcheck')

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      healthy: true,
    }),
  }
};

module.exports = healthHandler;