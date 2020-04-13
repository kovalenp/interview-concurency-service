const { healthHandler, initHandler } = require('./handlers');
const logger = require('./logger');
const { NotFoundError, MethodNotAllowedError } = require('./errors');

exports.handler = async (event) => {
  logger.debug({ event }, 'Incomming request to lambda');

  if (event.path.endsWith('/health')) return healthHandler(event);

  if (event.path.endsWith('/concurrency')) {
    if (event.httpMethod === 'POST') {
      return initHandler(event);
    }
    return new MethodNotAllowedError(
      `Resource does not support method ${event.httpMethod}`,
    );
  }

  return new NotFoundError('No such route');
};
