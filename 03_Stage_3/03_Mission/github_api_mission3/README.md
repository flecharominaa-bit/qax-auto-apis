# Mission 3 — Probando GitHub API

Proyecto de automatización de la [GitHub REST API](https://docs.github.com/en/rest) con **Playwright** y **JavaScript**, usando modelos POO, Service Layer, variables de entorno y anotaciones (`describe`, `step`, tags).

## Estructura

```
github_api_mission3/
├── src/
│   ├── models/
│   │   ├── UserResponse.js
│   │   ├── RepoRequest.js
│   │   ├── RepoResponse.js
│   │   ├── IssueRequest.js
│   │   └── IssueResponse.js
│   └── services/
│       ├── UserService.js
│       ├── RepoService.js
│       └── IssueService.js
├── tests/
│   ├── users.spec.js
│   ├── repos.spec.js
│   └── issues.spec.js
├── casos_de_prueba.md
├── GitHub_API_Mission_3.postman_collection.json
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
| `tests/repos.spec.js` | ciclo de vida de un repositorio: crear, consultar y actualizar la descripción (POST → GET → PATCH → GET) | `@smoke` |
| `tests/repos.spec.js` | debe devolver 422 al crear un repositorio con un nombre ya existente | `@regression` |
| `tests/repos.spec.js` | debe devolver 401 al crear un repositorio sin token | `@regression` |
| `tests/repos.spec.js` | debe devolver 404 al consultar un repositorio inexistente | `@regression` |
| `tests/issues.spec.js` | debe crear un issue con estructura y tipos válidos | `@smoke` |
| `tests/issues.spec.js` | debe listar los issues del repositorio e incluir el creado | `@smoke` |
| `tests/issues.spec.js` | debe devolver 422 al crear un issue sin título | `@regression` |
| `tests/issues.spec.js` | debe devolver 404 al listar issues de un repositorio inexistente | `@regression` |

Los casos de prueba de las 3 historias de usuario están en [casos_de_prueba.md](casos_de_prueba.md).

**Notas:**

- Cada corrida crea 2 repositorios privados con nombre único (`inventario-tienda-<timestamp>` y `reservas-turnos-peluqueria-<timestamp>`). Los tests no los borran, porque eso requiere el permiso `delete_repo` en el token.
- `repos.spec.js` e `issues.spec.js` corren en modo `serial`: los casos negativos (nombre duplicado, issue sin título) y el listado de issues reutilizan el repositorio creado por el primer test.

## Colección de Postman

[GitHub_API_Mission_3.postman_collection.json](GitHub_API_Mission_3.postman_collection.json) incluye todos los endpoints de HU1, HU2 y HU3. Antes de usarla hay que completar las variables de la colección `{{baseUrl}}`, `{{token}}`, `{{username}}` y `{{repo}}`.

## Bugs encontrados

No se encontraron bugs.

## Observaciones

El listado de issues de GitHub (`GET /repos/{owner}/{repo}/issues`) tiene consistencia eventual: tarda unos segundos en reflejar un issue recién creado. Si se consulta inmediatamente después del `POST`, responde 200 con un array vacío `[]`, y unos segundos después el issue ya aparece.

Por eso el test de listado usa `expect.poll`, que reintenta el GET hasta que aparece el issue (con un máximo de 15 segundos).
