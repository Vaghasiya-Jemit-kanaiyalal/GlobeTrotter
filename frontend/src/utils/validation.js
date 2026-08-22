/**
 * Validation utility helper for GlobeTrotter forms
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email address or username is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.includes('@')) {
    // Treat as username if no @ symbol
    if (email.trim().length < 3) {
      return 'Username must be at least 3 characters';
    }
    return null;
  }
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g. alex@example.com)';
  }
  return null;
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: 'Weak', color: '#DC2626' };
    case 2:
      return { score: 2, label: 'Fair', color: '#D97706' };
    case 3:
      return { score: 3, label: 'Good', color: '#0284C7' };
    case 4:
      return { score: 4, label: 'Strong', color: '#16A34A' };
    default:
      return { score: 0, label: 'Too short', color: '#94A3B8' };
  }
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return 'Phone number is required';
  }
  // Allow numbers, spaces, plus, hyphens, parens
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  if (!phoneRegex.test(phone.trim()) || phone.trim().replace(/\D/g, '').length < 7) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateLoginForm = (values) => {
  const errors = {};
  
  const emailErr = validateEmail(values.identifier);
  if (emailErr) errors.identifier = emailErr;

  const passwordErr = validatePassword(values.password);
  if (passwordErr) errors.password = passwordErr;

  return errors;
};

export const validateRegisterForm = (values) => {
  const errors = {};

  if (!values.firstName || !values.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!values.lastName || !values.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  const emailErr = validateEmail(values.email);
  if (emailErr) errors.email = emailErr;

  const passwordErr = validatePassword(values.password);
  if (passwordErr) errors.password = passwordErr;

  if (values.password && values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  const phoneErr = validatePhone(values.phone);
  if (phoneErr) errors.phone = phoneErr;

  if (!values.city || !values.city.trim()) {
    errors.city = 'City is required';
  }

  if (!values.country || !values.country.trim()) {
    errors.country = 'Please select your country';
  }

  if (!values.terms) {
    errors.terms = 'You must agree to the Terms of Service and Privacy Policy';
  }

  return errors;
};

