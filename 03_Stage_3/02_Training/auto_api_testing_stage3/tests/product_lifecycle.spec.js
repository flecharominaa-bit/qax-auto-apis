// tests/product_lifecycle.spec.js

const { test, expect } = require('@playwright/test');
const { ProductService } = require('../src/services/ProductService');
const { ProductRequest } = require('../src/models/ProductRequest');

test.describe('Product Lifecycle E2E @regression', () => {

  test('ciclo de vida completo de un producto @regression', async ({ request }) => {
    const productService = new ProductService(request);

    const initialProduct = new ProductRequest('Lenovo ThinkPad X1 Carbon', {
      year: 2024,
      price: 1299.99,
      'CPU model': 'Intel Core i7',
    });
    const replacementProduct = new ProductRequest('ASUS ROG Zephyrus G14', {
      year: 2025,
      price: 1599.99,
      'CPU model': 'AMD Ryzen 9',
      'Hard disk size': '2 TB',
    });
    const patchedPrice = 1399.99;

    let productId;
    let productBeforePatch;

    await test.step('POST - Crear el producto inicial', async () => {
      const { status, body } = await productService.createProduct(initialProduct);

      expect(status).toBe(200);
      expect(body.hasValidId()).toBeTruthy();
      expect(body.name).toBe(initialProduct.name);
      expect(body.hasPriceGreaterThanZero()).toBeTruthy();

      productId = body.id;
    });

    await test.step('GET - Verificar la creación', async () => {
      const { status, body } = await productService.getProduct(productId);

      expect(status).toBe(200);
      expect(body.id).toBe(productId);
      expect(body.name).toBe(initialProduct.name);
      expect(body.data).toEqual(initialProduct.data);
    });

    await test.step('PUT - Reemplazar el producto completo', async () => {
      const { status, body } = await productService.updateProduct(productId, replacementProduct);

      expect(status).toBe(200);
      expect(body.id).toBe(productId);
      expect(body.name).toBe(replacementProduct.name);
      expect(body.name).not.toBe(initialProduct.name);
      expect(body.data).toEqual(replacementProduct.data);
    });

    await test.step('GET - Verificar el reemplazo total', async () => {
      const { status, body } = await productService.getProduct(productId);

      expect(status).toBe(200);
      expect(body.id).toBe(productId);
      expect(body.name).toBe(replacementProduct.name);
      expect(body.data).toEqual(replacementProduct.data);

      // Snapshot del estado antes del PATCH, para comparar al final
      productBeforePatch = body;
    });

    await test.step('PATCH - Actualizar parcialmente el precio', async () => {
      // La API hace merge solo a nivel raíz: si mandamos `data` con un único campo,
      // reemplaza todo `data`. Por eso se envía el `data` del snapshot con solo
      // el precio modificado, y no se envía `name`.
      const { status, body } = await productService.patchProduct(productId, {
        data: { ...productBeforePatch.data, price: patchedPrice },
      });

      expect(status).toBe(200);
      expect(body.id).toBe(productId);
      expect(body.getPrice()).toBe(patchedPrice);
      expect(body.name).toBe(productBeforePatch.name);
    });

    await test.step('GET - Verificar que solo el precio cambió', async () => {
      const { status, body } = await productService.getProduct(productId);

      expect(status).toBe(200);
      expect(body.id).toBe(productBeforePatch.id);
      expect(body.name).toBe(productBeforePatch.name);
      expect(body.getPrice()).toBe(patchedPrice);
      expect(body.getPrice()).not.toBe(productBeforePatch.getPrice());
      expect(body.data).toEqual({ ...productBeforePatch.data, price: patchedPrice });
    });
  });

  // Hallazgo: la API no valida el body del PUT. Un PUT sin `name`
  // (new ProductRequest() se envía como `{ "data": {} }`) responde 200 en vez de 400.
  // Habilitar cuando la API valide los campos obligatorios.
  test.fixme('debe retornar error al hacer PUT con body vacío @regression', async ({ request }) => {
    const productService = new ProductService(request);
    let productId;

    await test.step('POST - Crear un producto para reemplazar', async () => {
      const { status, body } = await productService.createProduct(
        new ProductRequest('Dell XPS 13', { price: 100 }),
      );

      expect(status).toBe(200);
      expect(body.hasValidId()).toBeTruthy();

      productId = body.id;
    });

    await test.step('PUT - Enviar body vacío', async () => {
      const { status } = await productService.updateProduct(productId, new ProductRequest());

      expect(status).toBe(400);
    });
  });

  // La API pública /objects no requiere autenticación: cualquier request sin
  // credenciales es aceptado, así que no hay forma de obtener un 401/403.
  // Habilitar cuando se pruebe contra un ambiente con autenticación real.
  test.skip('debe retornar 401 al crear un producto sin credenciales @regression', async () => {});

});
