# Exercise 02: Flujo Completo con Token y Datos Dinámicos

En este ejercicio, daremos un paso gigante. Vamos a construir un flujo real de principio a fin (End-to-End) para una API. No probaremos un solo endpoint, sino que haremos que nuestras peticiones "conversen" entre sí.

Al finalizar este ejercicio, el ninja podrá:
- Instalar y usar librerías externas (como `Faker.js`) para generar datos de prueba únicos en cada ejecución.
- Modularizar el código separando las funciones generadoras en la carpeta `utils/`.
- Configurar el archivo `playwright.config.js` para usar URLs base globales.
- Capturar un **Token de Autenticación** de un Login y enviarlo a través de los **Headers** en peticiones GET y POST subsiguientes.
- Manejar el estado y las variables compartidas entre diferentes bloques de `test()`.

---
Esta ejercicio se nos hace familiar, desde en los retos del primer stage, hemos estado creando usuarios y obteniendo tokens. 
Sin embargo, esta vez vamos a llevarlo al siguiente nivel. En lugar de hacer cada paso de forma aislada, vamos a encadenar las acciones para simular un flujo real de usuario.

## Gestión de Seguridad y Perfil de Usuario

### Historia de Usuario
**Como** usuario registrado de la aplicación "Notes",  
**Quiero** poder consultar los datos de mi perfil y cambiar mi contraseña por una nueva,  
**Para** mantener mi cuenta segura y mi información actualizada.

**Base URL:** `https://practice.expandtesting.com/notes/api`

### Criterios de Aceptación

Para lograr este flujo, primero el sistema debe registrar y loguear al usuario en segundo plano para obtener el token. Luego, se debe validar:

1. **Consultar Perfil de Usuario**:
    - `GET /users/profile` debe devolver HTTP `200`.
    - La petición debe incluir obligatoriamente en el Header la clave `x-auth-token` con el valor del token válido.
    - La respuesta debe contener los datos del usuario (`id`, `name`, `email`).

2. **Cambiar Contraseña (Usuario logueado)**:
    - `POST /users/change-password` debe devolver HTTP `200`.
    - Requiere el Header `x-auth-token`, y en el body enviar la contraseña actual y una nueva contraseña.
    - La respuesta debe confirmar que la contraseña se actualizó correctamente.

---

### Paso a paso: Crear el proyecto E2E con Playwright

#### 1. Inicializar el proyecto e instalar la librería externa
Vamos a usar `@faker-js/faker`, una librería muy famosa en el mundo del testing para generar nombres, correos y contraseñas aleatorias reales.

Abre tu terminal y ejecuta:
```bash
# 1. Crear proyecto Playwright (Dile 'sí' a todo con TypeScript = false)
npm init playwright@latest qax-project-st-2-exe-2

# 2. Entrar a la carpeta del proyecto
cd qax-project-st-2-exe-2

# 3. Instalar Faker.js
npm install @faker-js/faker --save-dev
```

#### 2. Crear la estructura de carpetas profesional
Es hora de organizar nuestro dojo. Borra los archivos de ejemplo que trajo Playwright y crea esta estructura:

```bash
mkdir utils
```

Tu proyecto debería verse así:

```bash
qax-project-st-2-exe-2/
├── tests/
│   └── auth-flow.spec.js     # Aquí escribiremos el código de prueba
├── utils/
│   └── dataGenerator.js      # Nuestra fábrica de datos dinámicos
├── playwright.config.js      # Configuraciones globales
├── package.json
└── node_modules/
```

#### 3.  Configurar `playwright.config.js`
Vamos a decirle a Playwright cuál es la URL base para no tener que escribirla en cada petición. Modifica tu archivo para que se vea así:

```javascript
// @ts-check
import { defineConfig } from '@playwright/test';

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    // Definimos la Base URL de la API de Notes
    baseURL: 'https://practice.expandtesting.com/notes/api/',
  },
});


```

#### 4. Crear nuestra utilidad generadora de datos (`utils/dataGenerator.js`)
Aquí usamos Faker para crear usuarios únicos. Cada vez que corras el test, será un usuario distinto.

