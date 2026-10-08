# Exercise 02: Primer test automatizado con Playwright

En este ejercicio, vamos a sentar las bases para automatizar pruebas de APIs usando Playwright.
El objetivo es que como Ninja comprendas cómo transformar los criterios de aceptación que probamos en Postman en código automatizado concreto, listo para ejecutarse a la velocidad de la luz.

Al finalizar este ejercicio, podrás:

- Traducir peticiones de Postman (GET, POST) a código JavaScript usando Playwright.
- Validar Códigos de Estado (Status Codes) y respuestas JSON automáticamente.
- Ejecutar tus pruebas desde la terminal y visualizar el reporte HTML generado.
- Prepararte para crear suites de pruebas escalables y fáciles de mantener.

---

## Módulo: Estado del Sistema y Autenticación de Usuarios

- **Como** tester de la aplicación "Notes",
- **Quiero** poder verificar que el servidor está en línea, registrar nuevos usuarios y permitirles iniciar sesión,
- **Para** garantizar que la plataforma está estable y que el acceso de los usuarios es seguro.

Base URL: https://practice.expandtesting.com/notes/api
---
### Criterios de Aceptación

1. Verificar el estado de la API (Health Check):

    - `GET` /health-check debe devolver HTTP `200`.
    - La respuesta debe confirmar que el servicio está funcionando (message: "Notes API is Running").

2. Registrar un nuevo usuario:

    - `POST` /users/register enviando nombre, correo y contraseña debe devolver HTTP `201` (Created).
    - La respuesta debe contener un mensaje de éxito y los datos del usuario creado.

3. Iniciar sesión (Login):

    - `POST` /users/login usando el correo y contraseña del usuario registrado debe devolver HTTP `200`.
    - La respuesta debe generar un token de acceso (vital para futuras pruebas) y un mensaje de éxito.

---


### Vamos a automatizar con Playwright

- Usando el comando:

```bash
npm init playwright@latest qax-project-automation-apis-playwright
```

#### 1. Nuestro  `package.json`
En Playwright, el archivo` package.json `es el corazón del proyecto.
Aquí viven nuestras dependencias. Si abres el archivo, verás que ya tenemos instalado` @playwright/test`

#### 2. Creamos nuestro archivo de pruebas `.spec.js`
Ve a la carpeta tests y crea un archivo llamado `auth.spec.js`. 
Copia y pega el siguiente código. ¡Lee los comentarios, están hechos para ti!

```javaScript
const { test, expect } = require('@playwright/test');

// ¡No podemos hacer Login si primero no nos Registramos!
test.describe('Estado del Sistema y Autenticación', () => {
    
    const baseURL = 'https://practice.expandtesting.com/notes/api';
    const userEmail = `ninja4tester_101@qaxpert.com`;
    const userPassword = 'Password123!';

    test('CP01 - Verificar la salud de la API (Health Check)', async ({ request }) => {
        // 1. Hacemos la petición (Igual que el botón SEND en Postman)
        const response = await request.get(`${baseURL}/health-check`);
        
        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta y validamos el mensaje
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Notes API is Running');
    });

    test('CP02 - Registrar un usuario exitosamente', async ({ request }) => {
        const response = await request.post(`${baseURL}/users/register`, {
            data: {
                name: 'Ninja Tester',
                email: userEmail,
                password: userPassword
            }
        });
        
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('User account created successfully');
    });

    test('CP03 - Iniciar sesión con credenciales válidas', async ({ request }) => {
        const response = await request.post(`${baseURL}/users/login`, {
            data: {
                email: userEmail,
                password: userPassword
            }
        });
        
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('Login successful');
        // Validamos que el token realmente venga en la respuesta
        expect(responseBody.data.token).toBeDefined(); 
    });

});
```
#### 3. Comando de ejecución

Abre la terminal en tu VS Code (Terminal > New Terminal) y escribe el siguiente comando para correr solo este archivo:

```bash

npx playwright test tests/auth.spec.js
```

#### 4. Reporte de ejecución

```bash
npx playwright show-report
```
¡Se abrirá una página web hermosa mostrándote el éxito de tus pruebas!


### 💡 Tip Ninja For Testing:

#### 1. Usa Postman primero
- Lanza la petición en Postman y asegúrate que funciona.  
- Luego, traslada esa lógica a Playwright.
>👉 Esto reduce drásticamente los errores por endpoints o datos mal escritos en el código.

#### 2. La anatomía de un test en Playwright (Petición -> Espera -> Validación)

En Postman presionas "Send" y tus ojos validan la respuesta. En código usamos:
- `request.get() `o post() para enviar.
- `await` para decirle al robot: "Espera a que el servidor responda".
- `expect()` para afirmar: "Espero que el status sea 200".


### 3. No memorices, copia y adapta

- Guarda un archivo de prueba base con ejemplos de GET y POST.
- Cuando empieces un nuevo test, copias y cambias la URL y los datos.
>👉 Así avanzas rápido y sin frustración.

### 4. Valida lo esencial, no todo
- No intentes verificar cada campo del JSON al inicio.  
- Empieza con `status 200` y uno o dos campos clave.  
- Luego vas agregando más validaciones.

#### 5. Empieza con un endpoint sencillo
- Antes de automatizar un flujo complejo, prueba con algo básico:
  - `GET /users`  
- Así entiendes la sintaxis de Playwright y ganas confianza.


---

> Importar el [proyecto base](/Assets/01_Stage_1/02_Training/02_Exercise_2/qax-project-automation-apis-playwright) en tu IDE (Visual Studio Code).

---

### 👈 Volver al [Training](./README.md)
