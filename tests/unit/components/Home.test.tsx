/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../../src/app/page';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.parent for iframe communication
Object.defineProperty(window, 'parent', {
  value: {
    postMessage: jest.fn()
  },
  writable: true
});

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the registration form', () => {
    render(<Home />);
    
    expect(screen.getByText('DNI')).toBeInTheDocument();
    expect(screen.getByText('Nombres')).toBeInTheDocument();
    expect(screen.getByText('Apellidos')).toBeInTheDocument();
    expect(screen.getByText('Correo')).toBeInTheDocument();
    expect(screen.getByText('Clave')).toBeInTheDocument();
    expect(screen.getByText('Confirmar clave')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /solicitar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reiniciar formulario/i })).toBeInTheDocument();
  });

  it('should validate DNI input', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    const inputs = screen.getAllByDisplayValue('');
    const dniInput = inputs[0]; // First input is DNI
    await user.type(dniInput, '123');
    
    // DNI should be at least 8 characters
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons.find(btn => btn.querySelector('svg')); // Button with search icon
    expect(searchButton).toBeDisabled();
  });

  it('should search for DNI when valid DNI is entered', async () => {
    const user = userEvent.setup();
    
    // Mock successful DNI response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        data: { 
          ESTADO: 'ACTIVO', 
          NOMBRE: 'García Pérez Juan Carlos',
          mail: ''
        }
      })
    });

    render(<Home />);
    
    const inputs = screen.getAllByDisplayValue('');
    const dniInput = inputs[0]; // First input is DNI
    await user.type(dniInput, '12345678');
    
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons.find(btn => btn.querySelector('svg')); // Button with search icon
    await user.click(searchButton!);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/check-dni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: '12345678' })
      });
    });
  });

  it('should populate names after successful DNI search', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        data: { 
          ESTADO: 'ACTIVO', 
          NOMBRE: 'García Pérez Juan Carlos',
          mail: ''
        }
      })
    });

    render(<Home />);
    
    const inputs = screen.getAllByDisplayValue('');
    const dniInput = inputs[0]; // First input is DNI
    await user.type(dniInput, '12345678');
    
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons.find(btn => btn.querySelector('svg')); // Button with search icon
    await user.click(searchButton!);
    
    await waitFor(() => {
      const nombresInput = screen.getByDisplayValue('Juan Carlos');
      const apellidosInput = screen.getByDisplayValue('García Pérez');
      expect(nombresInput).toBeInTheDocument();
      expect(apellidosInput).toBeInTheDocument();
    });
  });

  it('should show error for invalid DNI', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        data: { ESTADO: 'INACTIVO' }
      })
    });

    render(<Home />);
    
    const inputs = screen.getAllByDisplayValue('');
    const dniInput = inputs[0]; // First input is DNI
    await user.type(dniInput, '12345678');
    
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons.find(btn => btn.querySelector('svg')); // Button with search icon
    await user.click(searchButton!);
    
    await waitFor(() => {
      expect(screen.getByText('DNI no válido o trabajador no activo')).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    
    // First mock DNI search
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        data: { 
          ESTADO: 'ACTIVO', 
          NOMBRE: 'García Pérez Juan Carlos',
          mail: ''
        }
      })
    });

    render(<Home />);
    
    // First search DNI
    const inputs = screen.getAllByDisplayValue('');
    const dniInput = inputs[0]; // First input is DNI
    await user.type(dniInput, '12345678');
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons.find(btn => btn.querySelector('svg')); // Button with search icon
    await user.click(searchButton!);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan Carlos')).toBeInTheDocument();
    });

    // Now test email validation
    const emailInput = screen.getAllByDisplayValue('').find(input => 
      (input as HTMLInputElement).type === 'email'
    ) as HTMLInputElement;
    await user.type(emailInput, 'invalid-email');
    
    await waitFor(() => {
      expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument();
    });
  });

  it('should validate password requirements', async () => {
    const user = userEvent.setup();
    
    // First mock DNI search
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        data: { 
          ESTADO: 'ACTIVO', 
          NOMBRE: 'García Pérez Juan Carlos',
          mail: ''
        }
      })
    });

    render(<Home />);
    
    // First search DNI
    const inputs = screen.getAllByDisplayValue('');
    const dniInput = inputs[0]; // First input is DNI
    await user.type(dniInput, '12345678');
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons.find(btn => btn.querySelector('svg')); // Button with search icon
    await user.click(searchButton!);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan Carlos')).toBeInTheDocument();
    });

    // Test password validation
    const passwordInputs = screen.getAllByDisplayValue('').filter(input => 
      (input as HTMLInputElement).type === 'password'
    );
    const passwordInput = passwordInputs[0] as HTMLInputElement;
    
    await user.type(passwordInput, 'weak');
    
    await waitFor(() => {
      expect(screen.getByText('Clave mínima de 6 caracteres.')).toBeInTheDocument();
    });
  });

  it('should submit form when all validations pass', async () => {
    const user = userEvent.setup();
    
    // Mock DNI search
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          data: { 
            ESTADO: 'ACTIVO', 
            NOMBRE: 'García Pérez Juan Carlos',
            mail: ''
          }
        })
      })
      // Mock email send
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

    render(<Home />);
    
    // Search DNI
    const inputs = screen.getAllByDisplayValue('');
    const dniInput = inputs[0]; // First input is DNI
    await user.type(dniInput, '12345678');
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons.find(btn => btn.querySelector('svg')); // Button with search icon
    await user.click(searchButton!);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Juan Carlos')).toBeInTheDocument();
    });

    // Fill form
    const emailInput = screen.getAllByDisplayValue('').find(input => 
      (input as HTMLInputElement).type === 'email'
    ) as HTMLInputElement;
    await user.type(emailInput, 'test@example.com');
    
    const passwordInputs = screen.getAllByDisplayValue('').filter(input => 
      (input as HTMLInputElement).type === 'password'
    );
    await user.type(passwordInputs[0], 'Password123!');
    await user.type(passwordInputs[1], 'Password123!');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /solicitar/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Correo de verificación enviado.')).toBeInTheDocument();
    });
  });

  it('should reset form when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    const inputs = screen.getAllByDisplayValue('');
    const dniInput = inputs[0]; // First input is DNI
    await user.type(dniInput, '12345678');
    
    const resetButton = screen.getByRole('button', { name: /reiniciar formulario/i });
    await user.click(resetButton);
    
    expect((dniInput as HTMLInputElement).value).toBe('');
  });
});