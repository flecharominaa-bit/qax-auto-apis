# 🥷 Mission #2: E2E API Testing – Platzi Fake Store (Full Coverage)

Bienvenido a tu prueba final del Stage 2.

Esta vez no vas a probar “una API”…  
vas a probar **un sistema completo como lo haría un Automation QA en la vida real**.

Vas a trabajar con:

👉 https://fakeapi.platzi.com/  
👉 Documentación Swagger: https://api.escuelajs.co/docs

⚠️ Spoiler: aquí es donde muchos testers se quedan… porque no leen la documentación.  
Tú no eres de esos.

---

# 🎯 Objetivo de la Misión

Construir un proyecto de automatización con Playwright que valide los principales módulos del sistema:

- Auth (login + token)
- Users
- Products
- Categories
- Files (upload)
- (Opcional) Location / endpoints adicionales

---

# 🧠 Lo que vas a demostrar

- Manejo de tokens (auth real)
- Encadenamiento de requests (IDs dinámicos)
- Modularización (utils, services)
- Validaciones robustas con `expect`
- Lectura de documentación (Swagger)

---

# 📖 REGLA DE ORO

> “Si no lees la documentación… no estás testeando, estás adivinando.”

---

# 🧩 Módulos a probar (con historia + criterios)

---

## 🔐 1. AUTH (Autenticación)

### 🧾 Historia de Usuario
**Como** usuario del sistema  
**Quiero** iniciar sesión con mis credenciales  
**Para** obtener un token que me permita acceder a recursos protegidos

### ✅ Criterios de Aceptación
- El endpoint `/auth/login` retorna status **200 o 201**
- La respuesta contiene un `access_token`
- El token no es null ni vacío
- El token puede ser reutilizado en siguientes requests

### Endpoints a probar
- POST `/api/v1/auth/login` 
- GET `/api/v1/auth/profile` (usando el token obtenido)
- POST `/api/v1/auth/refresh-token` (usando el token para obtener uno nuevo)
---

## 👤 2. USERS

### 🧾 Historia de Usuario
**Como** administrador del sistema  
**Quiero** crear y consultar usuarios  
**Para** gestionar quién puede acceder a la plataforma

### ✅ Criterios de Aceptación
- Se puede crear un usuario con datos dinámicos
- El endpoint retorna un `id` válido
- Se puede consultar el usuario creado
- Los datos retornados coinciden con los enviados

### Endpoints a probar
- POST `/api/v1/users` (crear usuario)
- GET `/api/v1/users/{id}` (consultar usuario creado)
- GET `/api/v1/users` (consultar lista de usuarios y verificar que el nuevo usuario está presente)

---

## 🛍️ 3. PRODUCTS

### 🧾 Historia de Usuario
**Como** administrador de catálogo  
**Quiero** crear productos  
**Para** que estén disponibles en la tienda

### ✅ Criterios de Aceptación
- Se puede crear un producto usando token
- El response contiene `id`, `title`, `price`
- El producto aparece al consultarlo

### Endpoints a probar
- POST `/api/v1/products` (crear producto con token)
- GET `/api/v1/products/{id}` (consultar producto creado)
- GET `/api/v1/products` (verificar que el producto creado está en la lista)

---

## 🗂️ 4. CATEGORIES

### 🧾 Historia de Usuario
**Como** administrador  
**Quiero** crear categorías  
**Para** organizar los productos

### ✅ Criterios de Aceptación
- Se puede crear una categoría
- Se obtiene un `id` válido
- Se puede asociar un producto a esa categoría
- La categoría se puede consultar posteriormente

### Endpoints a probar
- POST `/api/v1/categories` (crear categoría)
- GET `/api/v1/categories/{id}` (consultar categoría creada)
- POST `/api/v1/products` (crear producto asociado a la categoría)
- GET `/api/v1/products/{id}` (verificar que el producto tiene la categoría asociada)
- GET `/api/v1/categories/{id}/products` (verificar que el producto aparece en la lista de productos de la categoría)
- GET `/api/v1/categories` (verificar que la categoría creada está en la lista de categorías)
- GET `/api/v1/products` (verificar que el producto creado está en la lista de productos y tiene la categoría asociada)
---


### 🔥 El Flujo Principal (E2E)

```text
1. Login → obtener token
2. Crear usuario
3. Crear categoría
4. Crear producto (usando categoría)
6. Consultar producto creado

```

## Instrucciones de la Misión

**1. Inicializar tu Dojo (Proyecto desde cero)**
- Crea una carpeta nueva en tu computadora.
- Abre la terminal y ejecuta `npm init playwright@latest`.
- Limpia los archivos de ejemplo y crea tu estructura profesional (`tests/`, `utils/`).

**2. Configuración Global**
- Configura el archivo `playwright.config.js` para establecer la `baseURL: 'https://api.escuelajs.co/api/v1/`.

**3. Crear Funciones de Apoyo (Modularidad)**
- En la carpeta `utils/`, crea un archivo JS.
- Desarrolla una función que genere un JSON dinámico para un producto (ej. un título aleatorio, un precio aleatorio). 

**4. Ejecución y Reporte**
- Ejecuta tu proyecto completo desde la terminal.
- Abre el reporte (`npx playwright show-report`) y verifica visualmente que todos tus pasos y aserciones estén en verde ✅.

**5. Entrega**
- Sube tu proyecto a una carpeta dedicada en tu repositorio personal de GitHub/GitLab.

---

### Mensaje para tu entrega:
> Usa el archivo `README.md` de tu proyecto para detallar tu entrega. Explícanos cómo organizaste las carpetas y cómo lograste pasar el ID del producto al Carrito.
>
> 🛑 **¡Regla de Oro de Git!** Recuerda agregar `node_modules/`, `playwright-report/` y `test-results/` a tu archivo `.gitignore` antes de hacer commit. No subas archivos temporales.

- Libreria Faker para generar datos dinámicos: https://fakerjs.dev/guide/

---

### 👈 Volver al [Stage 2](../README.md)