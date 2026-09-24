// tests/users.spec.js

const { test, expect } = require('@playwright/test');
const { UserService } = require('../src/services/UserService');

test.describe('HU1 — Users API: GET /users/{username}', () => {

  test('debe obtener un usuario existente con estructura válida @smoke', async ({ request }) => {
    const userService = new UserService(request);
    const username = process.env.GITHUB_USERNAME;

    await test.step('Llamar GET /users/{username} con un usuario existente', async () => {
      const { status, body } = await userService.getUser(username);

      await test.step('Validar status 200', async () => {
        expect(status).toBe(200);
      });

      await test.step('Validar que login no está vacío y coincide con el solicitado', async () => {
        expect(body.hasValidLogin()).toBeTruthy();
        expect(body.login.toLowerCase()).toBe(username.toLowerCase());
      });

      await test.step('Validar que id es un número mayor a 0', async () => {
        expect(body.hasValidId()).toBeTruthy();
      });

      await test.step('Validar que avatar_url empieza con https://', async () => {
        expect(body.hasValidAvatarUrl()).toBeTruthy();
      });

      await test.step('Validar que repos_url es una URL válida', async () => {
        expect(body.hasValidReposUrl()).toBeTruthy();
      });

      await test.step('Validar que type está presente', async () => {
        expect(body.hasType()).toBeTruthy();
      });
    });
  });

  test('debe devolver 404 al consultar un usuario inexistente @regression', async ({ request }) => {
    const userService = new UserService(request);

    await test.step('Llamar GET /users/{username} con un usuario que no existe', async () => {
      const { status, body } = await userService.getUser('usuario-que-no-existe-qax-999999');

      await test.step('Validar status 404', async () => {
        expect(status).toBe(404);
      });

      await test.step('Validar mensaje "Not Found"', async () => {
        expect(body.message).toBe('Not Found');
      });
    });
  });

});
