# Exercise 02: Variables de entorno y anotaciones profesionales

En este ejercicio vas a elevar la calidad de tu proyecto en dos dimensiones:
primero, harás que el mismo proyecto pueda ejecutarse en **diferentes ambientes**
sin tocar una sola línea de código, usando variables de entorno.
Segundo, aprenderás a usar las **anotaciones de Playwright** para organizar,
categorizar y documentar tus tests como lo haría un equipo profesional de QA.

Al finalizar este ejercicio, el ninja podrá:

- Configurar múltiples ambientes (`dev`, `staging`, `prod`) usando archivos `.env`.
- Leer variables de entorno desde `playwright.config.js` sin hardcodear valores.
- Usar `test.describe` para agrupar tests por contexto.
- Usar `test.step` para documentar el flujo interno de un test.
- Usar `test.skip` y `test.fixme` correctamente y con criterio.
- Aplicar tags (`@smoke`, `@regression`) para filtrar ejecuciones.
- Correr solo un subconjunto de tests usando `--grep`.

---

## 🛒 Historia de Usuario — Validación del catálogo en múltiples ambientes

**Como** QA Engineer en QAXpert,  
**Quiero** ejecutar mis tests de catálogo apuntando a diferentes ambientes  
**Para** validar que el comportamiento de la API es consistente en dev y staging

- **Base URL dev:** `https://api.restful-api.dev`
- **Base URL staging:** `https://api.restful-api.dev` *(simulamos staging con la misma URL pública)*

---

## 🌍 Paso 1 — Configurar múltiples ambientes

### 1.1 Crear archivos `.env` por ambiente

En la raíz del proyecto, crea estos tres archivos:

```bash
# .env.dev
BASE_URL=https://api.restful-api.dev
ENVIRONMENT=dev
API_TIMEOUT=5000
```

```bash
# .env.staging
BASE_URL=https://api.restful-api.dev
ENVIRONMENT=staging
API_TIMEOUT=8000
```

```bash
# .env
BASE_URL=https://api.restful-api.dev
ENVIRONMENT=dev
API_TIMEOUT=5000
```

> El archivo `.env` es el que se carga por defecto cuando no se especifica ambiente.

Agrega todos al `.gitignore`:

```
.env
.env.dev
.env.staging
.env.prod
```

### 1.2 Actualizar `playwright.config.js`

Modifica el archivo para que cargue el archivo correcto según el ambiente que se pase por consola:

```javascript
// playwright.config.js
const env = process.env.ENV || 'dev';
require('dotenv').config({ path: `.env.${env}` });

module.exports = {
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    timeout: parseInt(process.env.API_TIMEOUT) || 5000,
  },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
};
```

### 1.3 Ejecutar apuntando a diferentes ambientes

```bash
# Correr en dev (por defecto)
npx playwright test

# Correr en staging
ENV=staging npx playwright test

# Correr en prod
ENV=prod npx playwright test
```

> El mismo test, el mismo comando, diferente ambiente. Cero cambios en el código.

---

## 🏷️ Paso 2 — Anotaciones en Playwright

### 2.1 `test.describe` — Agrupar por contexto

Agrupa los tests que comparten el mismo recurso o flujo de negocio.
Puedes anidar `describe` para crear jerarquías.

```javascript
test.describe('Products API', () => {

  test.describe('GET /objects', () => {
    test('debe retornar un producto por ID válido', async ({ request }) => { ... });
    test('debe retornar 404 para un ID inexistente', async ({ request }) => { ... });
  });

  test.describe('POST /objects', () => {
    test('debe crear un producto con datos completos', async ({ request }) => { ... });
  });

});
```

**¿Por qué importa?**
En el reporte de Playwright, los tests aparecen agrupados con esta jerarquía.
Cuando algo falla, sabes de inmediato en qué contexto falló.

---

### 2.2 `test.step` — Documentar el flujo interno

Divide un test largo en pasos descriptivos. Los pasos aparecen en el reporte HTML con su propio estado (✅ o ❌).

```javascript
test('debe crear y consultar un producto @smoke', async ({ request }) => {
  const productService = new ProductService(request);

  await test.step('Preparar el producto a crear', async () => {
    // setup
  });

  await test.step('Enviar POST /objects', async () => {
    // llamada al servicio
  });

  await test.step('Validar el status code y el body del response', async () => {
    // assertions
  });
});
```

> 💡 Regla práctica: si tu test tiene más de 3 assertions, usa `test.step`.
> Si tiene menos, no es necesario — no agregues estructura por agregar.

---

### 2.3 `test.skip` vs `test.fixme`

Ambas omiten el test, pero comunican cosas distintas al equipo:

| Anotación | Mensaje que comunica | Cuándo usarla |
|---|---|---|
| `test.skip` | "Este test no aplica todavía" | El endpoint no existe aún, el feature está en desarrollo |
| `test.fixme` | "Este test está roto, hay un bug conocido" | El test falla por un bug ya reportado en el backlog |

```javascript
// El endpoint DELETE aún no está implementado en esta API
test.skip('debe eliminar un producto por ID', async ({ request }) => {
  // implementación pendiente
});

// Falla por bug QAX-142: la API devuelve 500 en lugar de 404 para IDs con letras
test.fixme('debe retornar 404 para IDs con caracteres especiales', async ({ request }) => {
  const productService = new ProductService(request);
  const { status } = await productService.getProduct('abc!@#');
  expect(status).toBe(404);
});
```

---

### 2.4 Tags — Categorizar para filtrar ejecuciones

Los tags son parte del nombre del test y se usan con `--grep` para filtrar.

| Tag | ¿Qué incluye? | ¿Cuándo corre? |
|---|---|---|
| `@smoke` | Tests críticos, flujo feliz | En cada deploy, antes de regression |
| `@regression` | Suite completa | En releases o PRs importantes |
| `@security` | Autenticación, autorización | En auditorías o cambios de auth |

```javascript
test('debe crear un producto @smoke', async ({ request }) => { ... });
test('debe manejar payload inválido @regression', async ({ request }) => { ... });
test('debe rechazar requests sin token @security', async ({ request }) => { ... });
```

**Ejecutar por tag:**

```bash
# Solo smoke
npx playwright test --grep @smoke

# Solo regression
npx playwright test --grep @regression

# Smoke en staging
ENV=staging npx playwright test --grep @smoke
```

---

## 🧪 Paso 3 — Implementar el archivo de tests completo

Crea el archivo `tests/catalog.spec.js` aplicando todo lo aprendido:

- [Ver el proyecto referencia](/Assets/03_Stage_3/02_Training/02_Exercise_2/auto_api_testing_stage3_exe2).

---

## ▶️ Paso 4 — Ejecutar y explorar el reporte

```bash
# Correr todos los tests
```bash
# Correr todos los tests
npx playwright test tests/catalog.spec.js

# Correr solo @smoke en dev
npx playwright test --grep @smoke

# Correr @smoke en staging
ENV=staging npx playwright test --grep @smoke

# Ver el reporte HTML completo
npx playwright show-report
```

# Correr solo @smoke en dev

`npx playwright test --grep @smoke`

# Correr @smoke en staging
`ENV=staging npx playwright test --grep @smoke`

# Ver el reporte HTML completo

`npx playwright show-report`


Explora el reporte HTML y observa:
- Cómo se agrupan los `describe`
- Cómo aparecen los `test.step` anidados
- Cómo se muestran los tests `skip` y `fixme`

---

### 👈 Volver al [Training](./README.md)
