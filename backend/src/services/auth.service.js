const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

async function register(registerData) {
  const existingUser = await userRepository.findByEmail(registerData.email);
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    error.errorCode = 'EMAIL_EXISTS';
    throw error;
  }

  const passwordHash = await hashPassword(registerData.password);
  const user = await userRepository.createUser({
    ...registerData,
    passwordHash
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.errorCode = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.errorCode = 'INVALID_CREDENTIALS';
    throw error;
  }

  const userProfile = await userRepository.findById(user.id);
  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: userProfile, token };
}

async function getCurrentUser(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.errorCode = 'USER_NOT_FOUND';
    throw error;
  }
  return user;
}

async function forgotPassword(email) {
  const user = await userRepository.findByEmail(email);
  // Always return success to prevent account enumeration
  if (!user) {
    return { message: 'If an account with that email exists, password reset instructions have been sent.' };
  }
  // Simulated password reset token logging
  console.log(`[SIMULATION] Password reset token for ${email}: RESET_TOKEN_${user.id}_${Date.now()}`);
  return { message: 'If an account with that email exists, password reset instructions have been sent.' };
}

async function resetPassword(email, token, newPassword) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid reset token or email');
    error.statusCode = 400;
    error.errorCode = 'INVALID_TOKEN';
    throw error;
  }

  const passwordHash = await hashPassword(newPassword);
  await userRepository.updateUser(user.id, { passwordHash });
  return { message: 'Password has been reset successfully.' };
}

module.exports = {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword
};
