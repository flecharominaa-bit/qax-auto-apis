# Challenge 01: Extendiendo el Service Layer con PUT y PATCH

En este reto vas a extender la arquitectura que construiste en el Exercise 01
agregando soporte para los métodos `PUT` y `PATCH` al `ProductService`.
El objetivo es completar el flujo CRUD del producto y entender en la práctica
la diferencia entre un reemplazo total y una actualización parcial.

---

## 🎯 Enfoque

- Agregar los métodos `updateProduct` (PUT) y `patchProduct` (PATCH) al `ProductService`.
- Crear un flujo E2E: `POST` → `GET` → `PUT` → `GET` de verificación.
- Usar las anotaciones aprendidas para documentar el flujo.
- Validar que `PUT` reemplaza todo el objeto y `PATCH` solo modifica los campos enviados.

---

## 🛒 Historia de Usuario

**Como** gestor de inventario,  
**Quiero** crear un producto, consultarlo y reemplazarlo totalmente con PUT  
**Para** mantener los datos del inventario actualizados de forma confiable

- **Base URL:** `https://api.restful-api.dev`
- **Endpoints:** `POST /objects`, `GET /objects/{id}`, `PUT /objects/{id}`, `PATCH /objects/{id}`

---

## 📋 Criterios de Aceptación

1. `POST /objects` crea un producto y retorna `200` con un `id` generado.
2. `GET /objects/{id}` retorna `200` y el producto refleja los datos del POST.
3. `PUT /objects/{id}` retorna `200` y el response refleja **exactamente** el payload enviado.
4. `GET` de verificación tras el PUT confirma que el objeto fue reemplazado completamente.
5. `PATCH /objects/{id}` retorna `200` y solo el campo enviado cambia en el response.

---

## 🔧 Instrucciones

### Paso 1 — Extender el `ProductService`

> 💡 Nota la diferencia: `updateProduct` recibe un `ProductRequest` completo y llama a `toJSON()`.
> `patchProduct` recibe solo los campos que quieres cambiar, sin necesidad de modelar todo el objeto.

---

### Paso 2 — Crear el archivo de tests

Crea un nuevo archivo `tests/products_crud.spec.js` e implementa los siguientes escenarios:

#### Escenario 1 — Flujo POST → GET → PUT → GET

```javascript
test('flujo completo: crear y reemplazar un producto con PUT @regression', async ({ request }) => {
  const productService = new ProductService(request);
  let productId;

  await test.step('POST: Crear el producto inicial', async () => {
    // Crea un producto con nombre "Apple MacBook Pro 16" y data con year, price y CPU model
    // Guarda el id generado en productId
    // Valida status 200 e id válido
  });

  await test.step('GET: Verificar que el producto fue creado correctamente', async () => {
    // Consulta el producto por productId
    // Valida status 200 y que el nombre coincide con el enviado en el POST
  });

  await test.step('PUT: Reemplazar el producto completo por uno nuevo', async () => {
    // Crea un nuevo ProductRequest con nombre "HP Pavilion" y data diferente
    // Llama a updateProduct con productId y el nuevo request
    // Valida status 200 y que el nombre en el response es "HP Pavilion"
  });

  await test.step('GET: Confirmar que el producto refleja el reemplazo total', async () => {
    // Consulta el producto por productId
    // Valida que el nombre ahora es "HP Pavilion"
    // Valida que los datos de data corresponden al PUT, no al POST original
  });
});
```

#### Escenario 2 — PATCH cambia solo el campo enviado

```javascript
test('debe actualizar solo el nombre con PATCH sin afectar otros campos @regression', async ({ request }) => {
  const productService = new ProductService(request);
  let productId;
  let originalPrice;

  await test.step('POST: Crear un producto con precio conocido', async () => {
    // Crea un producto con name "Dell XPS 15" y data con price: 1500
    // Guarda productId y guarda el price original en originalPrice
  });

  await test.step('PATCH: Actualizar solo el nombre', async () => {
    // Llama a patchProduct enviando solo { name: "Dell XPS 15 Updated" }
    // Valida status 200
    // Valida que el nombre en el response cambió
  });

  await test.step('GET: Verificar que el precio no fue afectado', async () => {
    // Consulta el producto por productId
    // Valida que el nombre es "Dell XPS 15 Updated"
    // Valida que el precio sigue siendo originalPrice
  });
});
```

---

### Paso 3 — Ejecutar y verificar

```bash
# Correr solo los tests de este archivo
npx playwright test src/tests/products.spec.js

# Correr con reporte visible
npx playwright test --reporter=list
```
---

### Entrega
- Sube tu código a tu repositorio personal de GitHub.
- Menciona a tu mentor en un Pull Request para que pueda revisar tu código y darte


---

### 👈 Volver al [Training](./README.md)
