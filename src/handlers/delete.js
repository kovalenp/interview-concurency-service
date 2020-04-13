const redis = require('../redis');
const logger = require('../logger');
const response = require('../response');
const { InternalServerError } = require('../errors');
const { deleteSchema } = require('../validation/schema');
const validate = require('../validation');

/**
 * Handles deletion of concurrent session
 *
 * @param {*} event Lambda event
 * @returns HTTP response
 */
const deleteHandler = async (event) => {
  logger.debug({ event }, 'Executing deleteHandler');

  try {
    validate(event.body, deleteSchema);
  } catch (error) {
    logger.info({ error }, 'Invalid request parameters passed');
    return error;
  }

  const { sessionKey } = JSON.parse(event.body);

  try {
    await redis.del(sessionKey); // delete passed sessionKey and free concurrency slot
    return response(204);
  } catch (ex) {
    logger.error({ errorMessage: ex.message }, 'Exception in deleteHandler');
    return new InternalServerError('Unexpected error occurred');
  }
};

module.exports = deleteHandler;
