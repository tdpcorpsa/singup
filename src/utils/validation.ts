/**
 * Utilidades de validación para el formulario de registro
 */

/**
 * Valida el formato de un email
 * @param email - Email a validar
 * @returns true si el email es válido, false en caso contrario
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida la longitud mínima de una contraseña
 * @param password - Contraseña a validar
 * @param minLength - Longitud mínima requerida (default: 6)
 * @returns true si la contraseña cumple con la longitud mínima
 */
export function validatePassword(password: string, minLength: number = 6): boolean {
  if (!password || typeof password !== 'string') {
    return false;
  }
  
  return password.length >= minLength;
}

/**
 * Valida que dos contraseñas coincidan
 * @param password - Contraseña original
 * @param confirmPassword - Contraseña de confirmación
 * @returns true si las contraseñas coinciden
 */
export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  if (!password || !confirmPassword) {
    return false;
  }
  
  return password === confirmPassword;
}

/**
 * Valida la longitud mínima de un DNI/identificación
 * @param dni - DNI a validar
 * @param minLength - Longitud mínima requerida (default: 8)
 * @returns true si el DNI cumple con la longitud mínima
 */
export function validateDNI(dni: string, minLength: number = 8): boolean {
  if (!dni || typeof dni !== 'string') {
    return false;
  }
  
  return dni.trim().length >= minLength;
}

/**
 * Valida que un campo de texto no esté vacío
 * @param value - Valor a validar
 * @returns true si el valor no está vacío
 */
export function validateRequired(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  return value.trim().length > 0;
}

/**
 * Valida todos los campos del formulario de registro
 * @param formData - Datos del formulario
 * @returns objeto con el estado de validación y errores
 */
export interface FormData {
  username: string;
  nombres: string;
  apellidos: string;
  mail: string;
  clave: string;
  confirmarClave: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    username?: string;
    nombres?: string;
    apellidos?: string;
    mail?: string;
    clave?: string;
    confirmarClave?: string;
  };
}

export function validateForm(formData: FormData): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  
  // Validar DNI
  if (!validateDNI(formData.username)) {
    errors.username = 'La identificación debe tener al menos 8 caracteres.';
  }
  
  // Validar nombres
  if (!validateRequired(formData.nombres)) {
    errors.nombres = 'Los nombres son requeridos.';
  }
  
  // Validar apellidos
  if (!validateRequired(formData.apellidos)) {
    errors.apellidos = 'Los apellidos son requeridos.';
  }
  
  // Validar email
  if (!validateEmail(formData.mail)) {
    errors.mail = 'Ingresa un correo válido.';
  }
  
  // Validar contraseña
  if (!validatePassword(formData.clave)) {
    errors.clave = 'Clave mínima de 6 caracteres.';
  }
  
  // Validar confirmación de contraseña
  if (!validatePasswordMatch(formData.clave, formData.confirmarClave)) {
    errors.confirmarClave = 'Las claves no coinciden.';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}