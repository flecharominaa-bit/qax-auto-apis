# QAX Automation APIs — Playwright (Stage 4 — Exercise 1)

Proyecto de tests E2E/API con Playwright para la etapa 4 del programa QA Pro Level, nivel Apis.


1. **La Arquitectura Profesional en 3 Capas:**
   - **`types/` (Interfaces):** El "contrato". Aquí definimos exactamente la forma de los datos que enviamos y esperamos de la API. Si la API cambia, TypeScript nos avisa inmediatamente.
   - **`services/` (Lógica de API):** Aquí encapsulamos la comunicación con la API. Los tests no saben qué URL o headers se usan; solo llaman al servicio.
   - **`tests/` (Los Casos):** Usamos el patrón AAA (Arrange, Act, Assert) para mantener los tests extremadamente legibles.

2. **Manejo de Entornos:**
   Las URLs y tokens sensibles no se hardcodean. Usamos un archivo `.env` y lo inyectamos desde `playwright.config.ts`.

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar Entorno:
Crea o edita el archivo `.env` en la raíz del proyecto:
```env
BASE_URL=https://api.restful-api.dev
API_KEY=tu_valor_aqui
```


## 🧪 Ejecutar Tests

- Toda la suite:
```bash
npm run test
```

- Por etiquetas (Tags):
```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
```

- Abrir el reporte:
```bash
npm run test:report
```

## 📁 Estructura del Proyecto

- `.env` — Variables de entorno (BASE_URL, API_KEY, API_EMAIL, API_PASSWORD).
- `playwright.config.ts` — Configuración global de Playwright (headers inyectados automáticamente).
- `src/types/api.types.ts` — Contratos de datos (Interfaces).
- `src/models/` — Clases para mapear la respuesta sucia de la API a nuestras interfaces limpias.
- `src/services/` — Lógica de conexión (Auth y Products).
- `src/helpers/dataBuilder.ts` — Generación de datos estáticos para las pruebas.
- `tests/` — Specs organizados por funcionalidad (`auth.spec.ts`, `products.spec.ts`).


