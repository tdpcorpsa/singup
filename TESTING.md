# Documentación de Testing

Este documento describe la estrategia de testing implementada para el proyecto de registro de usuarios.

## Estructura de Testing

El proyecto implementa una estrategia de testing completa que incluye:

- **Pruebas Unitarias**: Validación de funciones y componentes individuales
- **Pruebas de Integración**: Verificación de APIs y flujos de datos
- **Pruebas End-to-End (E2E)**: Validación completa del flujo de usuario

## Tecnologías Utilizadas

### Jest + Testing Library
- **Jest**: Framework de testing principal
- **@testing-library/react**: Utilidades para testing de componentes React
- **@testing-library/jest-dom**: Matchers adicionales para DOM
- **@testing-library/user-event**: Simulación de eventos de usuario

### Playwright
- **@playwright/test**: Framework para pruebas E2E
- Soporte para múltiples navegadores (Chromium, Firefox, WebKit)
- Testing en dispositivos móviles

## Estructura de Directorios

```
tests/
├── unit/
│   ├── validation.test.ts          # Pruebas de utilidades de validación
│   └── components/
│       └── Home.test.tsx            # Pruebas del componente principal
├── integration/
│   └── api.test.ts                  # Pruebas de APIs
└── e2e/
    └── registration-flow.spec.ts    # Pruebas end-to-end

src/
└── utils/
    └── validation.ts                # Utilidades de validación extraídas
```

## Scripts de Testing

### Pruebas Unitarias e Integración

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas en modo watch (desarrollo)
npm run test:watch

# Ejecutar pruebas con reporte de cobertura
npm run test:coverage
```

### Pruebas E2E

```bash
# Ejecutar pruebas E2E
npm run test:e2e

# Ejecutar pruebas E2E con interfaz visual
npm run test:e2e:ui

# Ejecutar pruebas E2E con navegador visible
npm run test:e2e:headed

# Ejecutar todas las pruebas (unitarias + E2E)
npm run test:all
```

## Configuración

### Jest (jest.config.js)
- Configurado para Next.js
- Entorno de testing: jsdom
- Cobertura de código configurada
- Mapeo de rutas con alias `@/`

### Playwright (playwright.config.ts)
- Configurado para múltiples navegadores
- Servidor de desarrollo automático
- Screenshots en fallos
- Trazas en reintentos

### Variables de Entorno (jest.setup.js)
- Mocks de variables de entorno para testing
- Configuración global de fetch mock
- Configuración de window.parent para iframe testing

## Tipos de Pruebas Implementadas

### 1. Pruebas Unitarias

#### Validaciones (`tests/unit/validation.test.ts`)
- ✅ Validación de email
- ✅ Validación de contraseña
- ✅ Validación de coincidencia de contraseñas
- ✅ Validación de DNI
- ✅ Validación de campos requeridos
- ✅ Validación completa del formulario

#### Componente Home (`tests/unit/components/Home.test.tsx`)
- ✅ Renderizado del formulario
- ✅ Validaciones en tiempo real
- ✅ Búsqueda de DNI
- ✅ Manejo de estados de error
- ✅ Envío del formulario
- ✅ Reset del formulario

### 2. Pruebas de Integración

#### APIs (`tests/integration/api.test.ts`)
- ✅ `/api/check-dni` - Verificación de DNI
- ✅ `/api/send-verification-email` - Envío de email
- ✅ `/api/verify-email` - Verificación de email
- ✅ Manejo de errores
- ✅ Validación de JWT tokens

### 3. Pruebas E2E

#### Flujo de Registro (`tests/e2e/registration-flow.spec.ts`)
- ✅ Renderizado completo de la aplicación
- ✅ Validaciones de formulario
- ✅ Búsqueda de DNI con respuestas mockeadas
- ✅ Flujo completo de registro
- ✅ Manejo de estados de carga
- ✅ Responsividad móvil
- ✅ Manejo de popups de error

## Cobertura de Código

Objetivos de cobertura configurados:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Mocking y Datos de Prueba

### APIs Externas
Las pruebas utilizan mocks para evitar dependencias externas:
- API de verificación de DNI
- Servicio de envío de emails
- JWT token generation/verification

### Datos de Prueba
- **DNI válido**: `12345678` (usuario activo sin email)
- **DNI con email existente**: `87654321` (usuario ya registrado)
- **DNI inválido**: `99999999` (usuario inactivo)

## Mejores Prácticas Implementadas

### 1. Principio AAA (Arrange, Act, Assert)
Todas las pruebas siguen la estructura:
```javascript
// Arrange - Configurar datos y mocks
const mockData = { ... };

// Act - Ejecutar la acción
const result = await functionToTest(input);

// Assert - Verificar resultados
expect(result).toBe(expected);
```

### 2. Aislamiento de Pruebas
- Cada prueba es independiente
- Mocks se resetean entre pruebas
- No hay dependencias entre tests

### 3. Nombres Descriptivos
- Descripciones claras de lo que se está probando
- Agrupación lógica con `describe` blocks
- Casos de prueba específicos y enfocados

### 4. Testing de Casos Edge
- Validación de inputs nulos/undefined
- Manejo de errores de red
- Validación de límites (longitudes mínimas/máximas)

### 5. Accesibilidad
- Uso de `getByRole` y `getByLabelText`
- Testing de navegación por teclado
- Verificación de ARIA labels

## Integración Continua

La configuración está preparada para CI/CD:

```yaml
# Ejemplo para GitHub Actions
- name: Run Tests
  run: |
    npm run test:coverage
    npm run test:e2e
```

## Debugging

### Jest
```bash
# Debug con Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug específico test
npm run test -- --testNamePattern="specific test name"
```

### Playwright
```bash
# Debug con interfaz visual
npm run test:e2e:ui

# Debug con navegador visible
npm run test:e2e:headed

# Debug específico test
npx playwright test --debug registration-flow.spec.ts
```

## Mantenimiento

### Actualización de Snapshots
```bash
npm run test -- --updateSnapshot
```

### Regenerar Playwright Tests
```bash
npx playwright codegen localhost:3000
```

## Métricas y Reportes

### Cobertura de Código
Los reportes se generan en `coverage/` después de ejecutar `npm run test:coverage`

### Reportes de Playwright
Los reportes HTML se generan automáticamente en `playwright-report/`

## Próximos Pasos

1. **Performance Testing**: Implementar pruebas de rendimiento
2. **Visual Regression Testing**: Agregar testing de regresión visual
3. **API Contract Testing**: Implementar testing de contratos de API
4. **Security Testing**: Agregar pruebas de seguridad
5. **Load Testing**: Implementar pruebas de carga

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)