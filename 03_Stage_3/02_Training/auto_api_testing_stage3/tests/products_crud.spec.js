// tests/products_crud.spec.js

const { test, expect } = require('@playwright/test');
const { ProductService } = require('../src/services/ProductService');
const { ProductRequest } = require('../src/models/ProductRequest');

test.describe('Products API — PUT y PATCH', () => {

  test('flujo completo: crear y reemplazar un producto con PUT @regression', async ({ request }) => {
    const productService = new ProductService(request);
    let productId;

    await test.step('POST: Crear el producto inicial', async () => {
      const initialProduct = new ProductRequest('Apple MacBook Pro 16', {
        year: 2023,
        price: 2499.99,
        'CPU model': 'Apple M2 Pro',
      });

      const { status, body } = await productService.createProduct(initialProduct);

      expect(status).toBe(200);
      expect(body.hasValidId()).toBeTruthy();

      productId = body.id;
    });

    await test.step('GET: Verificar que el producto fue creado correctamente', async () => {
      const { status, body } = await productService.getProduct(productId);

      expect(status).toBe(200);
      expect(body.name).toBe('Apple MacBook Pro 16');
    });

    await test.step('PUT: Reemplazar el producto completo por uno nuevo', async () => {
      const replacementProduct = new ProductRequest('HP Pavilion', {
        year: 2022,
        price: 899.99,
        'CPU model': 'Intel Core i5',
      });

      const { status, body } = await productService.updateProduct(productId, replacementProduct);

      expect(status).toBe(200);
      expect(body.name).toBe('HP Pavilion');
    });

    await test.step('GET: Confirmar que el producto refleja el reemplazo total', async () => {
      const { status, body } = await productService.getProduct(productId);

      expect(status).toBe(200);
      expect(body.name).toBe('HP Pavilion');
      expect(body.data).toEqual({
        year: 2022,
        price: 899.99,
        'CPU model': 'Intel Core i5',
      });
    });
  });

  test('debe actualizar solo el nombre con PATCH sin afectar otros campos @regression', async ({ request }) => {
    const productService = new ProductService(request);
    let productId;
    let originalPrice;

    await test.step('POST: Crear un producto con precio conocido', async () => {
      const newProduct = new ProductRequest('Dell XPS 15', {
        price: 1500,
      });

      const { status, body } = await productService.createProduct(newProduct);

      expect(status).toBe(200);
      expect(body.hasValidId()).toBeTruthy();

      productId = body.id;
      originalPrice = body.getPrice();
    });

    await test.step('PATCH: Actualizar solo el nombre', async () => {
      const { status, body } = await productService.patchProduct(productId, {
        name: 'Dell XPS 15 Updated',
      });

      expect(status).toBe(200);
      expect(body.name).toBe('Dell XPS 15 Updated');
    });

    await test.step('GET: Verificar que el precio no fue afectado', async () => {
      const { status, body } = await productService.getProduct(productId);

      expect(status).toBe(200);
      expect(body.name).toBe('Dell XPS 15 Updated');
      expect(body.getPrice()).toBe(originalPrice);
    });
  });

});
