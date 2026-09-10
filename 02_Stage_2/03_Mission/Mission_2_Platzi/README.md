# Mission 2 - Platzi Fake Store API (Entrega parcial)

Mission #2 - Stage 2 | API Testing con Playwright

## 🎯 Objetivo

Validar los principales módulos de la Platzi Fake Store API (`https://api.escuelajs.co`), demostrando manejo de tokens, encadenamiento de requests y modularización (services).

> ⚠️ **Esta es una entrega parcial.** Cubre los módulos Auth y Products. Quedan pendientes para la entrega final: Users, Categories y Files (upload).

## 📋 Casos de prueba cubiertos

### 🔐 Auth
- Login con credenciales válidas devuelve un `access_token`.
- Login con credenciales inválidas es rechazado (401).
- El perfil autenticado (`/auth/profile`) corresponde al usuario logueado.

### 📦 Products
- El listado de productos responde 200 y devuelve un array.
- Cada producto trae los campos esperados (`id`, `title`, `price`, `description`, `category`, `images`).
- Obtener un producto por id devuelve ese mismo id.

## 🚀 Ejecución

```bash
npm install
npx playwright test
npx playwright show-report
```

## 📁 Estructura

```
├── src/
│   └── services/
│       ├── AuthService.js       # login, profile
│       └── ProductService.js    # listado y detalle de productos
├── tests/
│   └── mission2.spec.js
├── package.json
└── playwright.config.js
```

## ⚙️ Configuración

- **Base URL:** `https://api.escuelajs.co/api/v1`
- **Usuario de prueba:** cuenta pública de ejemplo publicada en la documentación de la API (`john@mail.com`).

---
*Nota: los tests fueron escritos contra la documentación y respuestas reales de la API, pero aún no se ejecutaron en un entorno con salida a internet completa — correr `npx playwright test` antes de enviar a revisión.*
