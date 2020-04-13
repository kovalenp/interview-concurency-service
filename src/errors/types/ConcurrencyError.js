const HttpError = require('./HttpError');

class ConcurrencyError extends HttpError {
  constructor(message) {
    super(403, message);
  }
}

module.exports = ConcurrencyError;
