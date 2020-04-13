const redis = require('../redis');
const logger = require('../logger');
const response = require('../response');
const { ConcurrencyError, InternalServerError } = require('../errors');
const { ttl, allowedConcurrencyNum } = require('../config');

/**
 * Returns concurrency session ids used in Redis cache to store playback sessions
 *
 * @param {string} userId User Account identifier
 * @param {number} num Number of allowed concurrent sessions
 * @returns {string[]} Array of concurent session keys
 */
const buildSessionKeys = (userId, num) => {
  const keys = [];
  for (let i = 1; i <= num; i += 1) {
    keys.push(`${userId}_${i}`);
  }
  return keys;
};

/**
 * Handles initial (playback start) request to concurrency service
 *
 * @param {*} event Lambda event
 * @returns HTTP response
 */
const initHandler = async (event) => {
  logger.debug({ event }, 'Executing initHandler');

  const { deviceId, streamId, userId } = JSON.parse(event.body);
  const userSessionKeys = buildSessionKeys(userId, allowedConcurrencyNum);
  const token = `${deviceId}_${streamId}`;
  try {
    const userTokens = await redis.mget(userSessionKeys); // e.g. [null, token, null]
    logger.debug({ userTokens }, 'Got user concurrency sessions tokens');

    let sessionKey;

    // if token already exist => update it
    // note: not a regular flow, e.g. user initiated playback => browser crashed => user started playback again
    if (userTokens.includes(token)) {
      sessionKey = userSessionKeys[userTokens.indexOf(token)];

      await redis.set(sessionKey, token, 'EX', ttl);

      return response(200, {
        sessionKey,
        token,
        status: 'updated',
      });
    }

    // there is no sessionKeys with such tocket (new playback session)
    if (!userTokens.includes(null)) {
      // there are no free slots (user already reached max concurrency)
      return new ConcurrencyError('User reached concurrency playback limit');
    }

    // there is a free slot in concurrency sessions (user has < allowed concurrency playbacks)
    sessionKey = userSessionKeys[userTokens.indexOf(null)];
    await redis.set(sessionKey, token, 'EX', ttl); // use redis build-in TTL to expiry session if wasn't terminated
    return response(200, {
      sessionKey,
      token,
      status: 'initiated',
    });
  } catch (ex) {
    logger.error({ errorMessage: ex.message }, 'Exception in initHandler');
    return new InternalServerError('Unexpected error occurred');
  }
};

module.exports = initHandler;
