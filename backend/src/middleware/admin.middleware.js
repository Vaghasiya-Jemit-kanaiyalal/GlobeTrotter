const { sendError } = require('../utils/response');

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'Access denied. Admin role required.', 403, 'FORBIDDEN');
  }
  next();
}

module.exports = {
  requireAdmin
};
