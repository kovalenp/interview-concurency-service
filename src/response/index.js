/**
 * Returns concurrency session ids used in Redis cache to store playback sessions
 *
 * @param {number} httpCode HTTP code
 * @param {Object} payload Response payload
 * @returns {Object} Response object
 */
const response = (httpCode, payload = null) => {
  const res = {
    statusCode: httpCode,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (payload) {
    res.body = JSON.stringify({ ...payload });
  }

  return res;
};

module.exports = response;
