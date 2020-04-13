const redis = require('../redis');
const logger = require('../logger');
const response = require('../response');
const { InternalServerError } = require('../errors');

const deleteHandler = async (event) => {
  logger.debug({ event }, 'Executing deleteHandler');
  const { sessionKey } = JSON.parse(event.body);

  try {
    await redis.del(sessionKey); // delete passed sessionKey and free concurrency slot
    return response(204);
  } catch (ex) {
    logger.error({ errorMessage: ex.message }, 'Exception in deleteHandler');
    return new InternalServerError('Unexpected error occured');
  }
};

module.exports = deleteHandler;
