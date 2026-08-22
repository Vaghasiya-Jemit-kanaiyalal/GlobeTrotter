const { sendError } = require('../utils/response');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return sendError(res, 'Validation failed', 422, 'VALIDATION_ERROR', formattedErrors);
      }
      return sendError(res, error.message || 'Invalid request data', 422, 'VALIDATION_ERROR');
    }
  };
}

module.exports = {
  validate
};
