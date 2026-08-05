import { test, expect } from '@playwright/test';
import { ProductService } from '../src/services/ProductService';
import { ProductBody } from '../src/types/api.types';

test.describe('Gestión de Productos', () => {
  test('Obtener producto existente por ID @smoke', async ({ request }) => {
    // ─── ARRANGE ──────────────────────────────────────────────────────────
    const productService = new ProductService(request);
    const productId = '1';

    // ─── ACT ──────────────────────────────────────────────────────────────
    const { status, body } = await productService.getProduct(productId);

    // ─── ASSERT ───────────────────────────────────────────────────────────
    expect(status).toBe(200);
    expect(String(body.id)).toBe(productId);
    expect(typeof body.name).toBe('string');
  });

  test('Crear un nuevo producto @smoke', async ({ request }) => {
    // ─── ARRANGE ──────────────────────────────────────────────────────────
    const productService = new ProductService(request);
    const newProduct: ProductBody = {
      name: 'HP Laptop Pro',
      data: {
        year: 2024,
        price: 1849.99,
        'CPU model': 'Intel Core i9',
        'Hard disk size': '1 TB',
      }
    };

    // ─── ACT ──────────────────────────────────────────────────────────────
    const { status, body } = await productService.createProduct(newProduct);

    // ─── ASSERT ───────────────────────────────────────────────────────────
    expect(status).toBe(200);
    expect(body.id).toBeDefined();
    expect(body.name).toBe('HP Laptop Pro');
    expect(body.data?.price).toBe(1849.99);
  });

  test('Retorna 404 para producto inexistente @regression', async ({ request }) => {
    // ─── ARRANGE ──────────────────────────────────────────────────────────
    const productService = new ProductService(request);

    // ─── ACT ──────────────────────────────────────────────────────────────
    const { status } = await productService.getProduct('id-inexistente-999');

    // ─── ASSERT ───────────────────────────────────────────────────────────
    expect(status).toBe(404);
  });
});
