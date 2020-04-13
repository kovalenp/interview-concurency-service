/**
 * Returns concurrency session ids used in Redis cache to store playbac sessions
 *
 * @param {number} httpCode HTTP code
 * @param {Object} payload Response payload
 * @returns {Object} Reponse object
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
