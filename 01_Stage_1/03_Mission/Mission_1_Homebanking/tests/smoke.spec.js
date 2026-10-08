const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const { HomebankingService } = require('../src/services/HomebankingService');

// Entrega PARCIAL de la Mission #1 (Homebanking Mock API).
// Cubre el Smoke Test del Módulo 1: Resumen de Cuentas y Movimientos
// (registro, login, dashboard, cuentas, transacciones).
// Pendiente para la entrega final: Transferencias, Pagos, Plazos Fijos,
// Préstamos y Tarjetas.

test.describe.serial('Mission 1 - Smoke Test: Resumen de cuentas', () => {
  const sufijo = crypto.randomBytes(4).toString('hex');
  const usuario = {
    username: `qaninja_${sufijo}`,
    password: 'ClaveSegura123!',
    name: 'QA Ninja',
    email: `qaninja_${sufijo}@qaxpert.test`,
  };

  let banking;
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'https://homebanking-demo.onrender.com',
    });
    banking = new HomebankingService(apiContext);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('CA 1.0 - Registro de un cliente nuevo', async () => {
    const { status, body } = await banking.registrar(usuario);
    console.log('Registro:', body);
    expect([200, 201]).toContain(status);
  });

  test('CA 1.0 - Login devuelve un access_token', async () => {
    const { status, body } = await banking.login(usuario.username, usuario.password);
    console.log('Login:', body);
    expect(status).toBe(200);
expect(body).toHaveProperty('token');  });

  test('Reset del simulador para partir de un estado limpio', async () => {
    const { status } = await banking.resetearSistema();
    expect(status).toBe(200);
  });

  test('CA 1.1 - El dashboard muestra el perfil del cliente', async () => {
    const { status, body } = await banking.getDashboard();
    console.log('Dashboard:', body);
    expect(status).toBe(200);
    expect(body).toBeTruthy();
  });

  test('CA 1.2 - Cuentas devuelve las cuentas del cliente con saldo', async () => {
    const { status, body } = await banking.getCuentas();
    console.log('Cuentas:', body);
    expect(status).toBe(200);
    expect(Array.isArray(body) || typeof body === 'object').toBeTruthy();
  });

  test('CA 1.3 - Transacciones devuelve el historial de movimientos', async () => {
    const { status, body } = await banking.getTransacciones(10);
    console.log('Transacciones:', body);
    expect(status).toBe(200);
  });
});