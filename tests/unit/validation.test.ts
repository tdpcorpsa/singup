import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateDNI,
  validateRequired,
  validateForm,
  FormData
} from '../../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test123@test-domain.org',
        'user+tag@example.com'
      ];
      
      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });
    
    it('should return false for invalid emails', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user.domain.com',
        'user@domain.',
        'user space@domain.com'
      ];
      
      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
    
    it('should handle null and undefined inputs', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
    });
    
    it('should handle non-string inputs', () => {
      expect(validateEmail(123 as any)).toBe(false);
      expect(validateEmail({} as any)).toBe(false);
      expect(validateEmail([] as any)).toBe(false);
    });
  });
  
  describe('validatePassword', () => {
    it('should return true for passwords meeting minimum length', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('abcdef')).toBe(true);
    });
    
    it('should return false for passwords below minimum length', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('abc')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
    
    it('should respect custom minimum length', () => {
      expect(validatePassword('abc', 3)).toBe(true);
      expect(validatePassword('ab', 3)).toBe(false);
      expect(validatePassword('abcdefghij', 10)).toBe(true);
      expect(validatePassword('abcdefghi', 10)).toBe(false);
    });
    
    it('should handle null and undefined inputs', () => {
      expect(validatePassword(null as any)).toBe(false);
      expect(validatePassword(undefined as any)).toBe(false);
    });
  });
  
  describe('validatePasswordMatch', () => {
    it('should return true for matching passwords', () => {
      expect(validatePasswordMatch('password123', 'password123')).toBe(true);
      expect(validatePasswordMatch('abc', 'abc')).toBe(true);
    });
    
    it('should return false for non-matching passwords', () => {
      expect(validatePasswordMatch('password123', 'password124')).toBe(false);
      expect(validatePasswordMatch('abc', 'def')).toBe(false);
      expect(validatePasswordMatch('Password', 'password')).toBe(false);
    });
    
    it('should return false for empty passwords', () => {
      expect(validatePasswordMatch('', '')).toBe(false);
      expect(validatePasswordMatch('password', '')).toBe(false);
      expect(validatePasswordMatch('', 'password')).toBe(false);
    });
  });
  
  describe('validateDNI', () => {
    it('should return true for DNIs meeting minimum length', () => {
      expect(validateDNI('12345678')).toBe(true);
      expect(validateDNI('123456789')).toBe(true);
      expect(validateDNI('  12345678  ')).toBe(true); // with spaces
    });
    
    it('should return false for DNIs below minimum length', () => {
      expect(validateDNI('1234567')).toBe(false);
      expect(validateDNI('123')).toBe(false);
      expect(validateDNI('')).toBe(false);
    });
    
    it('should respect custom minimum length', () => {
      expect(validateDNI('12345', 5)).toBe(true);
      expect(validateDNI('1234', 5)).toBe(false);
    });
    
    it('should handle null and undefined inputs', () => {
      expect(validateDNI(null as any)).toBe(false);
      expect(validateDNI(undefined as any)).toBe(false);
    });
  });
  
  describe('validateRequired', () => {
    it('should return true for non-empty strings', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('a')).toBe(true);
      expect(validateRequired('  text  ')).toBe(true);
    });
    
    it('should return false for empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired('\t\n')).toBe(false);
    });
    
    it('should handle null and undefined inputs', () => {
      expect(validateRequired(null as any)).toBe(false);
      expect(validateRequired(undefined as any)).toBe(false);
    });
  });
  
  describe('validateForm', () => {
    const validFormData: FormData = {
      username: '12345678',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez García',
      mail: 'juan@example.com',
      clave: 'password123',
      confirmarClave: 'password123'
    };
    
    it('should return valid for complete valid form', () => {
      const result = validateForm(validFormData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
    
    it('should return errors for invalid username', () => {
      const invalidForm = { ...validFormData, username: '1234567' };
      const result = validateForm(invalidForm);
      expect(result.isValid).toBe(false);
      expect(result.errors.username).toBe('La identificación debe tener al menos 8 caracteres.');
    });
    
    it('should return errors for empty nombres', () => {
      const invalidForm = { ...validFormData, nombres: '' };
      const result = validateForm(invalidForm);
      expect(result.isValid).toBe(false);
      expect(result.errors.nombres).toBe('Los nombres son requeridos.');
    });
    
    it('should return errors for empty apellidos', () => {
      const invalidForm = { ...validFormData, apellidos: '   ' };
      const result = validateForm(invalidForm);
      expect(result.isValid).toBe(false);
      expect(result.errors.apellidos).toBe('Los apellidos son requeridos.');
    });
    
    it('should return errors for invalid email', () => {
      const invalidForm = { ...validFormData, mail: 'invalid-email' };
      const result = validateForm(invalidForm);
      expect(result.isValid).toBe(false);
      expect(result.errors.mail).toBe('Ingresa un correo válido.');
    });
    
    it('should return errors for short password', () => {
      const invalidForm = { ...validFormData, clave: '12345' };
      const result = validateForm(invalidForm);
      expect(result.isValid).toBe(false);
      expect(result.errors.clave).toBe('Clave mínima de 6 caracteres.');
    });
    
    it('should return errors for non-matching passwords', () => {
      const invalidForm = { ...validFormData, confirmarClave: 'different' };
      const result = validateForm(invalidForm);
      expect(result.isValid).toBe(false);
      expect(result.errors.confirmarClave).toBe('Las claves no coinciden.');
    });
    
    it('should return multiple errors for multiple invalid fields', () => {
      const invalidForm: FormData = {
        username: '123',
        nombres: '',
        apellidos: 'Pérez',
        mail: 'invalid',
        clave: '123',
        confirmarClave: '456'
      };
      
      const result = validateForm(invalidForm);
      expect(result.isValid).toBe(false);
      expect(result.errors.username).toBeDefined();
      expect(result.errors.nombres).toBeDefined();
      expect(result.errors.mail).toBeDefined();
      expect(result.errors.clave).toBeDefined();
      expect(result.errors.confirmarClave).toBeDefined();
    });
  });
});