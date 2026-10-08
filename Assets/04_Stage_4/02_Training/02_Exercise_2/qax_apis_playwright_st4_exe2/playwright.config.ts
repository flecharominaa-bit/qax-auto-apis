import { defineConfig } from '@playwright/test';

/**
 * Configuración minimalista para pruebas de API.
 * Ideal para principiantes: menos código, más claridad.
 */
export default defineConfig({
  // Directorio donde están los tests
  testDir: './tests',

  // Formato del reporte (HTML es el más amigable para humanos)
  reporter: 'html',

  // Configuración global para las peticiones
  use: {
    // URL base por defecto (puede ser sobrescrita en los servicios)
    baseURL: 'https://fakerestapi.azurewebsites.net',
    
    // Captura detalles si algo falla en el primer reintento
    trace: 'on-first-retry',
  },
});
