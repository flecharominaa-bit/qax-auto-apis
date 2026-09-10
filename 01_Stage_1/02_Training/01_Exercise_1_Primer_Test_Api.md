# Exercise 01: Primer test de API – Historia de usuario y casos de pruebas

En este ejercicio, vamos a sentar las bases para automatizar pruebas de APIs partiendo de una historia de usuario real.
El objetivo es que como Ninja de QAXpert comprendas cómo leer requerimientos de negocio, definir criterios de aceptación claros y transformarlos en casos de prueba concretos, 
listos para ejecutarse manualmente en Postman y automatizarse posteriormente con **Playwright**.

Al finalizar este ejercicio, los participantes podrán:
- Entender cómo se estructura una historia de usuario enfocada en Backend (APIs).
- Identificar criterios de aceptación que sean medibles usando Status Codes y JSONs.
- Definir casos de prueba claros que cubran un flujo vital: Verificar que el sistema está vivo y probar el registro/login de usuarios.
- Preparar el terreno para escribir código en Playwright de forma ordenada.

---

## Módulo: Estado del Sistema y Autenticación de Usuarios
### Historia de Usuario

- **Como** tester de la aplicación "Notes",
- **Quiero** poder verificar que el servidor está en línea, registrar nuevos usuarios y permitirles iniciar sesión,
- **Para** garantizar que la plataforma está estable y que el acceso de los usuarios es seguro.

- **Base URL**: `https://practice.expandtesting.com/notes/api`
- Documentación tecnica - **Swagger**: `https://practice.expandtesting.com/notes/api/api-docs/`
  
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

### Solución del Ejercicio

Primero, interiorizamos el flujo realizando las pruebas manuales en Postman.

>Nota: En la práctica real, importarás la colección en Postman: Api Testing -[Api Testing - QAXPERT.Postman](/Assets/01_Stage_1/02_Training/01_Exercise_1/Api%20Testing%20-%20QAXPERT.postman_collection.json)

#### Construyendo los Casos de Prueba

##### CP01: Verificar que la API está viva (Health Check)
- **Acción**: Realizar un GET a /health-check.
- **Esperado**: Código HTTP 200. La respuesta JSON tiene un campo success en true y un mensaje confirmando el estado.

##### CP02: Registrar un nuevo usuario

- **Acción**: Realizar un `POST` a ~~/users/register~~ con el siguiente payload (body) en formato JSON:

```json
{
  "name": "Ninja Tester",
  "email": "ninjatester-01@qaxpert.com", 
  "password": "Password123!"
}
```
> ⚠️ El email debe ser único. Si corres la prueba dos veces con el mismo email, la API te dará un error 400. ¡Cambia el número del email en tus pruebas!

- **Esperado**: Código HTTP 201. Respuesta exitosa confirmando la creación de la cuenta.

##### CP03: Iniciar sesión con el usuario creado

- **Acción**: Realizar un `POST` a `/users/login` con las credenciales creadas:
```json
{
  "email": "ninjatester01@qaxpert.com",
  "password": "Password123!"
}
```
- **Esperado**: Código HTTP `200`. La respuesta incluye un mensaje de "Login successful" y un código alfanumérico largo llamado token.

---

####  Diseño de pruebas en formato Gherkin (BDD)

Para que Playwright (y todo el equipo) entienda qué estamos probando, traducimos nuestros casos de prueba al lenguaje universal Gherkin:

```gherkin
Feature: Estado del sistema y Autenticación en la API Notes
  Como tester de la aplicación
  Quiero validar el estado del servidor y el flujo de usuarios
  Para asegurar el acceso correcto a la plataforma

  Scenario: CP01 - Verificar la salud de la API (Health Check)
    Given la API de Notes está disponible
    When realizo una petición GET a "/health-check"
    Then el código de estado de la respuesta debe ser 200
    And el mensaje de respuesta debe indicar "Notes API is Running"

  Scenario: CP02 - Registrar un usuario exitosamente
    Given la API de Notes está disponible
    When realizo una petición POST a "/users/register" con el body:
      """
      {
        "name": "Ninja Tester",
        "email": "ninjatester_dinamico@qaxpert.com",
        "password": "Password123!"
      }
      """
    Then el código de estado de la respuesta debe ser 201
    And la respuesta debe contener un mensaje de "User account created successfully"

  Scenario: CP03 - Iniciar sesión con credenciales válidas
    Given un usuario ya ha sido registrado previamente
    When realizo una petición POST a "/users/login" con el body:
      """
      {
        "email": "ninjatester_dinamico@qaxpert.com",
        "password": "Password123!"
      }
      """
    Then el código de estado de la respuesta debe ser 200
    And la respuesta debe devolver un "token" de autenticación
    And la respuesta debe contener un mensaje de "Login successful"

```

---

💡 **Tips Ninja For Testing:**  
- El flujo importa: Nota cómo el CP03 (Login) depende de que el CP02 (Registro) haya funcionado. En automatización de APIs, el orden de los factores sí altera el producto.
- Lee la historia de usuario con atención antes de abrir Postman o Playwright. Identifica el objetivo del negocio (qué se quiere lograr con la API). Esto te ayudará a diseñar pruebas que tengan sentido y no solo lanzar requests sueltos.
- Te reto a pensar en un Caso de Prueba Completo que una los tres pasos en un solo escenario. Imagina un flujo así: 
  - Paso 1: Verifico que la API responda (200) 
  - Paso 2: Creo un usuario nuevo (201)
  - Paso 3: Inmediatamente inicio sesión con ese mismo usuario (200) y guardo el Token". 

>Esto simula el viaje real de un usuario en la aplicación y es exactamente lo que automatizaremos con Playwright más adelante. ¡Es el súper poder de las pruebas de integración!

---

### 👈 Volver al [Training](./README.md)
