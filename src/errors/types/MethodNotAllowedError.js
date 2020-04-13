const HttpError = require('./HttpError');

class MethodNotAllowedError extends HttpError {
  constructor(message) {
    super(405, message);
  }
}

module.exports = MethodNotAllowedError;
