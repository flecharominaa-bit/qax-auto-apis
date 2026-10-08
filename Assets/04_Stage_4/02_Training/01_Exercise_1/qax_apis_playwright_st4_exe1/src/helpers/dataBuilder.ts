import { LoginCredentials } from '../types/api.types';

/**
 * Genera datos de login válidos para la prueba.
 */
export function buildLoginData(): LoginCredentials {
  return {
    email: process.env.API_EMAIL || '',
    password: process.env.API_PASSWORD || '',
  };
}

/**
 * Genera datos de login inválidos para probar el rechazo.
 */
export function buildInvalidLoginData(): LoginCredentials {
  return {
    email: 'invalido@test.com',
    password: 'wrongPassword',
  };
}
