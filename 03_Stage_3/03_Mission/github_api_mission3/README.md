# Mission 3 — Probando GitHub API

Proyecto de automatización de la [GitHub REST API](https://docs.github.com/en/rest) con **Playwright** y **JavaScript**, usando modelos POO, Service Layer, variables de entorno y anotaciones (`describe`, `step`, tags).

> ⚠️ **Esta entrega es un avance.** Ver la sección [Pendiente](#pendiente).

## Estructura

```
github_api_mission3/
├── src/
│   ├── models/
│   │   └── UserResponse.js
│   └── services/
│       └── UserService.js
├── tests/
│   └── users.spec.js
├── casos_de_prueba.md
├── playwright.config.js
├── .env.dev
├── .env.staging
└── .gitignore
```

## Instalación

```bash
npm install
```

## Configurar el token de GitHub

1. Crear un Personal Access Token (classic) en [https://github.com/settings/tokens](https://github.com/settings/tokens) con los permisos `repo` y `user`.
2. Pegarlo en `.env.dev` (y en `.env.staging` si se usa ese ambiente), reemplazando `PEGAR_AQUI`:

```bash
BASE_URL=https://api.github.com
GITHUB_TOKEN=ghp_tu_token_aqui
GITHUB_USERNAME=flecharominaa-bit
ENVIRONMENT=dev
API_TIMEOUT=10000
```

El header `Authorization` solo se envía si `GITHUB_TOKEN` tiene un valor real. Los archivos `.env` y `.env.*` están en el `.gitignore`, así que el token nunca se sube al repositorio.

## Ejecución

```bash
# Toda la suite en dev
npx playwright test

# Solo @smoke
npx playwright test --grep @smoke

# Solo @regression
npx playwright test --grep @regression

# Un archivo específico
npx playwright test tests/users.spec.js

# En staging (bash)
ENV=staging npx playwright test

# En staging (PowerShell)
$env:ENV="staging"; npx playwright test

# Reporte HTML
npx playwright show-report
```

## Tests implementados

| Archivo | Test | Tag |
|---|---|---|
| `tests/users.spec.js` | debe obtener un usuario existente con estructura válida | `@smoke` |
| `tests/users.spec.js` | debe devolver 404 al consultar un usuario inexistente | `@regression` |

Los casos de prueba de las 3 historias de usuario están en [casos_de_prueba.md](casos_de_prueba.md).

## Bugs encontrados

Ninguno hasta el momento.

## Pendiente

- **HU2 — Repositorios (POST / GET / PATCH):** casos diseñados en Gherkin en `casos_de_prueba.md`, todavía no automatizados.
- **HU3 — Issues (GET / POST):** casos diseñados en Gherkin en `casos_de_prueba.md`, todavía no automatizados.
- Colección de Postman exportada al proyecto.
