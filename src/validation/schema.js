const Joi = require('joi');

const initConcurrencySchema = Joi.object().keys({
  userId: Joi.string().required(),
  deviceId: Joi.string().required(),
  streamId: Joi.string().required(),
});

const heartbeatSchema = Joi.object().keys({
  sessionKey: Joi.string().required(),
  token: Joi.string().required(),
});

const deleteSchema = Joi.object().keys({
  sessionKey: Joi.string().required(),
});

exports.initConcurrencySchema = initConcurrencySchema;
exports.heartbeatSchema = heartbeatSchema;
exports.deleteSchema = deleteSchema;
