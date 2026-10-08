// tests/catalog.spec.js

const { test, expect } = require('@playwright/test');
const { ProductService } = require('../src/services/ProductService');
const { ProductRequest } = require('../src/models/ProductRequest');

test.describe('Catalog API', () => {

  test.describe('GET /objects/{id}', () => {

    test('debe retornar un producto por ID válido @smoke', async ({ request }) => {
      const productService = new ProductService(request);
      let status, body;

      await test.step('Enviar GET /objects/1', async () => {
        ({ status, body } = await productService.getProduct('1'));
      });

      await test.step('Validar status code y body del response', async () => {
        expect(status).toBe(200);
        expect(body.hasValidId()).toBeTruthy();
        expect(body.hasName()).toBeTruthy();
        expect(body.id).toBe('1');
      });
    });

    test('debe retornar 404 para un ID inexistente @regression', async ({ request }) => {
      const productService = new ProductService(request);
      const { status } = await productService.getProduct('id-inexistente-99999');

      expect(status).toBe(404);
    });

    // El endpoint de búsqueda por nombre (GET /objects?name=...) todavía no existe en esta API:
    // el feature está en desarrollo, por eso el test no aplica aún.
    test.skip('debe filtrar productos por nombre @regression', async ({ request }) => {
      // implementación pendiente hasta que el endpoint esté disponible
    });

  });

  test.describe('POST /objects', () => {

    test('debe crear y consultar un producto @smoke', async ({ request }) => {
      const productService = new ProductService(request);
      let newProduct, status, body;

      await test.step('Preparar el producto a crear', async () => {
        newProduct = new ProductRequest('QAX Notebook Ultra', {
          year: 2025,
          price: 1999.5,
          'CPU model': 'AMD Ryzen 9',
          'Hard disk size': '2 TB',
        });
      });

      await test.step('Enviar POST /objects', async () => {
        ({ status, body } = await productService.createProduct(newProduct));
      });

      await test.step('Validar status code y body del response', async () => {
        expect(status).toBe(200);
        expect(body.hasValidId()).toBeTruthy();
        expect(body.name).toBe('QAX Notebook Ultra');
        expect(body.getPrice()).toBe(1999.5);
      });

      await test.step('Consultar el producto creado con GET /objects/{id}', async () => {
        const created = await productService.getProduct(body.id);
        expect(created.status).toBe(200);
        expect(created.body.id).toBe(body.id);
        expect(created.body.name).toBe('QAX Notebook Ultra');
      });
    });

    test('debe crear un producto solo con nombre @regression', async ({ request }) => {
      const productService = new ProductService(request);
      const { status, body } = await productService.createProduct(new ProductRequest('Producto Básico'));

      expect(status).toBe(200);
      expect(body.hasValidId()).toBeTruthy();
      expect(body.name).toBe('Producto Básico');
    });

    // Bug conocido QAX-201: la API acepta productos con precio negativo y responde 200
    // en lugar de 400. Se marca fixme hasta que el bug se corrija en el backend.
    test.fixme('debe rechazar un producto con precio negativo @regression', async ({ request }) => {
      const productService = new ProductService(request);
      const invalidProduct = new ProductRequest('Producto Inválido', { price: -100 });

      const { status } = await productService.createProduct(invalidProduct);

      expect(status).toBe(400);
    });

  });

});
