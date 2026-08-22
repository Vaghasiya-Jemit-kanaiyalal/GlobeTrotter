function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    const error = new Error('Admin access required');
    error.statusCode = 403;
    error.errorCode = 'ADMIN_ACCESS_REQUIRED';
    return next(error);
  }
  next();
}

module.exports = {
  requireAdmin
};
