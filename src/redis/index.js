const redis = require('async-redis');
const logger = require('../logger')

const createRedisClient = () => {

  const port = process.env.REDIS_PORT
  const url = process.env.REDIS_URL

  logger.info({ url, port }, 'Connecting to redis')

  const clientObj = redis.createClient(
    port,
    url,
    { no_ready_check: true }
  );

  clientObj.on('error', (err) => {
    logger.error({ errorMessage: err.message }, 'Redis client error')
  });

  return clientObj;
};

module.exports = createRedisClient();