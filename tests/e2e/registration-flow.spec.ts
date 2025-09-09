/**
 * Pruebas End-to-End para el flujo de registro de usuario
 * Estas pruebas verifican el comportamiento completo de la aplicación desde la perspectiva del usuario
 */

import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar llamadas a APIs externas para evitar dependencias
    await page.route('**/api/check-dni', async route => {
      const request = route.request();
      const postData = request.postDataJSON();
      
      if (postData.dni === '12345678') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              ESTADO: 'ACTIVO',
              NOMBRE: 'García Pérez Juan Carlos',
              mail: ''
            }
          })
        });
      } else if (postData.dni === '87654321') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              ESTADO: 'ACTIVO',
              NOMBRE: 'García Pérez Juan Carlos',
              mail: 'existing@example.com'
            }
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              ESTADO: 'INACTIVO',
              NOMBRE: '',
              mail: ''
            }
          })
        });
      }
    });

    await page.route('**/api/send-verification-email', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.goto('/');
  });

  test('should display the registration form', async ({ page }) => {
    await expect(page.getByText('Registro de Usuario')).toBeVisible();
    
    // Check if main form elements are visible using more specific selectors
    await expect(page.locator('input[type="text"]').first()).toBeVisible(); // DNI input
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: /solicitar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /reiniciar/i })).toBeVisible();
  });

  test('should validate DNI length', async ({ page }) => {
    const dniInput = page.locator('input[type="text"]').first(); // DNI input
    
    await dniInput.fill('1234567');
    // Check if search button is disabled for short DNI
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    await expect(searchButton).toBeDisabled();
    
    await dniInput.fill('12345678');
    await expect(searchButton).toBeEnabled();
  });

  test('should enable search button when DNI is valid', async ({ page }) => {
    const dniInput = page.getByLabel(/identificación/i);
    const searchButton = page.getByRole('button', { name: /buscar/i });
    
    // Initially disabled
    await expect(searchButton).toBeDisabled();
    
    // Enable after valid DNI
    await dniInput.fill('12345678');
    await expect(searchButton).toBeEnabled();
  });

  test('should search DNI and populate form fields', async ({ page }) => {
    const dniInput = page.locator('input[type="text"]').first();
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    
    await dniInput.fill('12345678');
    await searchButton.click();
    
    // Wait for the API call and check if names are populated
    await expect(page.getByDisplayValue('Juan Carlos')).toBeVisible({ timeout: 5000 });
    await expect(page.getByDisplayValue('García Pérez')).toBeVisible();
  });

  test('should show error for inactive user', async ({ page }) => {
    const dniInput = page.locator('input[type="text"]').first();
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    
    await dniInput.fill('99999999'); // This will trigger INACTIVO response
    await searchButton.click();
    
    await expect(page.getByText(/usuario no encontrado/i)).toBeVisible();
  });

  test('should show error for user with existing email', async ({ page }) => {
    const dniInput = page.locator('input[type="text"]').first();
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    
    await dniInput.fill('87654321'); // This will trigger existing email response
    await searchButton.click();
    
    await expect(page.getByText(/usuario ya registrado/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // First search for a valid DNI
    const dniInput = page.locator('input[type="text"]').first();
    await dniInput.fill('12345678');
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    await searchButton.click();
    await expect(page.getByDisplayValue('Juan Carlos')).toBeVisible({ timeout: 5000 });
    
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('invalid-email');
    
    await expect(page.getByText('Ingresa un correo válido.')).toBeVisible();
    
    await emailInput.fill('valid@example.com');
    await expect(page.getByText('Ingresa un correo válido.')).not.toBeVisible();
  });

  test('should validate password requirements', async ({ page }) => {
    // First search for a valid DNI
    const dniInput = page.locator('input[type="text"]').first();
    await dniInput.fill('12345678');
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    await searchButton.click();
    await expect(page.getByDisplayValue('Juan Carlos')).toBeVisible({ timeout: 5000 });
    
    const passwordInput = page.locator('input[type="password"]').first();
    
    await passwordInput.fill('12345');
    await expect(page.getByText('Clave mínima de 6 caracteres.')).toBeVisible();
    
    await passwordInput.fill('123456');
    await expect(page.getByText('Clave mínima de 6 caracteres.')).not.toBeVisible();
  });

  test('should validate password confirmation', async ({ page }) => {
    // First search for a valid DNI
    const dniInput = page.locator('input[type="text"]').first();
    await dniInput.fill('12345678');
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    await searchButton.click();
    await expect(page.getByDisplayValue('Juan Carlos')).toBeVisible({ timeout: 5000 });
    
    const passwordInput = page.locator('input[type="password"]').first();
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    
    await passwordInput.fill('password123');
    await confirmPasswordInput.fill('password456');
    
    await expect(page.getByText('Las claves no coinciden.')).toBeVisible();
    
    await confirmPasswordInput.fill('password123');
    await expect(page.getByText('Las claves no coinciden.')).not.toBeVisible();
  });

  test('should complete full registration flow', async ({ page }) => {
    // Step 1: Fill DNI and search
    const dniInput = page.locator('input[type="text"]').first();
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    
    await dniInput.fill('12345678');
    await searchButton.click();
    
    // Wait for form to be populated
    await expect(page.getByDisplayValue('Juan Carlos')).toBeVisible({ timeout: 5000 });
    
    // Step 2: Fill remaining fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    
    await emailInput.fill('juan@example.com');
    await passwordInput.fill('password123');
    await confirmPasswordInput.fill('password123');
    
    // Step 3: Submit form
    const submitButton = page.getByRole('button', { name: /solicitar/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    
    // Step 4: Verify success message
    await expect(page.getByText(/correo de verificación enviado/i)).toBeVisible();
    
    // Step 5: Verify form is reset
    await expect(dniInput).toHaveValue('');
    await expect(emailInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });

  test('should disable submit button when form is invalid', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /solicitar/i });
    
    // Initially disabled
    await expect(submitButton).toBeDisabled();
    
    // Still disabled with partial data
    const dniInput = page.locator('input[type="text"]').first();
    await dniInput.fill('12345678');
    await expect(submitButton).toBeDisabled();
    
    // Still disabled with invalid email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('invalid-email');
    await expect(submitButton).toBeDisabled();
  });

  test('should handle loading states correctly', async ({ page }) => {
    const dniInput = page.locator('input[type="text"]').first();
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    
    await dniInput.fill('12345678');
    
    // Click search and verify loading state
    await searchButton.click();
    await expect(page.getByText(/buscando/i)).toBeVisible();
    
    // Wait for loading to complete
    await expect(page.getByText(/buscando/i)).not.toBeVisible();
    await expect(page.getByDisplayValue('Juan Carlos')).toBeVisible();
  });

  test('should close error popups', async ({ page }) => {
    const dniInput = page.locator('input[type="text"]').first();
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    
    // Trigger error popup
    await dniInput.fill('99999999');
    await searchButton.click();
    
    await expect(page.getByText(/usuario no encontrado/i)).toBeVisible();
    
    // Close popup
    const closeButton = page.getByRole('button', { name: /cerrar/i }).first();
    await closeButton.click();
    
    await expect(page.getByText(/usuario no encontrado/i)).not.toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.getByText('Registro de Usuario')).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    
    // Form should still be functional on mobile
    const dniInput = page.locator('input[type="text"]').first();
    await dniInput.fill('12345678');
    
    const searchButton = page.locator('button').filter({ has: page.locator('svg') });
    await expect(searchButton).toBeEnabled();
  });
});