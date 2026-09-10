import { test, expect } from '@playwright/test';
import { AuthService } from '../src/services/AuthService';
import { buildLoginData, buildInvalidLoginData } from '../src/helpers/dataBuilder';

test.describe('Autenticación de Usuarios', () => {
  test('Login exitoso con credenciales correctas @smoke', async ({ request }) => {
    test.skip(
      !process.env.API_KEY || !process.env.API_EMAIL || !process.env.API_PASSWORD, 
      'Debes ingresar valores reales en el .env (API_KEY, API_EMAIL, API_PASSWORD) para que este test funcione'
    );
    
    // ─── ARRANGE ──────────────────────────────────────────────────────────
    const authService = new AuthService(request);
    const loginData = buildLoginData();

    // ─── ACT ──────────────────────────────────────────────────────────────
    const { status, body } = await authService.login(loginData);

    // ─── ASSERT ───────────────────────────────────────────────────────────
    expect(status).toBe(200);
    expect(body.token).toBeDefined();
    expect(body.token.length).toBeGreaterThan(0);
    expect(body.tokenType).toBe('Bearer');
    expect(body.expiresIn).toBeGreaterThan(0);
    
    // Validar datos del usuario
    expect(body.user.id).toBeDefined();
    expect(body.user.email).toBe(loginData.email);
    expect(body.user.name).toBeDefined();
  });

  test('Login fallido con credenciales inválidas @regression', async ({ request }) => {
    // ─── ARRANGE ──────────────────────────────────────────────────────────
    const authService = new AuthService(request);
    const invalidData = buildInvalidLoginData();

    // ─── ACT ──────────────────────────────────────────────────────────────
    const { status, body } = await authService.login(invalidData);

    // ─── ASSERT ───────────────────────────────────────────────────────────
    expect([400, 401, 403, 404]).toContain(status);
    expect(body.token).toBeFalsy();
  });
});
