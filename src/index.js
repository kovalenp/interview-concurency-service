const {
  healthHandler,
  initHandler,
  deleteHandler,
  heartbeatHandler,
} = require('./handlers');
const logger = require('./logger');
const { NotFoundError, MethodNotAllowedError } = require('./errors');
const httpMethods = require('./enums/httpMethods');

exports.handler = async (event) => {
  logger.debug({ event }, 'Incoming request to lambda');

  if (event.path.endsWith('/health')) return healthHandler(event);

  if (event.path.endsWith('/concurrency')) {
    if (event.httpMethod === httpMethods.POST) {
      return initHandler(event);
    }
    if (event.httpMethod === httpMethods.DELETE) {
      return deleteHandler(event);
    }
    if (event.httpMethod === httpMethods.PUT) {
      return heartbeatHandler(event);
    }
    return new MethodNotAllowedError(
      `Resource does not support method ${event.httpMethod}`,
    );
  }

  return new NotFoundError('No such route');
};
