/**
 * Standard API Response Utilities
 */

function sendSuccess(res, message, data = null, statusCode = 200) {
  const response = {
    success: true,
    message
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
}

function sendError(res, message, statusCode = 400, errorCode = 'BAD_REQUEST', details = null) {
  const response = {
    success: false,
    message,
    error: {
      code: errorCode
    }
  };
  if (details) {
    response.errors = details;
  }
  return res.status(statusCode).json(response);
}

function sendPaginated(res, message, items, page, limit, total, statusCode = 200) {
  const totalPages = Math.ceil(total / limit) || 1;
  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
}

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated
};
