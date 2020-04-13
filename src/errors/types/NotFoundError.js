const HttpError = require('./HttpError');

class NotFoundError extends HttpError {
  constructor(message) {
    super(404, message);
  }
}

module.exports = NotFoundError;
