const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, 'Registration successful', result, 201);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return sendSuccess(res, 'Login successful', result, 200);
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, 'User profile fetched', { user }, 200);
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.body.email);
    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { email, token, newPassword } = req.body;
    const result = await authService.resetPassword(email, token, newPassword);
    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword
};
