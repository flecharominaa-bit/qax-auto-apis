# Exercise 01: Construyendo la arquitectura — Modelos y Service Layer

En este ejercicio vas a construir desde cero la arquitectura profesional de tu proyecto Playwright.
Aprenderás a crear **modelos de Request y Response** usando clases de JavaScript para serializar
y deserializar datos, y los conectarás con un **API Service Layer** que centraliza todas las
llamadas HTTP. El resultado es un proyecto donde los tests son limpios, legibles y fáciles de mantener.

Al finalizar este ejercicio, el ninja podrá:

- Crear un proyecto Playwright nuevo con una estructura de carpetas profesional.
- Implementar clases `Request` y `Response` para modelar los datos de la API.
- Serializar un objeto JavaScript a JSON para enviarlo en el body de un request.
- Deserializar un response JSON a un objeto con métodos útiles para las validaciones.
- Construir un `ProductService` que agrupe todos los requests relacionados a productos.
- Escribir tests limpios que usen el Service Layer sin conocer los detalles HTTP.

---

## 🛒 Historia de Usuario — Gestión de inventario

**Como** gestor de inventario,  
**Quiero** consultar y crear productos en el catálogo  
**Para** verificar que la API gestiona correctamente los recursos

- **Base URL:** `https://api.restful-api.dev`
- **Endpoints:** `GET /objects/{id}` y `POST /objects`
- **Documentación:** [API Docs](https://restful-api.dev/)
- **Colección Postman de ejemplo:* [Inventory Management.postman_collection.json](/Assets/03_Stage_3/02_Training/01_Exercise_1/Api%20Testing%20-%20Restfull-Api%20%20QAX.postman_collection.json)

> Es importante tener el Api key, y se logran creando una cuenta free: https://restful-api.dev/sign-in/
---

## 🏗️ Paso 1 — Crear el proyecto desde cero

### 1.1 Inicializar el proyecto

Abre tu terminal en la carpeta donde quieres crear el proyecto y ejecuta:

```bash
# 1. Crear carpeta del proyecto
mkdir auto_api_testing_stage3
cd auto_api_testing_stage3
npm init -y
npm install -D @playwright/test
npm install dotenv
```

#### Explicación de los comandos:
- `mkdir auto_api_testing_stage3`: Crea una nueva carpeta para tu proyecto.
- `cd auto_api_testing_stage3`: Entra a la carpeta del proyecto.
- `npm init -y`: Crea un nuevo proyecto Node.js con un `package.json` básico.
- `npm install -D @playwright/test`: Instala Playwright Test como dependencia de desarrollo.
- `npm install dotenv`: Instala la librería `dotenv` para manejar variables de entorno.

### 1.2 Crear la estructura de carpetas

Crea esta estructura manualmente o con los comandos de tu sistema operativo:

```
auto_api_testing_stage3/
│
├── 📁 src/
│   ├── 📁 models/
│   │   ├── 📄 ProductRequest.js      # Modelo para requests
│   │   └── 📄 ProductResponse.js     # Modelo para responses
│   │
│   ├── 📁 services/
│   │   └── 📄 ProductService.js      # Lógica de API de productos
│   │
│   └── 📁 helpers/
│       └── 📄 apiHelper.js           # Funciones auxiliares
│
├── 📁 tests/
│   └── 📄 products.spec.js           # Tests de productos
│
├── 📄 .env                            # Variables de entorno
├── 📄 .gitignore                      # Archivos a ignorar en Git
├── 📄 package.json                    # Dependencias del proyecto
└── 📄 playwright.config.js            # Configuración de Playwright
```

**Crear las carpetas desde terminal, desde el proyecto:**

```bash
mkdir -p src/models src/services src/helpers tests

#  Crear archivos en src/models
touch src/models/ProductRequest.js
touch src/models/ProductResponse.js

#  Crear archivos en src/services
touch src/services/ProductService.js

#  Crear archivos en src/helpers
touch src/helpers/apiHelper.js

# Crear archivos de tests
touch tests/products.spec.js
# Crear archivos de configuración
touch .env .gitignore playwright.config.js
```

### 1.3 Configurar `.gitignore`

Crea el archivo `.gitignore` con este contenido:

```
node_modules/
.env
test-results/
playwright-report/
```

> ⚠️ El archivo `.env` **nunca** debe subirse al repositorio. Contiene información sensible como tokens y URLs privadas.

---

## 🧩 Paso 2 — Crear el archivo `.env`

En el archivo `.env` en la raíz del proyecto:

```bash
BASE_URL=https://api.restful-api.dev
```

---

## ⚙️ Paso 3 — Configurar `playwright.config.js`

```javascript
// playwright.config.js
require('dotenv').config();

module.exports = {
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  reporter: [['html', { open: 'never' }]],
};
```

> `baseURL` toma el valor del `.env` automáticamente. Todos los tests usarán esta URL sin repetirla.

---

## 📦 Paso 4 — Crear el Request Model

El **Request Model** representa el body que vas a enviar a la API. Su responsabilidad es
**serializar** un objeto JavaScript en el JSON que el endpoint espera.

```javascript
// src/models/ProductRequest.js

class ProductRequest {
  /**
   * @param {string} name - Nombre del producto
   * @param {object} data - Datos adicionales del producto (specs técnicas)
   */
  constructor(name, data = {}) {
    this.name = name;
    this.data = data;
  }

  /**
   * Serializa el objeto a un JSON listo para enviar en el body del request.
   * @returns {object}
   */
  toJSON() {
    return {
      name: this.name,
      data: this.data,
    };
  }
}

module.exports = { ProductRequest };
```

**¿Qué es serializar aquí?**

Cuando llamas a `new ProductRequest("HP Laptop", { year: 2024, price: 1200 })`,
tienes un objeto JavaScript en memoria. El método `toJSON()` lo convierte
en el formato exacto que la API espera recibir:

```json
{
  "name": "HP Laptop",
  "data": {
    "year": 2024,
    "price": 1200
  }
}
```

---

## 📬 Paso 5 — Crear el Response Model

El **Response Model** toma el JSON que devuelve la API y lo convierte en un objeto
con propiedades claras y métodos que facilitan las validaciones.

```javascript
// src/models/ProductResponse.js

class ProductResponse {
  /**
   * Deserializa el JSON de la API en un objeto manejable.
   * @param {object} data - El body del response
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.data = data.data || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * Verifica que el producto tiene un ID válido.
   * @returns {boolean}
   */
  hasValidId() {
    return this.id !== undefined && this.id !== null && this.id !== '';
  }

  /**
   * Verifica que el nombre no está vacío.
   * @returns {boolean}
   */
  hasName() {
    return typeof this.name === 'string' && this.name.trim().length > 0;
  }

  /**
   * Obtiene el precio del producto si existe en data.
   * @returns {number|null}
   */
  getPrice() {
    return this.data?.price ?? null;
  }

  /**
   * Verifica que el precio es mayor a cero.
   * @returns {boolean}
   */
  hasPriceGreaterThanZero() {
    const price = this.getPrice();
    return price !== null && price > 0;
  }
}

module.exports = { ProductResponse };
```

**¿Qué es deserializar aquí?**

La API devuelve este JSON:

```json
{
  "id": "ff808181932badb60195d9e7726b005b",
  "name": "HP Laptop",
  "data": { "year": 2024, "price": 1200 },
  "createdAt": "2025-01-15T10:30:00.000+0000"
}
```

Al hacer `new ProductResponse(body)`, ese JSON se convierte en un objeto con el que
puedes escribir assertions legibles:

```javascript
// En lugar de esto:
expect(body.id).toBeDefined();
expect(typeof body.name).toBe('string');
expect(body.data.price).toBeGreaterThan(0);

// Puedes escribir esto:
expect(product.hasValidId()).toBeTruthy();
expect(product.hasName()).toBeTruthy();
expect(product.hasPriceGreaterThanZero()).toBeTruthy();
```

---

## 🔧 Paso 6 — Crear el API Service Layer

El **Service Layer** es la clase que agrupa todos los requests HTTP relacionados a un recurso.
Los tests no saben nada de URLs ni de métodos HTTP — solo llaman al servicio.

```javascript
// src/services/ProductService.js

const { ProductResponse } = require('../models/ProductResponse');

class ProductService {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
    this.endpoint = '/objects';
  }

  /**
   * Obtiene un producto por su ID.
   * @param {string} id
   * @returns {Promise<{ status: number, body: ProductResponse }>}
   */
  async getProduct(id) {
    const response = await this.request.get(`${this.endpoint}/${id}`);
    const body = await response.json();
    return {
      status: response.status(),
      body: new ProductResponse(body),
    };
  }

  /**
   * Crea un nuevo producto.
   * @param {import('../models/ProductRequest').ProductRequest} productRequest
   * @returns {Promise<{ status: number, body: ProductResponse }>}
   */
  async createProduct(productRequest) {
    const response = await this.request.post(this.endpoint, {
      data: productRequest.toJSON(),
    });
    const body = await response.json();
    return {
      status: response.status(),
      body: new ProductResponse(body),
    };
  }
}

module.exports = { ProductService };
```

> 🎯 Nota cómo el Service siempre devuelve un `ProductResponse`, no un JSON crudo.
> Esto garantiza que todos los tests reciban el mismo tipo de objeto, con los mismos métodos disponibles.

---

## 🧪 Paso 7 — Escribir los tests

```javascript
// tests/products.spec.js

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
```

---

## ▶️ Paso 8 — Ejecutar los tests

```bash
# Correr todos los tests
npx playwright test

# Correr solo los tests smoke
npx playwright test --grep @smoke

# Ver el reporte HTML
npx playwright show-report
```

---

### 👈 Volver al [Training](./README.md)
