// frontend/src/helpers/validation.helper.js

/**
 * Verifica si un valor no es nulo, indefinido o una cadena de texto vacía.
 * @param {*} value El valor a verificar.
 * @returns {boolean} `true` si el valor no está vacío, de lo contrario `false`.
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Verifica si una cadena de texto tiene el formato de un correo electrónico válido.
 * @param {string} email El correo a validar.
 * @returns {boolean} `true` si el formato es válido, de lo contrario `false`.
 */
export const isValidEmail = (email) => {
  // Expresión regular estándar para la validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Verifica si una contraseña cumple con los requisitos mínimos de seguridad.
 * (Ej: mínimo 8 caracteres, al menos una letra y un número)
 * @param {string} password La contraseña a validar.
 * @returns {boolean} `true` si la contraseña es fuerte, de lo contrario `false`.
 */
export const isStrongPassword = (password) => {
  // Mínimo 8 caracteres, al menos una letra y un número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};