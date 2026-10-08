# 🌱 Warm Up #4 – Las bases para escalar mi proyecto de manera profesional

En este warmup, vamos a sentar las bases para que tu proyecto de automatización de APIs sea 
**profesional, escalable y fácil de mantener**.

---


## 📂 Index

1. [¿Por qué TypeScript? Del caos al control](#por-qué-typescript-del-caos-al-control) (Tiempo de lectura/práctica: 20 minutos)
2. [JavaScript vs TypeScript: Lo que ya sabes, ahora con superpoderes](#javascript-vs-typescript-lo-que-ya-sabes-ahora-con-superpoderes) (Tiempo de lectura/práctica: 20 minutos)
3. [Fundamentos de TypeScript que necesitas para automatizar](#3-modelos-para-request-y-response) (Tiempo de lectura/práctica: 15 minutos)
4. [Tu primer test en TypeScript con Playwright (migración desde JS)](#tu-primer-test-en-typescript-con-playwright-migración-desde-js) (Tiempo de lectura/práctica: 15 minutos)
5. [Tipado en requests y responses de APIs](#tipado-en-requests-y-responses-de-apis) (Tiempo de lectura/práctica: 15 minutos)
6. [Interfaces y Types: modelando tus datos de prueba con demoQA](#interfaces-y-types-modelando-tus-datos-de-prueba) (Tiempo de práctica: 25 minutos)
7. [Proyecto profesional en TypeScript: estructura y configuración](#proyecto-profesional-en-typescript-estructura-y-configuración)(Tiempo de lectura/práctica: 20 minutos)
8. [Buenas prácticas para optimizar tu suite de pruebas](#buenas-prácticas-para-optimizar-tu-suite-de-pruebas) (Tiempo de lectura/práctica: 15 minutos)
9. [Quick Task](#quick-task) (Tiempo de práctica: 45 minutos)

> ⏱️ Tiempo aproximado de estudio: **3 horas y 10 minutos**

---
## ¿Por qué TypeScript? Del caos al control

Hasta ahora automatizaste con JavaScript. Funcionó, aprendiste y pudiste crear pruebas reales. Pero si alguna vez te pasó esto:

- Escribiste mal el nombre de una propiedad y el test falló en ejecución (no antes).
- Te llegó un JSON y no sabías qué campos traía.
- Revisaste código de hace 3 semanas y no entendías qué tipo de dato esperaba una función.

>Eso no es culpa tuya. Es JavaScript siendo JavaScript: flexible hasta el punto de ser impredecible.

TypeScript es JavaScript con una capa de seguridad encima. El lenguaje te avisa antes de correr el test si algo está mal. Es como tener un copiloto que te dice:  
**"oye, ese campo no existe"** antes de que el avión despegue.

>TypeScript no reemplaza JavaScript. Lo mejora. Todo lo que escribes en TS se convierte en JS al final.

### El problema real: JavaScript te deja equivocarte en silencio

Imagina que el API te devuelve esto:

```json
{
  "token": "abc123",
  "expira": "2025-12-31",
  "usuario": { "id": 1, "correo": "ana@test.com" }
}
```

### En JavaScript puedes escribir esto sin ningún error:

```javascript
// JavaScript — el editor no dice nada, pero el test falla en ejecución
const body = await response.json();

console.log(body.token);           // ✅ "abc123"
console.log(body.email);           // ❌ undefined — el campo se llama 'correo', no 'email'
console.log(body.usuario.nombre);  // ❌ undefined — no existe 'nombre'
console.log(body.expiration);      // ❌ undefined — el campo es 'expira'
```
> El problema: ninguno de esos errores aparece hasta que corres el test.

### TypeScript te atrapa el error antes de ejecutar

```typescript
// TypeScript — defines la estructura y el editor te guía
interface TokenRespuesta {
  token: string;
  expira: string;
  usuario: {
    id: number;
    correo: string;
  };
}

const body: TokenRespuesta = await response.json();

console.log(body.token);           // ✅ autocompletado
console.log(body.email);           // ❌ ERROR: no existe
console.log(body.usuario.nombre);  // ❌ ERROR: es 'correo'
console.log(body.expiration);      // ❌ ERROR: es 'expira'
```

El editor subraya el error en rojo mientras escribes, como el corrector ortográfico. No tienes que correr nada.

### Ventajas concretas para un tester

1. Autocompletado inteligente
   Cuando tipas body. el editor te muestra exactamente los campos disponibles. No tienes que abrir Postman para recordar cómo se llamaba el campo.
2. Refactoring seguro
   Si el equipo de desarrollo cambia correo por email en el API, TypeScript te marca en rojo todos los archivos que usan ese campo. En JavaScript, te enteras cuando los tests fallan en producción.

3. El código se documenta solo

```tyscript
// En JavaScript, ¿qué devuelve esta función? No lo sabes sin leer el cuerpo.
function obtenerHeaders() { ... }

// En TypeScript, la firma lo dice todo
function obtenerHeaders(): { Authorization: string; 'Content-Type': string } { ... }
```
4. Menos bugs en código de pruebas
   Según el equipo de Airbnb, TypeScript eliminó el 38% de sus bugs en producción. Para automatización, ese número se traduce en menos falsos positivos y tests más confiables.

### ¿TypeScript hace el código más largo?
Un poco al principio. Pero hay dos cosas a tener en cuenta:
```typescript

// TypeScript puede inferir el tipo sin que lo escribas explícitamente
const nombre = "Ana";       // TypeScript sabe que es string sin que lo declares
const edad = 28;            // TypeScript sabe que es number
const activo = true;        // TypeScript sabe que es boolean

// Solo necesitas declarar el tipo cuando TypeScript no puede inferirlo
// (por ejemplo, cuando recibes datos del exterior como un JSON)
```
Con el tiempo, escribir tipos se vuelve tan natural como escribir el nombre de una variable.

---

[!ts](/Assets/04_Stage_4/01_WarmUp/ts.png)

## JavaScript vs TypeScript: Lo que ya sabes, ahora con superpoderes

Mira ejemplos reales de código que ya conoces, ahora comparados lado a lado.

### Tabla de diferencias clave
| Situación | JavaScript | TypeScript |
| :--- | :--- | :--- |
| **Error de typo en un campo** | Falla en ejecución | El editor lo marca al instante |
| **Recibes un JSON** | No sabes qué trae | Defines la estructura y el editor te guía |
| **Llamas una función** | No sabes qué parámetros espera | Aparece autocompletado con los tipos |
| **Trabajas en equipo** | Difícil entender el código de otros | El tipado actúa como documentación viva |
| **Refactoring** | Cambias un nombre y no sabes dónde más usarlo | TypeScript marca todos los usos |


### 1: Funciones simples

```javascript
// JavaScript
function calcularDescuento(precio, porcentaje) {
  return precio - (precio * porcentaje / 100);
}

// ¿Qué pasa si alguien llama esto así?
calcularDescuento("cien", "20")  // JavaScript no dice nada, devuelve NaN
calcularDescuento(100)           // JavaScript no dice nada, devuelve NaN (porcentaje es undefined)

```

```typescript
// TypeScript
function calcularDescuento(precio: number, porcentaje: number): number {
  return precio - (precio * porcentaje / 100);
}

calcularDescuento("cien", "20")  // ❌ Error: Argument of type 'string' is not assignable to 'number'
calcularDescuento(100)           // ❌ Error: Expected 2 arguments, but got 1
calcularDescuento(100, 20)       // ✅ Devuelve 80


```
### Funciones que construyen el body de un request
En automatización, frecuentemente construyes el payload que le envías al API. Este es un patrón que usarás todo el tiempo.
```javascript

// JavaScript — nadie sabe qué campos son obligatorios
function construirBodyUsuario(nombre, email, rol) {
  return {
    name: nombre,
    email: email,
    role: rol
  };
}

// Alguien llama esto sin el rol y JavaScript no dice nada
const body = construirBodyUsuario("Ana", "ana@test.com");
// body.role es undefined — el test puede pasar o fallar dependiendo del API
```
```typescript
// TypeScript — queda claro qué es obligatorio y qué devuelve
interface UsuarioBody {
  name: string;
  email: string;
  role: string;
}

function construirBodyUsuario(nombre: string, email: string, rol: string): UsuarioBody {
  return {
    name: nombre,
    email: email,
    role: rol,
  };
}

// Si alguien olvida el rol, TypeScript lo avisa antes de ejecutar
const body = construirBodyUsuario("Ana", "ana@test.com");
// ❌ Error: Expected 3 arguments, but got 2.
```
### 3: Serializar una petición (construir el request completo)
Serializar significa convertir tus datos en el formato que el API espera. En JavaScript haces esto de memoria; en TypeScript el editor te ayuda.

```javascript
// JavaScript — tienes que recordar cada campo de cabeza
async function hacerLogin(request, usuario, password) {
  const response = await request.post('/auth/login', {
    data: {
      userName: usuario,   // ¿era userName o username o user_name?
      password: password,
    },
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    }
  });
  return response.json();
}
```
```typescript
// TypeScript — defines los contratos y el editor te guía
interface LoginBody {
  userName: string;
  password: string;
}

interface LoginHeaders {
  'Content-Type': string;
  'accept': string;
}

interface LoginRespuesta {
  token: string | null;
  expires: string | null;
  status: string;
  result: string;
}

async function hacerLogin(
  request: any,
  usuario: string,
  password: string
): Promise<LoginRespuesta> {

  const body: LoginBody = { userName: usuario, password: password };
  const headers: LoginHeaders = {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  };

  const response = await request.post('/Account/v1/GenerateToken', {
    data: body,
    headers: headers,
  });

  return response.json() as Promise<LoginRespuesta>;
}
```
### 4. Un test completo en Playwright
```javascript
// JavaScript — tests/login.spec.js
const { test, expect } = require('@playwright/test');

test('generar token de autenticación', async ({ request }) => {
  const response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
    data: {
      userName: 'testuser',
      password: '123456',
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  // En JS no sabes qué viene aquí hasta que lo ejecutas
  expect(body.status).toBeDefined();
});
```
```typescript
// TypeScript — tests/login.spec.ts
import { test, expect } from '@playwright/test';

interface TokenRequest {
  userName: string;
  password: string;
}

interface TokenResponse {
  token: string | null;
  expires: string | null;
  status: string;
  result: string;
}

test('generar token de autenticación', async ({ request }) => {
  const payload: TokenRequest = {
    userName: 'testuser',
    password: '123456',
  };

  const response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
    data: payload,
  });

  expect(response.status()).toBe(200);

  const body: TokenResponse = await response.json();

  // Ahora el editor sabe exactamente qué campos existen
  expect(body.status).toBe('Failed');
  expect(body.result).toContain('failed');
  // body.tokne  ← el editor lo subraya en rojo antes de ejecutar
});
```

[!js-vs-ts](/Assets/04_Stage_4/01_WarmUp/js-vs-ts.png)

> Esa diferencia de orden ahorra horas de debugging.

## Fundamentos de TypeScript que necesitas para automatizar

No necesitas aprender todo TypeScript. Solo los conceptos que usarás en tus pruebas, aplicados siempre a escenarios de automatización de APIs.

### Tipos básicos aplicados a pruebas

```typescript
// En pruebas de API usarás estos tipos constantemente
let baseUrl: string = 'https://demoqa.com';
let statusCode: number = 200;
let autenticado: boolean = false;
let token: string | null = null;  // puede ser string o null (como el API de demoqa devuelve)

// TypeScript infiere el tipo — no siempre tienes que escribirlo
let endpoint = '/Account/v1/GenerateToken'; // TypeScript sabe que es string
let maxRetries = 3;                          // TypeScript sabe que es number
```
### Arrays tipados en pruebas
```typescript
// Lista de status codes que consideras exitosos
let codigosExitosos: number[] = [200, 201, 204];

// Lista de endpoints a probar en un smoke test
let endpointsCriticos: string[] = [
  '/Account/v1/GenerateToken',
  '/BookStore/v1/Books',
  '/Account/v1/User',
];

// Lista de objetos — muy común en Data Driven
interface CasoLogin {
  usuario: string;
  password: string;
  statusEsperado: number;
}

let casosLogin: CasoLogin[] = [
  { usuario: 'user1', password: 'pass1', statusEsperado: 200 },
  { usuario: '',      password: 'pass1', statusEsperado: 400 },
];

```

###  Interfaces — modelar respuestas de API

Una `interfaz` describe exactamente cómo luce un objeto. En pruebas de API, la usarás para modelar lo que el servidor devuelve.
```typescript
// Modela la respuesta de POST /Account/v1/GenerateToken de demoqa
interface TokenResponse {
  token: string | null;
  expires: string | null;
  status: string;          // "Failed" o "Success"
  result: string;          // mensaje descriptivo
}

// Ahora cuando usas el body, el editor sabe qué campos tiene
const body: TokenResponse = await response.json();

body.token    // ✅ el editor autocompleta
body.tokne    // ❌ error inmediato: 'tokne' no existe en TokenResponse
body.status   // ✅ sabe que es string
body.expires  // ✅ sabe que puede ser string o null
``` 
### ¿Por qué usar Interface y no una clase normal en TypeScript?
Esta es una pregunta muy válida. En TypeScript tienes dos opciones para definir la forma de un objeto: `interface` o `class`. La mayoría de proyectos de automatización usan `interface` por razones muy prácticas.

#### La metáfora: el formulario de solicitud de visa
Imagina que estás en una embajada:

- La `interface` es como el formulario en blanco: define qué campos existen y qué tipo de dato va en cada uno. No hace nada por sí sola, solo describe la forma.
- La `class` es como el empleado de migración: puede rellenar el formulario, validarlo, guardarlo y hacer cosas con él. Tiene lógica propia.

>Para modelar respuestas de API, solo necesitas saber la forma del dato (el formulario), no crear un objeto que haga cosas. Por eso usas interface.

```typescript
// ❌ Usando clase — innecesariamente complejo para modelar un JSON
class TokenResponse {
  token: string | null;
  expires: string | null;
  status: string;
  result: string;

  constructor(token: string | null, expires: string | null, status: string, result: string) {
    this.token = token;
    this.expires = expires;
    this.status = status;
    this.result = result;
  }
}
// Escribiste cada campo DOS veces y creaste un constructor
// Y aun así, cuando el API devuelve JSON, no puedes hacer: new TokenResponse(body)

// ✅ Usando interface — simple, directo, y funciona perfectamente con JSON
interface TokenResponse {
  token: string | null;
  expires: string | null;
  status: string;
  result: string;
}

// Así asignas el JSON directamente — TypeScript valida la forma
const body: TokenResponse = await response.json();
```
#### Principios de POO que aplica la `interface`:

- Abstracción: defines QUÉ existe (los campos y sus tipos), sin preocuparte de CÓMO se construye.
- Contrato: cualquier objeto que diga ser `TokenResponse` debe tener esos campos exactos. Si el API devuelve algo diferente, **TypeScript** te lo dice.
- Separación de responsabilidades: la interfaz solo describe, no actúa. Si necesitas lógica (como validar que el token no esté vacío), eso va en un Service o Helper, no en el modelo.

Cuando sí usarías una `class` en automatización: cuando necesitas un objeto que haga cosas, como un Service que agrupa métodos de llamadas al API.

### Types — para valores que solo pueden ser ciertos datos
```typescript
// Un campo que solo puede tener ciertos valores
type EstadoRespuesta = 'Success' | 'Failed';
type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// TypeScript solo acepta esos valores exactos
let estado: EstadoRespuesta = 'Success'; // ✅
let otro: EstadoRespuesta = 'Pending';   // ❌ Error: ese valor no está permitido

// Muy útil en funciones de prueba
function logRequest(metodo: MetodoHttp, url: string): void {
  console.log(`[${metodo}] ${url}`);
}

logRequest('GET', '/api/users');    // ✅
logRequest('FETCH', '/api/users');  // ❌ Error: 'FETCH' no es MetodoHttp
```

### Campos opcionales en respuestas
Muchos APIs devuelven campos que a veces vienen y a veces no, dependiendo del estado.

```typescript

// La respuesta de demoqa cuando falla: token y expires son null
// Cuando funciona: token y expires tienen valores
interface TokenResponse {
  token: string | null;    // puede ser string o null
  expires: string | null;
  status: string;
  result: string;
}

// Cómo manejarlo en el test
const body: TokenResponse = await response.json();

if (body.token !== null) {
  // Solo llegas aquí si la autenticación fue exitosa
  console.log(`Token obtenido: ${body.token}`);
  expect(body.token.length).toBeGreaterThan(0);
} else {
  // Credenciales inválidas
  expect(body.status).toBe('Failed');
}
```
### Funciones tipadas — helpers de prueba

```typescript
// Un helper que construye los headers con el token
function construirHeadersAuth(token: string): Record<string, string> {
  return {
    'Authorization': token,
    'Content-Type': 'application/json',
    'accept': 'application/json',
  };
}

// Un helper que valida el status y devuelve el body tipado
async function validarYExtraer<T>(response: any, statusEsperado: number): Promise<T> {
  expect(response.status()).toBe(statusEsperado);
  return response.json() as Promise<T>;
}

// En el test
const headers = construirHeadersAuth(miToken);
const body = await validarYExtraer<TokenResponse>(response, 200);
// El editor sabe que 'body' es de tipo TokenResponse
```
##  Tu primer test en TypeScript con Playwright (migración desde JS)
Cómo cambia el `playwright.config`
El cambio más visible al migrar de JS a TS es la configuración del proyecto.

```javascript
// playwright.config.js — la forma que ya conoces
const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.BASE_URL,
  },
});
```
```typescript
// playwright.config.ts — la versión en TypeScript
import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,

  use: {
    baseURL: process.env.BASE_URL ?? 'https://demoqa.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
  },

  reporter: [
    ['list'],
    ['allure-playwright'],
  ],
});
```

#### Diferencias clave:

- `require` → `import`
- `module.exports` → `export default`
- La extensión del archivo: `.js` → `.ts`
- Puedes usar `??` (operador nullish) para valores por defecto con tipado seguro

#### Cómo cambia el import de funciones externas

```javascript
// JavaScript — importar un helper
const { construirHeaders } = require('../src/helpers/apiHelper');
const { ProductService } = require('../src/services/ProductService');
```
```typescript
// TypeScript — importar un helper
import { construirHeaders } from '../src/helpers/apiHelper';
import { ProductService } from '../src/services/ProductService';

// También puedes importar solo los tipos (no se incluyen en el JS compilado)
import type { TokenResponse, LoginBody } from '../src/types/modelos';
```

#### Tipos útiles de Playwright para escribir buenos tests

Playwright tiene sus propios tipos. Usarlos hace el código más claro:

```typescript
import { test, expect, APIRequestContext, APIResponse } from '@playwright/test';

// APIRequestContext — el tipo del objeto 'request' que recibes en cada test
// APIResponse — el tipo que devuelven los métodos request.get(), request.post(), etc.

// Ejemplo: un helper que recibe el request de Playwright y devuelve la respuesta tipada
async function postLogin(
  request: APIRequestContext,      // ← tipo explícito del request de Playwright
  userName: string,
  password: string
): Promise<APIResponse> {          // ← tipo explícito de la respuesta

  return request.post('/Account/v1/GenerateToken', {
    data: { userName, password },
  });
}

// En el test
test('login con credenciales inválidas', async ({ request }) => {
  const response = await postLogin(request, 'user', 'wrongpass');
  expect(response.status()).toBe(200);

  const body: TokenResponse = await response.json();
  expect(body.status).toBe('Failed');
});
```
>El mismo test completo: JS → TS

```typescript
// tests/login.spec.ts — la versión profesional en TypeScript
import { test, expect, APIRequestContext } from '@playwright/test';
import type { TokenResponse } from '../src/types/modelos';

async function generarToken(request: APIRequestContext): Promise<TokenResponse> {
  const response = await request.post('/Account/v1/GenerateToken', {
    data: { userName: 'testuser', password: '123456' },
  });
  return response.json();
}

test('token fallido con credenciales inválidas', async ({ request }) => {
  const body = await generarToken(request);

  expect(body.status).toBe('Failed');
  expect(body.token).toBeNull();
  expect(body.result).toContain('failed');
});
```
```typescript
// tests/login.spec.ts — la versión profesional en TypeScript
import { test, expect, APIRequestContext } from '@playwright/test';
import type { TokenResponse } from '../src/types/modelos';

async function generarToken(request: APIRequestContext): Promise<TokenResponse> {
  const response = await request.post('/Account/v1/GenerateToken', {
    data: { userName: 'testuser', password: '123456' },
  });
  return response.json();
}

test('token fallido con credenciales inválidas', async ({ request }) => {
  const body = await generarToken(request);

  expect(body.status).toBe('Failed');
  expect(body.token).toBeNull();
  expect(body.result).toContain('failed');
});
```

## Tipado en requests y responses de APIs

### ¿Por qué a veces ves interfaces en el mismo archivo de tests?

Cuando ves código como este en el mismo archivo `.spec.ts:`

```typescript
// tests/login.spec.ts
interface TokenResponse {
  token: string | null;
  ...
}

test('mi test', async ({ request }) => { ... });
```
Es porque esa interfaz solo se usa en ese test específico. No es algo que el resto del proyecto necesite conocer.
Es una forma de mantener el código organizado: cada test tiene su propio contrato definido justo ahí donde se usa.

Es válido para explorar o practicidad, pero no es la forma recomendada en un proyecto profesional.

>El problema: si tienes 10 archivos de test y todos necesitan `TokenResponse`, terminas copiando y pegando la misma interface en 10 archivos. 
> Cuando el API cambia, tienes que actualizar los 10

### La forma profesional: modelos centralizados
En un proyecto profesional, defines tus modelos (interfaces) en un solo lugar, por ejemplo en `src/types/modelos.ts`. Ahí tienes todas las interfaces que representan las respuestas y requests de tu API.

#### Paso 1 — Crear el archivo de tipos
```
src/
└── types/
    └── modelos.ts     ← aquí van todas las interfaces
```
#### Paso 2 — Definir las interfaces
```typescript
// src/types/modelos.ts

// Interfaces para el módulo de autenticación - demoqa.com
export interface LoginBody {
  userName: string;
  password: string;
}

export interface TokenResponse {
  token: string | null;
  expires: string | null;
  status: string;
  result: string;
}

// Interfaces para el módulo de libros - demoqa.com
export interface Book {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date: string;
  publisher: string;
  pages: number;
  description: string;
  website: string;
}

export interface BooksResponse {
  books: Book[];
}
```
#### Paso 3 — Importar y usar las interfaces en los tests
```typescript
// tests/auth/generarToken.spec.ts
import { test, expect } from '@playwright/test';
import type { LoginBody, TokenResponse } from '../../src/types/modelos';

test('token con credenciales inválidas', async ({ request }) => {
  const body: LoginBody = {
    userName: 'string',
    password: 'string',
  };

  const response = await request.post('/Account/v1/GenerateToken', {
    data: body,
    headers: {
      'accept': 'application/json',
      'Authorization': 'test',
      'Content-Type': 'application/json',
    },
  });

  expect(response.status()).toBe(200);

  const respuesta: TokenResponse = await response.json();

  expect(respuesta.token).toBeNull();
  expect(respuesta.status).toBe('Failed');
  expect(respuesta.result).toBe('User authorization failed.');
});
```
> Ahora si el API cambia, solo actualizas src/types/modelos.ts y todos los tests se benefician automáticamente.

---
---

## Interfaces y Types: modelando tus datos de prueba

Vamos a modelar completamente el flujo de autenticación de `https://demoqa.com/swagger`

### El request y response reales del API

- El endpoint es:

`POST https://demoqa.com/Account/v1/GenerateToken

- El curl que define el API:
 
```bash
curl -X 'POST' \
  'https://demoqa.com/Account/v1/GenerateToken' \
  -H 'accept: application/json' \
  -H 'Authorization: test' \
  -H 'Content-Type: application/json' \
  -d '{
    "userName": "string",
    "password": "string"
  }'
```
- La respuesta cuando las credenciales son inválidas:

```json
{
  "token": null,
  "expires": null,
  "status": "Failed",
  "result": "User authorization failed."
}
```
#### Paso 1 — Modelar el request
```typescript
// src/types/modelos.ts

// Representa el body que envías al API
export interface GenerateTokenRequest {
  userName: string;
  password: string;
}
```
#### Paso 2 — Modelar los headers
```typescript
// src/types/modelos.ts

// Representa los headers requeridos por demoqa
export interface DemoqaHeaders {
  accept: string;
  Authorization: string;
  'Content-Type': string;
}
```
#### Paso 3 — Modelar la respuesta
```typescript
// src/types/modelos.ts
// Representa la respuesta que recibes del API
export interface GenerateTokenResponse {
    token: string | null;
        
    expires: string | null;
    status: string;
    result: string;
}
```
#### Paso 4 — Crear un helper que construya el request
```typescript
// src/helpers/authHelper.ts
import type { GenerateTokenRequest, DemoqaHeaders } from '../types/modelos';

export function construirLoginBody(userName: string, password: string): GenerateTokenRequest {
  return { userName, password };
}

export function construirHeadersDemoqa(authValue: string = 'test'): DemoqaHeaders {
  return {
    accept: 'application/json',
    Authorization: authValue,
    'Content-Type': 'application/json',
  };
}
```

#### Paso 5 — El test usando todo junto

```typescript
// tests/auth/generateToken.spec.ts
import { test, expect } from '@playwright/test';
import type { GenerateTokenResponse } from '../../src/types/modelos';
import { construirLoginBody, construirHeadersDemoqa } from '../../src/helpers/authHelper';

test('POST GenerateToken — credenciales inválidas devuelve status Failed', async ({ request }) => {

  // ARRANGE
  const body = construirLoginBody('string', 'string');
  const headers = construirHeadersDemoqa('test');

  // ACT
  const response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
    data: body,
    headers: headers,
  });

  // ASSERT
  expect(response.status()).toBe(200);

  const respuesta: GenerateTokenResponse = await response.json();

  expect(respuesta.token).toBeNull();
  expect(respuesta.expires).toBeNull();
  expect(respuesta.status).toBe('Failed');
  expect(respuesta.result).toBe('User authorization failed.');
});
```

## Proyecto profesional en TypeScript: estructura y configuración

>En el Stage 3 aprendiste esta estructura:

```bash
auto_api_testing_stage3/
├── 📁 src/
│   ├── 📁 models/
│   │   ├── 📄 ProductRequest.js
│   │   └── 📄 ProductResponse.js
│   ├── 📁 services/
│   │   └── 📄 ProductService.js
│   └── 📁 helpers/
│       └── 📄 apiHelper.js
├── 📁 tests/
│   └── 📄 products.spec.js
├── 📄 .env
├── 📄 .gitignore
├── 📄 package.json
└── 📄 playwright.config.js
```
Ahora en el Stage 4 ese mismo proyecto evoluciona así:

```bash
auto_api_testing_stage4/
├── 📁 src/
│   ├── 📁 types/                        ← NUEVO: reemplaza 'models', ahora con interfaces TS
│   │   └── 📄 modelos.ts
│   │
│   ├── 📁 services/
│   │   └── 📄 AuthService.ts            ← mismo rol, ahora en TypeScript
│   │
│   └── 📁 helpers/
│       ├── 📄 apiHelper.ts              ← mismo rol, ahora en TypeScript
│       └── 📄 dataBuilder.ts            ← NUEVO: genera datos de prueba dinámicos
│
├── 📁 tests/
│   ├── 📁 auth/
│   │   └── 📄 generateToken.spec.ts
│   └── 📁 books/
│       └── 📄 getBooks.spec.ts
│
├── 📁 test-data/                        ← NUEVO: datos para Data Driven
│   └── 📄 loginCases.json
│
├── 📄 .env
├── 📄 .gitignore
├── 📄 tsconfig.json                     ← NUEVO: configuración de TypeScript
├── 📄 package.json
└── 📄 playwright.config.ts              ← ahora en TypeScript
```
### Lo que cambió y por qué

| Antes (Stage 3) | Ahora (Stage 4) | Razón |
| :--- | :--- | :--- |
| `models/ProductRequest.js` | `types/modelos.ts` | Las interfaces TS reemplazan las clases JS para modelar datos |
| `playwright.config.js` | `playwright.config.ts` | Tipado en la configuración y detección de errores en el editor |
| Sin `tsconfig.json` | Con `tsconfig.json` | TypeScript necesita su archivo de configuración global |
| Sin `test-data/` | Con `test-data/` | Data Driven exige separar los datos de la lógica del código |
| Un solo `spec` | Carpetas por módulo | El proyecto crece y requiere una organización escalable |


> Esta transición asegura que el framework sea mantenible y reduce drásticamente los errores en tiempo de ejecución gracias al tipado estático.


### Inicializar el proyecto desde cero

```bash
# 1. Crear carpeta y entrar
mkdir auto_api_testing_stage4 && cd auto_api_testing_stage4

# 2. Iniciar el proyecto Node
npm init -y

# 3. Instalar dependencias
#    - @playwright/test  → el framework de pruebas
#    - typescript        → el compilador de TypeScript
#    - ts-node           → permite ejecutar .ts directamente sin compilar manualmente
#    - dotenv            → leer variables de entorno desde el archivo .env
npm install -D @playwright/test typescript ts-node dotenv

# 4. Inicializar TypeScript — esto crea el archivo tsconfig.json
npx tsc --init

# 5. Crear la estructura de carpetas
mkdir -p src/types src/services src/helpers tests/auth tests/books test-data
```

### ¿Por qué hay que inicializar TypeScript si ya instalamos Playwright?

>Esta es una confusión muy común. Playwright corre tus tests, pero no es el que entiende TypeScript. Son dos cosas distintas

- **Playwright** sabe cómo ejecutar pruebas, hacer peticiones HTTP, y reportar resultados.
- **TypeScript** es un lenguaje que necesita su propio compilador para transformar tu código `.ts` en JavaScript que `Node.js` pueda ejecutar.

**Imagínalo así:** 

1. Playwright es el escenario de teatro, y TypeScript es el idioma en que está escrita la obra. 
2. El escenario no entiende el idioma solo porque la obra se presenta ahí, necesitas un traductor. 
3. Ese traductor es el compilador de TypeScript (`tsc`).

Entonces cuando instalas TypeScript y lo inicializas, estás instalando ese traductor y configurando las reglas de traducción.

[!ts-to-js](/Assets/04_Stage_4/01_WarmUp/ts-to-js.png)

### ¿Qué es el `tsconfig.json` y para qué sirve?

```json
{
  "compilerOptions": {

    "target": "ES2020",
    // ¿A qué versión de JavaScript traduce tu código TypeScript?
    // ES2020 es moderna y compatible con Node.js actual.
    // Si pones ES5, el código generado funcionaría hasta en navegadores muy viejos,
    // pero no podrías usar funcionalidades modernas como async/await de forma limpia.

    "module": "commonjs",
    // ¿Qué sistema de módulos usa el JavaScript generado?
    // commonjs es el estándar de Node.js — es el que usa require() y module.exports.
    // Como Playwright corre en Node.js, este es el valor correcto.

    "strict": true,
    // Activa el modo estricto: TypeScript se vuelve más exigente con los tipos.
    // Con strict: true, si una variable puede ser null, TypeScript te obliga a
    // manejar ese caso antes de usarla. Esto evita el famoso error
    // "Cannot read properties of null" en producción.
    // En automatización es muy útil: si el token puede ser null, TypeScript
    // te fuerza a validarlo antes de usarlo en un header.

    "esModuleInterop": true,
    // Permite importar módulos de JavaScript antiguo (que usan module.exports)
    // usando la sintaxis moderna de TypeScript (import X from 'modulo').
    // Sin esta opción, al importar dotenv tendrías que escribir:
    //   import * as dotenv from 'dotenv'   (más verboso)
    // Con ella puedes escribir:
    //   import dotenv from 'dotenv'        (más limpio)

    "resolveJsonModule": true,
    // Permite importar archivos .json directamente como si fueran módulos.
    // Sin esta opción: no puedes hacer import casos from './test-data/casos.json'
    // Con esta opción: puedes importar JSON y TypeScript conoce su estructura.
    // Es esencial para Data Driven con archivos JSON.

    "outDir": "./dist",
    // ¿Dónde guarda TypeScript el JavaScript compilado?
    // Cuando ejecutas tsc, los archivos .js generados van a la carpeta dist/.
    // Así mantienes tu código fuente (.ts) separado del código compilado (.js).
    // Normalmente agregas dist/ al .gitignore — no necesitas subir el código compilado.

    "rootDir": "."
    // ¿Desde dónde lee TypeScript tus archivos fuente?
    // El punto (.) significa "desde la raíz del proyecto".
    // Esto le dice al compilador que puede leer archivos .ts en cualquier
    // subcarpeta del proyecto (src/, tests/, etc.).
  },

  "include": ["src/**/*", "tests/**/*", "playwright.config.ts"],
  // ¿Qué archivos debe procesar TypeScript?
  // src/**/*          → todo lo que hay dentro de src/ (services, types, helpers)
  // tests/**/*        → todos los archivos de test
  // playwright.config.ts → la configuración de Playwright
  // Si no incluyes una carpeta aquí, TypeScript no revisará sus archivos.

  "exclude": ["node_modules", "dist"]
  // ¿Qué debe ignorar TypeScript?
  // node_modules → las dependencias instaladas (no son código tuyo)
  // dist         → el código ya compilado (evita que TypeScript recompile lo que ya compiló)
}

```
Cuando ejecutas `npx tsc --init`, TypeScript genera automáticamente el archivo `tsconfig.json`. 
Este archivo es el manual de instrucciones del compilador: le dice cómo debe leer tu código, a qué versión de JavaScript debe traducirlo,
qué carpetas debe incluir o ignorar, y qué tan estricto debe ser revisando errores.

Sin `tsconfig.json`, el compilador no sabe dónde están tus archivos, ni cómo quieres que los procese. 
Sería como pedirle a alguien que traduzca un libro sin decirle qué idioma usar ni qué páginas traducir.

[!flujo-ts](/Assets/04_Stage_4/01_WarmUp/flujo-ts.png)

>Cuando usas `ts-node` (que es lo que Playwright hace internamente), este flujo ocurre en memoria sin generar los archivos en `dist/`. 
>El resultado final es el mismo: tus tests corren.

### `playwright.config.ts` — configuración completa

```typescript
import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,  // más reintentos en CI/CD
  workers: process.env.CI ? 2 : 4,  // paralelismo según el entorno

  use: {
    baseURL: process.env.BASE_URL ?? 'https://demoqa.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
  },

  reporter: [
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
    }],
  ],
});

```

## Buenas prácticas para optimizar tu suite de pruebas

### El patrón AAA — Arrange, Act, Assert

Todo buen test tiene tres fases claramente separadas. Este patrón existe en todos los lenguajes y frameworks de prueba.


```typescript
test('POST GenerateToken devuelve status Failed con credenciales inválidas', async ({ request }) => {

  // ─── ARRANGE (preparar) ───────────────────────────────────────────────
  // Aquí preparas todo lo que necesitas ANTES de ejecutar la acción:
  // datos de prueba, variables, configuraciones previas
  const body = { userName: 'string', password: 'string' };
  const headers = {
    'accept': 'application/json',
    'Authorization': 'test',
    'Content-Type': 'application/json',
  };

  // ─── ACT (actuar) ────────────────────────────────────────────────────
  // Aquí ejecutas la acción que quieres probar.
  // Idealmente una sola acción por test.
  const response = await request.post('/Account/v1/GenerateToken', {
    data: body,
    headers: headers,
  });

  // ─── ASSERT (afirmar) ─────────────────────────────────────────────────
  // Aquí validas los resultados. Un assert por concepto, no todo en uno.
  expect(response.status()).toBe(200);

  const respuesta: GenerateTokenResponse = await response.json();
  expect(respuesta.token).toBeNull();
  expect(respuesta.status).toBe('Failed');
  expect(respuesta.result).toBe('User authorization failed.');
});
```
Separar claramente estas fases hace que tus tests sean más legibles, fáciles de mantener, y menos propensos a errores.
Cuando alguien lee tu test, debe entender rápidamente qué se está preparando, qué se está ejecutando
y qué se está validando. Si mezclas estas fases, el test se vuelve confuso y difícil de depurar.

### POO aplicada a automatización — el Service Layer

En el Stage 3 aprendiste a crear Services en JS. En TS, los Services usan clases con tipos definidos. 
Esto aplica el principio de encapsulamiento: el test no sabe cómo se hace la llamada, solo la usa.

```typescript
// src/services/AuthService.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import type { GenerateTokenRequest, GenerateTokenResponse } from '../types/modelos';

export class AuthService {
  // Encapsulamiento: el request está guardado dentro de la clase
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  // Método público: el test solo llama esto, no sabe cómo funciona internamente
  async generarToken(userName: string, password: string): Promise<GenerateTokenResponse> {
    const body: GenerateTokenRequest = { userName, password };

    const response: APIResponse = await this.request.post('/Account/v1/GenerateToken', {
      data: body,
      headers: this.construirHeaders(),
    });

    return response.json() as Promise<GenerateTokenResponse>;
  }

  // Método privado: solo la clase lo usa, no se expone al exterior
  private construirHeaders(): Record<string, string> {
    return {
      'accept': 'application/json',
      'Authorization': 'test',
      'Content-Type': 'application/json',
    };
  }
}
```
El test ahora es mucho más limpio, porque toda la lógica de cómo se hace la llamada al API está dentro del Service.

```typescript
// tests/auth/generateToken.spec.ts
import { test, expect } from '@playwright/test';
import { AuthService } from '../../src/services/AuthService';

test('token fallido con credenciales inválidas', async ({ request }) => {
  // ARRANGE
  const authService = new AuthService(request);

  // ACT
  const respuesta = await authService.generarToken('string', 'string');

  // ASSERT
  expect(respuesta.status).toBe('Failed');
  expect(respuesta.token).toBeNull();
});
// El test quedó con 3 líneas de lógica. El Service maneja los detalles.
```

### Serialización — convertir objetos a JSON y viceversa

Cuando trabajas con APIs, a menudo necesitas convertir tus objetos de TypeScript a JSON para enviarlos, y luego convertir las respuestas JSON de vuelta a objetos tipados.

```typescript
// ── Serialización (objeto → JSON para enviar) ──────────────────────

const body: GenerateTokenRequest = {
  userName: 'testuser',
  password: 'Password123!',
};

// Playwright serializa automáticamente cuando usas 'data':
await request.post('/Account/v1/GenerateToken', { data: body });
// Lo convierte a: '{"userName":"testuser","password":"Password123!"}'

// Si necesitas hacerlo manual (algunos casos especiales):
const bodyString = JSON.stringify(body);
await request.post('/Account/v1/GenerateToken', {
  data: bodyString,
  headers: { 'Content-Type': 'application/json' },
});

// ── Deserialización (JSON → objeto tipado) ──────────────────────────

const response = await request.post('/Account/v1/GenerateToken', { data: body });

// Cast directo al tipo — confías en la estructura del API
const respuesta = await response.json() as GenerateTokenResponse;

// Con validación básica antes de asumir el tipo
const jsonData = await response.json();
if ('token' in jsonData && 'status' in jsonData) {
  const respuesta: GenerateTokenResponse = jsonData;
  expect(respuesta.status).toBe('Failed');
}
```

### Factories — generar datos dinámicos

Una factory es una función que crea datos de prueba únicos cada vez que la llamas. Evita conflictos cuando los tests corren en paralelo.


```typescript
// src/helpers/dataBuilder.ts

export interface UsuarioFactory {
  userName: string;
  password: string;
  email: string;
}

export function crearUsuarioAleatorio(): UsuarioFactory {
  const timestamp = Date.now();
  const sufijo = Math.random().toString(36).substring(2, 7);

  return {
    userName: `qa_user_${timestamp}_${sufijo}`,
    password: `Pass_${sufijo}!`,
    email: `qa_${timestamp}@test.com`,
  };
}
```
En tu test, usas esta factory para generar un usuario nuevo cada vez:

```typescript
// En el test
import { crearUsuarioAleatorio } from '../../src/helpers/dataBuilder';

test('crear y autenticar usuario', async ({ request }) => {
  const usuario = crearUsuarioAleatorio();
  // cada ejecución genera datos únicos — perfecto para paralelismo
  console.log(usuario.userName); // "qa_user_1735000000000_x7k2a"
});
```

### Tags para organizar y filtrar tests
Las anotaciones (tags) son palabras clave que agregas a tus tests para clasificarlos. Playwright no tiene un sistema de tags nativo, pero puedes usar la descripción del test para incluirlos.

```typescript
test('validar token expirado @smoke @auth @critical', async () => { ... });
test('obtener lista de libros @regresion @books', async () => { ... });
test('eliminar usuario @regresion @auth @slow', async () => { ... });
```
Luego, al ejecutar los tests, puedes filtrar por tags usando la opción `--grep`

```bash
# Solo smoke tests — rápidos, los más críticos
npx playwright test --grep @smoke

# Todo excepto los lentos — útil antes de un deploy
npx playwright test --grep-invert @slow

# Solo tests de autenticación
npx playwright test --grep @auth
# Solo tests de regresión — para validar bugs corregidos
npx playwright test --grep @regresion
```
Usar tags de forma consistente te permite ejecutar solo lo que necesitas en cada momento, optimizando tu tiempo y recursos.


----


## Quick Task

### Objetivo

Migrar lo que ya sabes hacer en JavaScript a TypeScript. Vas a construir un proyecto de automatización desde cero usando la API pública de JSONPlaceholder, aplicando interfaces, service layer y tags.
Usando la API pública de [JSONPlaceholder](https://jsonplaceholder.typicode.com).

### Setup previo
Crea tu proyecto con esta estructura:
```bash
auto_api_testing_stage4/
├── src/
│   ├── types/
│   │   └── post.types.ts
│   └── services/
│       └── PostService.ts
├── tests/
│   └── posts.spec.ts
├── .env
├── tsconfig.json
└── playwright.config.ts
```
-Crea tu archivo `.env`:

```bash
BASE_URL=https://jsonplaceholder.typicode.com
```

#### Paso 1 — Define tus interfaces
En `src/types/post.types.ts` crea las interfaces que representen el request y el response de la API de posts.
Usa como guía esta respuesta real del endpoint `GET /posts/1`:

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati",
  "body": "quia et suscipit..."
}
```

Necesitarás al menos dos interfaces: una para el body que envías y otra para el body que recibes.
Recuerda que al crear un post el `id` no existe todavía 
**¿cómo manejarías eso con TypeScript?**

#### Paso 2 — Crea un Service Layer
En `src/services/PostService.ts` crea una clase `PostService` que tenga métodos:

- `getPost(id: number) `— hace GET a `/posts/:id`
- `createPost(...) `— hace POST a `/posts`

Usa tus interfaces del paso anterior para tipar los parámetros y los valores de retorno. 
El `request` de Playwright que recibe el constructor también debe estar tipado.
#### Paso 3 — Escribe tus tests
En `tests/posts.spec.ts` escribe al menos dos tests:
- `GET /posts/:id` — valida que el post se obtiene correctamente y que el status es 200.
- `POST /posts` — valida que al crear un post, el response tiene un `id` generado y que el status es 201. Usa el Service Layer que creaste para hacer las llamadas al API. 
Agrega tags a tus tests para clasificarlos (por ejemplo, @get, @post, @regresion).
>Recuerda usar el patrón AAA para organizar tus tests.

### Entrega
- Sube tu código a tu repositorio personal de GitHub.
- Menciona a tu mentor en un Pull Request para que pueda revisar tu código y darte

### Quizz
- [Completa el quizz](https://gemini.google.com/share/54d3f230a22d) de 20 preguntas del contenido del Warm Up (solo un intento) y comparte el resultado en el grupo de WhatsApp programa de mentoría QAX.
- Toma un screenshot de tu resultado y compártelo en el grupo de WhatsApp del programa de mentoría QAXPERT.

---

### 👈 Volver al [Stage 4](../README.md)

