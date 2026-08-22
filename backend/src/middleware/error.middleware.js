const { sendError } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error('API Error:', err);

  if (err.name === 'UnauthorizedError') {
    return sendError(res, 'Unauthorized access', 401, 'UNAUTHORIZED');
  }

  if (err.name === 'MulterError') {
    return sendError(res, `Upload error: ${err.message}`, 400, 'UPLOAD_ERROR');
  }

  if (err.statusCode) {
    return sendError(res, err.message, err.statusCode, err.errorCode || 'ERROR', err.details);
  }

  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500,
    'INTERNAL_SERVER_ERROR'
  );
}

function notFoundHandler(req, res) {
  return sendError(res, `Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
}

module.exports = {
  errorHandler,
  notFoundHandler
};
