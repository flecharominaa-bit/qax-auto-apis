# Challenge 1: Testing Apis en Postman

En este reto vamos a practicar la exploración y prueba de APIs usando la [plataforma ExpandTesting Notes API](https://practice.expandtesting.com/notes/api/api-docs/#/).
El objetivo es que como aprendiz construyas tus propios casos de prueba en Postman, enfrentándote a un flujo real de seguridad: consultar información privada de un usuario y gestionar el ciclo de vida de su contraseña.

---

### Historia de Usuario
- **Como** usuario registrado de la aplicación,
- **Quiero** poder ver la información de mi perfil, cambiar mi contraseña actual y tener un mecanismo para recuperar mi cuenta si olvido mi clave,
- **Para** gestionar mi cuenta de forma segura y no perder acceso a mis notas.

---

###  Criterios de Aceptación

1. Consultar Perfil de Usuario:

   - `GET` `/users/profile` debe devolver HTTP 200.
   - La petición debe incluir el Token de autenticación (obtenido al hacer Login).
     - En el Header con la clave `x-auth-token` y el valor del token.
   - La respuesta debe contener los datos del usuario (id, name, email).

2. Cambiar Contraseña (Usuario logueado):

   - `POST` `/users/change-password` debe devolver HTTP 200.
   - Requiere el Token de autenticación, la contraseña actual y la nueva contraseña.
     - En el Header con la clave `x-auth-token` y el valor del token.
   - La respuesta debe confirmar que la contraseña se actualizó correctamente.

3. Flujo de Recuperación de Contraseña (Forgot Password):

   - Paso 1: `POST` `/users/forgot-password` enviando el email debe devolver HTTP 200 y generar un mensaje indicando que se envió el enlace. (Nota: La API en las pruebas suele devolver el token de recuperación en la respuesta para facilitar el testing).
   - Paso 2: `POST` `/users/verify-reset-password-token` enviando el token generado debe devolver HTTP 200, validando que el token es correcto.
   - Paso 3: `POST`` /users/reset-password` enviando el token y la nueva contraseña debe devolver HTTP 200, confirmando el restablecimiento exitoso.
   - Paso 4: Intentar iniciar sesión con la nueva contraseña debe devolver HTTP 200, confirmando que el cambio de contraseña se aplicó correctamente.

---

### Instrucciones

Usando Postman como herramienta de prueba y apoyándote en la documentación de la API (Swagger), construye los casos de prueba basados en la historia de usuario y los criterios de aceptación.

1. Redactar los casos de prueba en lenguaje Gherkin (BDD) en un archivo .md.
2. Crear una colección en Postman que contenga la ejecución de estos 5 endpoints.
3. Exportar la colección de Postman en formato JSON.
4. Subir todos los archivos (el .md y el .json) en la carpeta correspondiente en tu repositorio personal de GitHub
5. Realizar un PR y mencionar a tu mentor.

---

### 👈 Volver al [Training](./README.md)
