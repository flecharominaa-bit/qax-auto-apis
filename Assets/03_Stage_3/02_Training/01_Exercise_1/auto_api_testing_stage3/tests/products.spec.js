
const { test, expect } = require('@playwright/test');
const { ProductService } = require('../src/services/ProductService');
const { ProductRequest } = require('../src/models/ProductRequest');

test.describe('Products API — GET y POST', () => {

  test('debe obtener un producto existente por ID @smoke', async ({ request }) => {
    const productService = new ProductService(request);

    await test.step('Llamar GET /objects/{id} con un ID válido', async () => {
      const { status, body } = await productService.getProduct('1');

      await test.step('Validar status 200', async () => {
        expect(status).toBe(200);
      });

      await test.step('Validar que el producto tiene ID y nombre', async () => {
        expect(body.hasValidId()).toBeTruthy();
        expect(body.hasName()).toBeTruthy();
      });

      await test.step('Validar que el ID coincide con el solicitado', async () => {
        expect(body.id).toBe('1');
      });
    });
  });

  test('debe crear un nuevo producto correctamente @smoke', async ({ request }) => {
    const productService = new ProductService(request);

    const newProduct = new ProductRequest('HP Laptop Pro', {
      year: 2024,
      price: 1849.99,
      'CPU model': 'Intel Core i9',
      'Hard disk size': '1 TB',
    });

    await test.step('Llamar POST /objects con un producto válido', async () => {
      const { status, body } = await productService.createProduct(newProduct);

      await test.step('Validar status 200', async () => {
        expect(status).toBe(200);
      });

      await test.step('Validar que la respuesta tiene un ID generado', async () => {
        expect(body.hasValidId()).toBeTruthy();
      });

      await test.step('Validar que el nombre coincide con el enviado', async () => {
        expect(body.name).toBe('HP Laptop Pro');
      });

      await test.step('Validar que el precio fue guardado correctamente', async () => {
        expect(body.hasPriceGreaterThanZero()).toBeTruthy();
        expect(body.getPrice()).toBe(1849.99);
      });
    });
  });

  test('debe fallar al buscar un producto con ID inexistente @regression', async ({ request }) => {
    const productService = new ProductService(request);

    await test.step('Llamar GET /objects con un ID que no existe', async () => {
      const { status } = await productService.getProduct('id-que-no-existe-999');

      await test.step('Validar que el status es 404', async () => {
        expect(status).toBe(404);
      });
    });
  });

});