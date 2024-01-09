export function calculatePasswordStrength (password) {
  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const minLength = 8;

  if (hasNumber && hasUpperCase && hasLowerCase && password.length >= minLength) {
    return 'strong';
  } else {
    return 'weak';
  }
}
