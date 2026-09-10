# 🌱 Warm Up #3 – Implementaciones avanzadas en API Testing con Playwright

Este repositorio contiene la resolución del Warm Up #3, enfocada en la creación de un framework de pruebas de API escalable utilizando la API de JSONPlaceholder.

## 🚀 Puntos Implementados

1. **Modelos de Datos (POO):** 
   - Uso de clases `PostRequest` para serialización de bodies.
   - Uso de clases `PostResponse` para deserialización y validaciones personalizadas.

2. **API Service Layer:** 
   - Implementación de la clase `PostService` para centralizar todas las peticiones HTTP, separando la lógica de la API de la lógica del test.

3. **Variables de Entorno:** 
   - Configuración de `dotenv` para manejar la `BASE_URL` desde un archivo `.env`, evitando hardcodeo en los tests.

4. **Anotaciones de Playwright:** 
   - Uso de `test.describe`, `test.step`, y tags como `@smoke` y `@regression` para organizar la ejecución.

## 📁 Estructura de Carpetas
```text
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