```javascript
import { faker } from "@faker-js/faker";

function generarUsuario() {
    return {
        name: faker.person.fullName(),
        // Agregamos .toLowerCase() para evitar conflictos con la API
        email: faker.internet.email().toLowerCase(), 
        password: faker.internet.password() + 'A1!' 
    };
}

// Exportamos la función para poder usarla en nuestros tests
module.exports = { generarUsuario };
```

#### 5. El script principal (`tests/auth-flow.spec.js`)
Este es el corazón del ejercicio. Observa cómo usamos `test.describe.serial` para obligar a que los pasos se ejecuten en orden, y cómo definimos variables al principio para "pasarlas" entre los tests.

```javascript
import { test, expect } from '@playwright/test';
import { generarUsuario } from '../utils/dataGenerator';

// .serial obliga a ejecutar los tests en orden. Si falla el registro, no intenta hacer login.
test.describe.serial('Flujo End-to-End: Perfil y Cambio de Contraseña', () => {
    
    // 1. Variables compartidas para todo el flujo
    let tokenAuth;
    let usuarioDinamico;
    let nuevaPassword = 'NewPassword123!';

    // Antes de todos los tests, generamos la data
    test.beforeAll(() => {
        usuarioDinamico = generarUsuario();
    });

    test('Paso 1: Preparación - Registrar y Loguear usuario', async ({ request }) => {
        // Registro
        const resRegistro = await request.post('users/register', {
            data: {
                name: usuarioDinamico.name,
                email: usuarioDinamico.email,
                password: usuarioDinamico.password
            }
        });
        expect(resRegistro.status()).toBe(201);

        // Login inmediato para obtener el token
        const resLogin = await request.post('users/login', {
            data: {
                email: usuarioDinamico.email,
                password: usuarioDinamico.password
            }
        });
        expect(resLogin.status()).toBe(200);

        const bodyLogin = await resLogin.json();
        // ¡Atrapamos el token! y lo guardamos en la variable compartida
        tokenAuth = bodyLogin.data.token;
        console.log('Token obtenido con éxito!');
    });

    test('Paso 2: Consultar Perfil con el Token (GET)', async ({ request }) => {
        const response = await request.get('users/profile', {
            headers: {
                // Inyectamos el token en el header usando la clave exigida por la API
                'x-auth-token': tokenAuth 
            }
        });

        expect(response.status()).toBe(200);
        
        const body = await response.json();
        // Validamos que el perfil devuelto sea exactamente el del usuario que creamos
        expect(body.data.email).toBe(usuarioDinamico.email);
        expect(body.data.name).toBe(usuarioDinamico.name);
    });

    test('Paso 3: Cambiar Contraseña usando el Token (POST)', async ({ request }) => {
        const response = await request.post('users/change-password', {
            headers: {
                'x-auth-token': tokenAuth
            },
            data: {
                currentPassword: usuarioDinamico.password,
                newPassword: nuevaPassword
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe('The password was successfully updated');
    });

});
```

---

### ▶️ Comando de ejecución
Abre la terminal en la raíz de tu proyecto y ejecuta este comando para ver la magia ocurrir a toda velocidad:

```bash
npx playwright test tests/auth-flow.spec.js --ui
```
>Para ejecutar en debug mode y ver paso a paso, puedes agregar el flag `--ui` que abrirá una interfaz gráfica donde podrás seleccionar cada test y ver su ejecución en tiempo real.

Para ver el reporte visual de tus aserciones exitosas:

```bash
npx playwright show-report
```

### 💡 Tip Ninja For Testing:
> **El manejo del estado (variables compartidas):** Fíjate bien en el código. Definimos `let tokenAuth;` **fuera** de los bloques `test()`. Si lo defines adentro de un `test()`, la variable "muere" cuando ese bloque termina y el siguiente test fallará por no tener Token. ¡Ese es uno de los secretos más grandes de la automatización de flujos E2E!

---

### 👈 Volver al [Training](./README.md)