const { test, expect } = require('@playwright/test');
const { AuthService } = require('../src/services/AuthService');
const { ProductService } = require('../src/services/ProductService');

// Entrega PARCIAL de la Mission #2 (E2E API Testing - Platzi Fake Store).
// Cubre por ahora: módulo Auth (login + profile) y módulo Products.
// Pendiente para la entrega final: Users, Categories, Files.

test.describe('Mission 2 - Auth', () => {
  // Credencial de prueba pública publicada en la documentación de la API.
  const TEST_USER = { email: 'john@mail.com', password: 'changeme' };

  test('login devuelve un access_token válido', async ({ request }) => {
    const auth = new AuthService(request);
    const { status, body } = await auth.login(TEST_USER.email, TEST_USER.password);

    expect(status).toBe(201);
    expect(body).toHaveProperty('access_token');
    expect(typeof body.access_token).toBe('string');
  });

  test('login con credenciales inválidas es rechazado', async ({ request }) => {
    const auth = new AuthService(request);
    const { status } = await auth.login('usuario_invalido@mail.com', 'password-incorrecta');

    expect(status).toBe(401);
  });

  test('el perfil autenticado corresponde al usuario logueado', async ({ request }) => {
    const auth = new AuthService(request);
    const { body: loginBody } = await auth.login(TEST_USER.email, TEST_USER.password);

    const { status, body: profile } = await auth.getProfile(loginBody.access_token);

    expect(status).toBe(200);
    expect(profile.email).toBe(TEST_USER.email);
  });
});

test.describe('Mission 2 - Products', () => {
  test('lista de productos responde 200 y devuelve un array', async ({ request }) => {
    const products = new ProductService(request);
    const { status, body } = await products.getProducts({ limit: 5 });

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('cada producto trae los campos esperados', async ({ request }) => {
    const products = new ProductService(request);
    const { body } = await products.getProducts({ limit: 1 });
    const [producto] = body;

    for (const campo of ['id', 'title', 'price', 'description', 'category', 'images']) {
      expect(producto).toHaveProperty(campo);
    }
  });

  test('obtener un producto por id devuelve ese mismo id', async ({ request }) => {
    const products = new ProductService(request);
    const { body: lista } = await products.getProducts({ limit: 1 });
    const idBuscado = lista[0].id;

    const { status, body: producto } = await products.getProductById(idBuscado);

    expect(status).toBe(200);
    expect(producto.id).toBe(idBuscado);
  });
});
