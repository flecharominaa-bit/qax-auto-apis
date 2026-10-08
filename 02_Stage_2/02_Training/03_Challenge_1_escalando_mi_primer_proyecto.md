# Challenge 1: Escalando mi proyecto de automatización

En este reto vamos a practicar la creación de nuevos archivos de prueba (`.spec.js`), la reutilización de funciones y el manejo de variables dinámicas dentro de nuestro proyecto estructurado. 
La idea es que aprendas a organizar tu código de pruebas de forma clara y fácil de mantener al agregar nuevos flujos de negocio.

**Vamos a enfocarnos en:**
- Escalar nuestro proyecto agregando un nuevo archivo de prueba independiente.
- Reutilizar la función generadora de datos (`utils/dataGenerator.js`) creada en el ejercicio anterior.
- Atrapar un "Token de Recuperación" (que es distinto al Token de Login) y pasarlo por múltiples peticiones.
- Validar un flujo E2E real: que un cambio de contraseña verdaderamente te permita iniciar sesión después.

> El objetivo es que al finalizar, entiendas cómo dar tus primeros pasos hacia una automatización ordenada y profesional, que no solo funcione, sino que también sea fácil de escalar cuando el sistema crezca.

---

## 📖 Historia de Usuario: Recuperación de Acceso

**Como** usuario de la aplicación "Notes" que olvidó su credencial,  
**Quiero** solicitar un enlace de restablecimiento, verificar mi identidad y crear una nueva contraseña,  
**Para** recuperar el acceso a mi cuenta y mis notas de forma segura.

**Base URL:** `https://practice.expandtesting.com/notes/api`

---

### ✅ Criterios de Aceptación (El Flujo a Automatizar)

*Nota de Negocio: Para poder recuperar una contraseña, ¡el usuario debe existir! Tu prueba deberá registrar a un usuario generado dinámicamente antes de empezar este flujo.*

1. **Solicitar recuperación (Forgot Password):**
    - `POST /users/forgot-password` enviando el `email` del usuario.
    - Debe devolver HTTP `200` y generar un mensaje indicando que se envió el enlace.
    - *(Pista Ninja: En esta API de pruebas, el response JSON te devolverá el token de recuperación en el campo `data.token`. ¡Atrápalo en una variable!)*

2. **Verificar el Token de restablecimiento:**
    - `POST /users/verify-reset-password-token` enviando en el body el `token` atrapado en el paso anterior.
    - Debe devolver HTTP `200`, validando que el token es correcto y no ha expirado.

3. **Restablecer la contraseña:**
    - `POST /users/reset-password` enviando en el body el `token` y una `newPassword`.
    - Debe devolver HTTP `200`, confirmando el restablecimiento exitoso.

4. **Validación E2E (El momento de la verdad):**
    - Intentar iniciar sesión (`POST /users/login`) utilizando el correo original y la **nueva contraseña**.
    - Debe devolver HTTP `200`, confirmando que el cambio de contraseña se aplicó correctamente en la base de datos.

---

### Instrucciones

Usando el proyecto estructurado que creaste en el `Exercise 02`:

1. Ve a la carpeta `tests/` y crea un nuevo archivo llamado `forgot-password.spec.js`.
2. Escribe un bloque `test.describe.('Flujo de Recuperación de Contraseña', () => { ... })`.
3. Importa tu generador de usuarios (`require('../utils/dataGenerator')`) y usa el hook `test.beforeAll()` para registrar al usuario temporalmente.
4. Desarrolla los 4 pasos definidos en los Criterios de Aceptación, guardando el token de recuperación en una variable global `let resetToken;` para poder usarlo en los pasos 2 y 3.
5. Ejecuta tus pruebas con `npx playwright test tests/forgot-password.spec.js` y asegúrate de que todo pase en verde ✅.

### Entrega
1. Sube los cambios a tu repositorio personal en GitHub.
2. Realiza un Pull Request y menciona a tu mentor para revisión.

---

### 📝 Mensaje para el aprendiz:
> Usa el archivo `README.md` de tu proyecto para detallar tu entrega. y explicar brevemente cómo abordaste el ejercicio,
> qué aprendiste y cualquier desafío que enfrentaste. 
> Esto no solo te ayudará a ti a reflexionar sobre tu proceso, sino que también le dará a tu mentor un contexto valioso para la revisión.

>  **Recuerda:** Asegúrate de que tu archivo `.gitignore` incluya `node_modules/` y `playwright-report/` antes de subir el código.

### 👈 Volver al [Training](./README.md)