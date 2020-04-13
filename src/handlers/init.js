const redis = require('../redis');
const logger = require('../logger');
const response = require('../response');
const { ConcurrencyError, InternalServerError } = require('../errors');

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

const initHandler = async (event) => {
  logger.debug({ event }, 'Executing initHandler');

  const { deviceId, streamId, userId } = JSON.parse(event.body);
  const userSessionKeys = buildSessionKeys(userId, 3); // has to be configured parameter (e.g. taken from some config endpoint or ENV var)
  const token = `${deviceId}_${streamId}`;
  try {
    const userTokens = await redis.mget(userSessionKeys); // e.g. [null, token, null]
    logger.debug({ userTokens }, 'Got user concurrency sessions tokens');

    let sessionKey;

    // if token already exist => update it
    // note: not a regular flow, e.g. user initiated playback => browser crashed => user started playback again
    if (userTokens.includes(token)) {
      sessionKey = userSessionKeys[userTokens.indexOf(token)];

      await redis.set(sessionKey, token, 'EX', 60);

      return response(200, {
        key: sessionKey,
        token,
        status: 'updated',
      });
    }

    // there is no sessionKeys with such tocket (new playback session)
    // there is a free slot in concurrency sessions (user has < allowed concurrency playbacks)
    if (userTokens.includes(null)) {
      sessionKey = userSessionKeys[userTokens.indexOf(null)];
      await redis.set(sessionKey, token, 'EX', 60); // user redis TTL functionality to expiry session if wasn't terminated
      return response(200, {
        key: sessionKey,
        token,
        status: 'initiated',
      });
    }

    // there are no free slots (user already reached max concurrency)
    return new ConcurrencyError('User reached concurrency playback limit');
  } catch (ex) {
    logger.error({ errorMessage: ex.message }, 'Exception in initHandler');
    return new InternalServerError('Unexpected error occured');
  }
};

module.exports = initHandler;
