const HttpError = require('./HttpError');

class InputValidationError extends HttpError {
  constructor(message) {
    super(400, message);
  }
}

module.exports = InputValidationError;
