# Challenge 2 - Automatización Book Store API

Challenge 2 - Stage 2 | API Testing con Playwright

## 🎯 Objetivo

Automatizar el flujo completo de la **Book Store API de DemoQA**: crear un usuario, autenticarse, verificar el registro y agregar un libro a la cuenta del usuario.

## 📋 Casos de prueba

| # | Endpoint | Descripción |
|---|----------|-------------|
| 1 | `POST /Account/v1/User` | Crear usuario con credenciales generadas aleatoriamente |
| 2 | `POST /Account/v1/GenerateToken` | Generar token de autenticación |
| 3 | `GET /Account/v1/User/{userId}` | Verificar que el usuario quedó registrado correctamente |
| 4 | `GET /BookStore/v1/Books` | Buscar un libro disponible y extraer su ISBN |
| 5 | `POST /BookStore/v1/Books` | Agregar el libro a la colección del usuario |

Los tests corren en serie (`test.describe.serial`), ya que cada paso depende de datos generados en el paso anterior (userId, token, isbn).

## 🚀 Ejecución

```bash
# Instalar dependencias (primera vez)
npm install

# Ejecutar tests
npx playwright test

# Ver reporte HTML
npx playwright show-report
```

## 📁 Estructura

```
├── tests/
│   └── bookstore.spec.js    # 5 tests en serie
├── utils/
│   └── dataGenerator.js     # Generación de usuario/contraseña aleatorios (Faker)
├── package.json
└── playwright.config.js
```

## ⚙️ Configuración

- **Base URL:** `https://demoqa.com`
- **Datos de usuario:** generados con Faker en `beforeAll`, cumpliendo las reglas de contraseña de DemoQA (mayúscula, 10 letras + símbolo/número)

---
*Challenge para reforzar encadenamiento de requests (IDs y tokens dinámicos) en pruebas de API.*
