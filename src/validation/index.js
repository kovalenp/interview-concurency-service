const Joi = require('joi');
const joiErrorFormatter = require('joi-error-formatter');
const { InputValidationError } = require('../errors');

const validate = (data, schema) => {
  const { error } = Joi.validate(data, schema);
  if (error) {
    throw new InputValidationError(joiErrorFormatter(error));
  }
};

module.exports = validate;
