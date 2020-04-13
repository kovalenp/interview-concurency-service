const HttpError = require('./HttpError');

class InternalServerError extends HttpError {
  constructor(message) {
    super(500, message);
  }
}

module.exports = InternalServerError;
