# 🌱 Warm Up #3 – Implementaciones avanzadas en API Testing con Playwright

En este calentamiento vas a dominar los conceptos esenciales para construir pruebas **más organizadas, escalables y profesionales**.  
Llegarás a la mentoría con el contexto necesario para implementar una arquitectura real desde el primer minuto.

---

## 📂 Index

1. [PUT, PATCH e Idempotencia](#1-put-patch-e-idempotencia) (Tiempo de lectura/práctica: 15 minutos)
2. [Programación Orientada a Objetos](#2-programación-orientada-a-objetos) (Tiempo de lectura/práctica: 20 minutos)
3. [Modelos para Request y Response](#3-modelos-para-request-y-response) (Tiempo de lectura/práctica: 15 minutos)
4. [API Service Layer](#4-api-service-layer) (Tiempo de lectura/práctica: 15 minutos)
5. [Configuración de entornos y variables de entorno](#5-configuración-de-entornos-y-variables-de-entorno) (Tiempo de lectura/práctica: 15 minutos)
6. [Anotaciones en Playwright](#6-anotaciones-en-playwright) (Tiempo de lectura/práctica: 15 minutos)
7. [Quick Task](#7-quick-task) (Tiempo de práctica: 45 minutos)

> ⏱️ Tiempo aproximado de estudio: **2 horas y 20 minutos**

---

## 1. PUT, PATCH e Idempotencia

### ¿Qué es la Idempotencia?

La **idempotencia** es una propiedad de ciertos métodos HTTP que garantiza que **ejecutar la misma operación una o múltiples veces produce el mismo resultado final**.

> "Enviar la misma petición una, dos o diez veces no debe alterar el estado final del sistema."

Esto es crítico para un tester porque significa que puedes **repetir una prueba sin miedo a corromper datos** o crear registros duplicados.

### Tabla de idempotencia por método

| Método | ¿Idempotente? | ¿Por qué? |
|--------|:---:|---|
| `GET` | ✅ Sí | Solo lee datos, nunca los modifica |
| `PUT` | ✅ Sí | Reemplaza el recurso con el mismo resultado cada vez |
| `DELETE` | ✅ Sí | El recurso queda eliminado sin importar cuántas veces se llame |
| `PATCH` | ⚠️ Depende | Puede serlo o no, según cómo lo implemente el backend |
| `POST` | ❌ No | Cada llamada crea un nuevo recurso |

### Método `PUT` – Reemplazo completo

`PUT` envía **el objeto completo**. Si omites un campo, el servidor puede eliminarlo o dejarlo en `null`.

```http
PUT /users/101
Content-Type: application/json

{
  "id": 101,
  "name": "Ninja Tester",
  "email": "ninja@test.com",
  "role": "admin",
  "active": true
}
```

> ⚠️ Si envías solo `name` y `role`, los demás campos podrían eliminarse. Siempre envía el objeto completo al usar `PUT`.

**Validaciones recomendadas como tester:**
- Status code esperado: `200 OK` o `204 No Content`
- Confirmar con `GET /users/101` que todos los campos fueron actualizados
- Caso negativo: omitir un campo obligatorio → esperar `400 Bad Request`

### Método `PATCH` – Actualización parcial

`PATCH` envía **solo los campos que quieres modificar**. El resto del objeto permanece intacto.

```http
PATCH /users/101
Content-Type: application/json

{
  "role": "moderator"
}
```

> Solo se actualiza `role`. Los demás campos del usuario no se tocan.

**Validaciones recomendadas como tester:**
- Status code: `200 OK` o `204 No Content`
- Confirmar con `GET /users/101` que **solo** cambió el campo enviado
- Verificar que ningún otro campo fue modificado

### Diferencias clave

| Característica | `PUT` | `PATCH` |
|---|---|---|
| Tipo de actualización | Completa | Parcial |
| Campos requeridos | Todos | Solo los que cambian |
| Riesgo si omites campos | Se pueden perder datos | No afecta al resto |
| Idempotente | ✅ Siempre | ⚠️ Depende del backend |

[!idempotence](/Assets/03_Stage_3/01_WarmUp/idempotence.png)

---

## 2. Programación Orientada a Objetos

[!opp_para_testers](/Assets/03_Stage_3/01_WarmUp/opp_para_testers.png)

### ¿Por qué necesitas POO como tester automatizador?

Cuando empiezas en automatización, es natural escribir todo dentro del test: la URL, el body, las validaciones. Funciona, pero **no escala**. Si el endpoint cambia, tienes que buscar y modificar en decenas de archivos.

La **Programación Orientada a Objetos (POO)** te permite organizar tu código en **clases** que representan conceptos del mundo real y que puedes **reutilizar** en todos tus tests.

### Conceptos base

#### Clase
Es un molde o plantilla que define las propiedades y comportamientos de un objeto.

```javascript
class User {
  constructor(name, email, role) {
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
```

#### Objeto (instancia)
Es una versión concreta creada a partir de una clase.

```javascript
const user = new User("Ninja Tester", "ninja@test.com", "admin");
console.log(user.name);  // "Ninja Tester"
console.log(user.email); // "ninja@test.com"
```

#### Método
Es una función que vive dentro de una clase y define un comportamiento.

```javascript
class User {
  constructor(name, email, role) {
    this.name = name;
    this.email = email;
    this.role = role;
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      role: this.role
    };
  }
}

const user = new User("Ninja Tester", "ninja@test.com", "admin");
console.log(user.toJSON());
// { name: "Ninja Tester", email: "ninja@test.com", role: "admin" }
```
[!oop_metafora](/Assets/03_Stage_3/01_WarmUp/oop_metafora.png)

### ¿Por qué esto le importa a un tester?

Piénsalo así: en lugar de escribir el body del request a mano en cada test, creas una clase `UserRequest` que lo construye por ti. Si la estructura del body cambia, solo modificas **un lugar**.

---

## 3. Modelos para Request y Response

### ¿Qué es un Modelo?

Un **modelo** es una clase que representa la estructura de datos que viaja entre tu test y la API.

Hay dos tipos:

| Tipo | ¿Qué representa? | ¿Cuándo se usa? |
|---|---|---|
| **Request Model** | El body que envías a la API | Al crear o actualizar un recurso |
| **Response Model** | El JSON que la API te devuelve | Al validar la respuesta |

### Request Model – Serialización

**Serializar** significa convertir un objeto JavaScript en un JSON para enviarlo en el body del request.

```javascript
// models/UserRequest.js
class UserRequest {
  constructor(name, email, role = "user") {
    this.name = name;
    this.email = email;
    this.role = role;
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      role: this.role
    };
  }
}

module.exports = { UserRequest };
```

**Cómo se usa en un test:**

```javascript
const { UserRequest } = require("../models/UserRequest");

const newUser = new UserRequest("Ninja Tester", "ninja@test.com", "admin");

const response = await request.post("/users", {
  data: newUser.toJSON()  // ← Serialización: objeto → JSON
});
```

### Response Model – Deserialización

**Deserializar** significa tomar el JSON que devuelve la API y convertirlo en un objeto con el que puedas trabajar y hacer assertions de forma más clara.

```javascript
// models/UserResponse.js
class UserResponse {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.active = data.active;
  }

  isAdmin() {
    return this.role === "admin";
  }

  isActive() {
    return this.active === true;
  }
}

module.exports = { UserResponse };
```

**Cómo se usa en un test:**

```javascript
const { UserResponse } = require("../models/UserResponse");

const responseBody = await response.json();
const user = new UserResponse(responseBody); // ← Deserialización: JSON → objeto

expect(user.id).toBeDefined();
expect(user.isAdmin()).toBeTruthy();
expect(user.isActive()).toBeTruthy();
```

> 💡 La gran ventaja: tus assertions son **legibles como lenguaje natural**. `user.isAdmin()` dice exactamente qué estás validando.

### Estructura de carpetas sugerida

```
src/
├── models/
│   ├── UserRequest.js
│   └── UserResponse.js
├── services/
└── tests/
```
[!serializacion_deserializacion](/Assets/03_Stage_3/01_WarmUp/serializacion_deserializacion.png)

---

## 4. API Service Layer

### ¿Qué es el Service Layer?

El **API Service Layer** es una capa de abstracción entre tus tests y las llamadas HTTP directas.

En lugar de escribir `request.post("/users", { data: ... })` en cada test, creas una clase `UserService` que agrupa **todos los requests relacionados a usuarios** en un solo lugar.

```
Sin Service Layer:          Con Service Layer:
─────────────────           ──────────────────
test1.spec.js               test1.spec.js
  → request.get(...)          → userService.getUser(id)
  → request.post(...)
                             UserService.js
test2.spec.js                 → request.get(...)
  → request.get(...)          → request.post(...)
  → request.post(...)         → request.put(...)
```

### Estructura de un Service

```javascript
// services/UserService.js
const { UserResponse } = require("../models/UserResponse");

class UserService {
  constructor(request) {
    this.request = request;
    this.baseEndpoint = "/users";
  }

  async getUser(id) {
    const response = await this.request.get(`${this.baseEndpoint}/${id}`);
    const body = await response.json();
    return new UserResponse(body); // Deserializa automáticamente
  }

  async createUser(userRequest) {
    const response = await this.request.post(this.baseEndpoint, {
      data: userRequest.toJSON() // Serializa automáticamente
    });
    const body = await response.json();
    return { status: response.status(), body: new UserResponse(body) };
  }

  async updateUser(id, userRequest) {
    const response = await this.request.put(`${this.baseEndpoint}/${id}`, {
      data: userRequest.toJSON()
    });
    return { status: response.status() };
  }

  async deleteUser(id) {
    const response = await this.request.delete(`${this.baseEndpoint}/${id}`);
    return { status: response.status() };
  }
}

module.exports = { UserService };
```

### Cómo se usa en un test

```javascript
const { UserService } = require("../services/UserService");
const { UserRequest } = require("../models/UserRequest");

test("debe crear un usuario correctamente", async ({ request }) => {
  const userService = new UserService(request);
  const newUser = new UserRequest("Ninja Tester", "ninja@test.com", "admin");

  const { status, body } = await userService.createUser(newUser);

  expect(status).toBe(201);
  expect(body.name).toBe("Ninja Tester");
  expect(body.isAdmin()).toBeTruthy();
});
```

> 🎯 El test ahora es **limpio y legible**. No sabe nada de HTTP, solo de lógica de negocio.

### Estructura de carpetas completa

```
src/
├── models/
│   ├── UserRequest.js
│   └── UserResponse.js
├── services/
│   └── UserService.js
└── tests/
    └── users.spec.js
```

[!api_service_layer](/Assets/03_Stage_3/01_WarmUp/api_service_layer.png)
---

## 5. Configuración de entornos y variables de entorno

### El problema que resuelve

En Stage 2, probablemente tienes algo así en tus tests:

```javascript
// ❌ Hardcodeado — no escala
const response = await request.get("https://api-dev.qaxpert.com/users");
```

Si quieres correr los mismos tests en `staging` o `production`, tienes que cambiar la URL manualmente en cada archivo. Eso es error humano esperando pasar.

### Solución: Variables de entorno con `.env`

#### Paso 1 — Instalar dotenv

```bash
npm install dotenv
```

#### Paso 2 — Crear el archivo `.env`

```bash
# .env
BASE_URL=https://api-dev.qaxpert.com
API_TOKEN=mi-token-secreto
```

> ⚠️ El archivo `.env` **nunca** debe subirse al repositorio. Agrégalo al `.gitignore`.

```bash
# .gitignore
.env
```

#### Paso 3 — Configurar `playwright.config.js`

```javascript
// playwright.config.js
require("dotenv").config();

module.exports = {
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  },
};
```

#### Paso 4 — Crear archivos por ambiente

```bash
.env.dev      # Variables para desarrollo
.env.staging  # Variables para staging
.env.prod     # Variables para producción
```

```bash
# .env.dev
BASE_URL=https://api-dev.qaxpert.com
API_TOKEN=token-dev-123

# .env.staging
BASE_URL=https://api-staging.qaxpert.com
API_TOKEN=token-staging-456
```

#### Paso 5 — Correr tests por ambiente

```bash
# Correr en dev (por defecto)
npx playwright test

# Correr en staging
ENV=staging npx playwright test

# Correr en producción
ENV=prod npx playwright test
```

Para que esto funcione, ajusta el `playwright.config.js`:

```javascript
require("dotenv").config({ path: `.env.${process.env.ENV || "dev"}` });
```

### Resultado final

```javascript
// ✅ Limpio — la URL viene de la configuración
test("debe retornar lista de usuarios", async ({ request }) => {
  const response = await request.get("/users"); // baseURL se aplica automáticamente
  expect(response.status()).toBe(200);
});
```

> El mismo test, sin tocar ninguna línea de código, puede correr en dev, staging o prod.

---

## 6. Anotaciones en Playwright

Las **anotaciones** son metadatos que le agregas a tus tests para organizarlos, documentarlos y controlar su ejecución. Son especialmente útiles cuando el proyecto crece y tienes decenas o cientos de tests.

### `test.describe` — Agrupar tests

Agrupa tests relacionados bajo un mismo contexto.

```javascript
test.describe("Users API", () => {
  test("debe crear un usuario", async ({ request }) => { ... });
  test("debe obtener un usuario por ID", async ({ request }) => { ... });
  test("debe eliminar un usuario", async ({ request }) => { ... });
});
```

### `test.step` — Documentar pasos dentro de un test

Divide un test en pasos legibles. Estos pasos aparecen en el reporte de Playwright.

```javascript
test("flujo completo de usuario", async ({ request }) => {
  const userService = new UserService(request);

  await test.step("Crear usuario", async () => {
    const newUser = new UserRequest("Ninja", "ninja@test.com");
    const { status } = await userService.createUser(newUser);
    expect(status).toBe(201);
  });

  await test.step("Consultar usuario creado", async () => {
    const user = await userService.getUser(1);
    expect(user.name).toBe("Ninja");
  });

  await test.step("Eliminar usuario", async () => {
    const { status } = await userService.deleteUser(1);
    expect(status).toBe(200);
  });
});
```

### `test.skip` — Omitir un test temporalmente

```javascript
test.skip("debe actualizar contraseña", async ({ request }) => {
  // Este test se salta — el endpoint aún no está implementado
});
```

### `test.fixme` — Marcar un test como roto

```javascript
test.fixme("debe validar token expirado", async ({ request }) => {
  // Este test falla — hay un bug conocido, se arreglará en el sprint 3
});
```

### `test.only` — Correr solo un test (modo debug)

```javascript
test.only("debe crear un usuario", async ({ request }) => {
  // Solo este test corre — útil para depurar
});
```

> ⚠️ Nunca hagas commit con `test.only`. Es solo para uso local durante desarrollo.

### Tags — Categorizar tests para filtrar ejecución

```javascript
test("debe crear usuario @smoke", async ({ request }) => { ... });
test("debe validar roles @regression", async ({ request }) => { ... });
test("debe manejar token expirado @security", async ({ request }) => { ... });
```

**Correr solo los tests de una categoría:**

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

### Tabla resumen de anotaciones

| Anotación | ¿Cuándo usarla? |
|---|---|
| `test.describe` | Agrupar tests del mismo recurso o flujo |
| `test.step` | Documentar pasos dentro de un test largo |
| `test.skip` | El endpoint aún no existe o está en construcción |
| `test.fixme` | Hay un bug conocido que bloquea el test |
| `test.only` | Depuración local — nunca en el repositorio |
| Tags `@nombre` | Clasificar por tipo: smoke, regression, security |

---

## 7. Quick Task

### Objetivo

Aplicar en Playwright los conceptos de este warmup: modelos, service layer, variables de entorno y anotaciones, usando la API pública de [JSONPlaceholder](https://jsonplaceholder.typicode.com).

---

### Setup previo

Asegúrate de tener tu proyecto de Playwright configurado con esta estructura:

```
src/
├── models/
│   ├── PostRequest.js
│   └── PostResponse.js
├── services/
│   └── PostService.js
└── tests/
    └── posts.spec.js
.env
playwright.config.js
```

Crea tu archivo `.env`:

```bash
BASE_URL=https://jsonplaceholder.typicode.com
```

---

### Paso 1 — Crear los modelos (20 min)

Crea la clase `PostRequest` que represente el body para crear o actualizar un post:

```javascript
// src/models/PostRequest.js
class PostRequest {
  constructor(title, body, userId) {
    this.title = title;
    this.body = body;
    this.userId = userId;
  }

  toJSON() {
    // ← Implementa este método
  }
}

module.exports = { PostRequest };
```

Crea la clase `PostResponse` que deserialice la respuesta de la API:

```javascript
// src/models/PostResponse.js
class PostResponse {
  constructor(data) {
    // ← Mapea los campos: id, title, body, userId
  }

  hasTitle() {
    // ← Retorna true si title no está vacío
  }
}

module.exports = { PostResponse };
```

---

### Paso 2 — Crear el Service Layer (15 min)

Crea la clase `PostService` con estos métodos:

```javascript
// src/services/PostService.js
class PostService {
  constructor(request) { ... }

  async getPost(id) { ... }       // GET /posts/:id  → PostResponse
  async createPost(postRequest) { ... } // POST /posts    → { status, body: PostResponse }
  async updatePost(id, postRequest) { ... } // PUT /posts/:id  → { status }
  async patchPost(id, fields) { ... }   // PATCH /posts/:id → { status }
}
```

---

### Paso 3 — Escribir los tests con anotaciones (10 min)

```javascript
// src/tests/posts.spec.js
const { test, expect } = require("@playwright/test");
const { PostService } = require("../services/PostService");
const { PostRequest } = require("../models/PostRequest");

test.describe("Posts API @smoke", () => {

  test("debe obtener un post por ID", async ({ request }) => {
    await test.step("Llamar al endpoint GET /posts/1", async () => {
      // Implementa
    });
    await test.step("Validar status 200 y estructura del response", async () => {
      // Implementa
    });
  });

  test("debe crear un post correctamente", async ({ request }) => {
    // Implementa usando PostService y PostRequest
  });

  test("debe actualizar un post con PUT @regression", async ({ request }) => {
    // Implementa — recuerda enviar el objeto completo
  });

  test("debe actualizar solo el título con PATCH @regression", async ({ request }) => {
    // Implementa — solo envía el campo title
  });

  test.skip("debe eliminar un post", async ({ request }) => {
    // JSONPlaceholder simula el delete pero no lo ejecuta realmente
    // Implementa igual y valida el status 200
  });

});
```

---

### Paso 4 — Validaciones esperadas

Verifica que tus tests cubran:

- [ ] `GET /posts/1` retorna status `200` y el `id` es `1`
- [ ] `POST /posts` retorna status `201` y el `title` coincide con el enviado
- [ ] `PUT /posts/1` retorna status `200`
- [ ] `PATCH /posts/1` retorna status `200` y solo cambia el campo enviado
- [ ] Los modelos deserializan correctamente el response
- [ ] El `baseURL` viene del `.env`, no está hardcodeado

---
### Entrega
- Sube tu código a tu repositorio personal de GitHub.
- Menciona a tu mentor en un Pull Request para que pueda revisar tu código y darte

### Quizz
- [Completa el quizz](https://gemini.google.com/share/7235d92ac81e) de 20 preguntas del contenido del Warm Up (solo un intento) y comparte el resultado en el grupo de WhatsApp programa de mentoría QAX.
- Toma un screenshot de tu resultado y compártelo en el grupo de WhatsApp del programa de mentoría QAXPERT.


---

### 💡 Tip ninja for testing

- Si tu test lee como una historia (`userService.createUser()`, `user.isAdmin()`), vas por buen camino.
- El Service Layer no es burocracia: es el código que te va a salvar cuando la API cambie la URL o el body.
- Un `.env` bien configurado hace que el mismo test corra en cualquier ambiente. Eso es automatización profesional.
- Las anotaciones no son decoración: son la diferencia entre un reporte que informa y un reporte que confunde.

---

### 👈 Volver al [Stage 3](../README.md)