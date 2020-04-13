class HttpError {
  constructor(httpCode, message) {
    this.statusCode = httpCode;
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.body = JSON.stringify({ message })
  }
}

module.exports = HttpError;
