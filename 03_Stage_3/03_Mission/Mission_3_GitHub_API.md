# 🥷 Mission #3: Probando GitHub API

Llegaste a la **misión del Stage 3**. Este reto está diseñado para que
pongas en práctica **todo lo aprendido**: modelos POO, API Service Layer,
variables de entorno y anotaciones profesionales, aplicados sobre una API real
usada por millones de desarrolladores en el mundo.

Trabajarás con la **[GitHub REST API](https://docs.github.com/en/rest)**,
automatizando flujos de consulta, creación y actualización de repositorios e issues,
con autenticación real usando un Personal Access Token.

---

## 🎯 Al finalizar esta misión podrás

- Configurar autenticación con token en variables de entorno de forma segura.
- Diseñar e implementar un **Service Layer** para múltiples recursos (usuarios, repos, issues).
- Crear **modelos de Request y Response** para cada operación de la API.
- Escribir un flujo **E2E completo** encadenando el `id` entre operaciones.
- Validar estructuras complejas: objetos anidados, arrays y tipos de datos.
- Aplicar anotaciones (`describe`, `step`, `skip`, `fixme`, tags) con criterio profesional.
- Correr la misma suite apuntando a diferentes ambientes sin modificar el código.

---

## 🔑 Autenticación en GitHub API

Algunas operaciones de GitHub (crear repos, crear issues) requieren autenticación.

### Paso 1 — Crear tu Personal Access Token (PAT)

1. Ve a: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Clic en **"Generate new token"** → selecciona **"Generate new token (classic)"**
3. Dale un nombre descriptivo: `qax-automation-token`
4. Selecciona estos permisos:
    - ✅ `repo` (acceso completo a repositorios)
    - ✅ `user` (leer datos del usuario)
5. Clic en **"Generate token"**
6. **Copia el token inmediatamente** — GitHub no lo muestra de nuevo

### Paso 2 — Guardar el token de forma segura

El token va en tu archivo `.env`, **nunca en el código**:

```bash
# .env.dev
BASE_URL=https://api.github.com
GITHUB_TOKEN=ghp_tu_token_aqui
GITHUB_USERNAME=tu_usuario_github
ENVIRONMENT=dev
```

> ⚠️ Si subes el token a GitHub, GitHub lo detecta y lo invalida automáticamente.
> Asegúrate de que `.env` esté en tu `.gitignore`.

---

## 🧪 Historia de Usuario 1 — Consultar información de un usuario

**Como** analista QA,  
**Quiero** consultar información de un usuario de GitHub  
**Para** validar estructura, tipos y reglas básicas del endpoint

### Criterios de Aceptación

| Campo | Tipo | Regla |
|---|---|---|
| `login` | string | No vacío |
| `id` | number | Mayor a 0 |
| `avatar_url` | string | Empieza con `https://` |
| `repos_url` | string | URL válida |
| `type` | string | Presente |

> **Documentación técnica:** [`GET /users/{username}` — Get a user](https://docs.github.com/en/rest/users/users#get-a-user)

> 📥 **Colección de Postman:** [`Assets/03_Stage_3/03_Mission/GitHub_API_Mission_3.postman_collection.json`](../../Assets/03_Stage_3/03_Mission/GitHub_API_Mission_3.postman_collection.json)

---





## 🧪 Historia de Usuario 2 — Repositorios: crear, consultar y actualizar

**Como** analista QA,  
**Quiero** crear un repositorio, consultarlo y actualizarlo parcialmente  
**Para** validar el ciclo de vida completo del recurso

> **Documentación técnica:**
> - [`POST /user/repos` — Create a repository](https://docs.github.com/en/rest/repos/repos#create-a-repository-for-the-authenticated-user)
> - [`GET /repos/{owner}/{repo}` — Get a repository](https://docs.github.com/en/rest/repos/repos#get-a-repository)
> - [`PATCH /repos/{owner}/{repo}` — Update a repository](https://docs.github.com/en/rest/repos/repos#update-a-repository)

---

## 🧪 Historia de Usuario 3 — Issues: listar y crear

**Como** analista QA,  
**Quiero** listar y crear issues en un repositorio  
**Para** validar la estructura y comportamiento del endpoint

> **Documentación técnica:**
> - [`GET /repos/{owner}/{repo}/issues` — List repository issues](https://docs.github.com/en/rest/issues/issues#list-repository-issues)
> - [`POST /repos/{owner}/{repo}/issues` — Create an issue](https://docs.github.com/en/rest/issues/issues#create-an-issue)

---

## ▶️ Comandos de ejecución

```bash
# Correr toda la suite en dev
npx playwright test

# Correr solo @smoke
npx playwright test --grep @smoke

# Correr solo @regression
npx playwright test --grep @regression

# Correr un archivo específico
npx playwright test tests/repos.spec.js

# Correr en staging
ENV=staging npx playwright test

# Ver reporte HTML
npx playwright show-report
```

---

## 📤 Instrucciones de entrega

1. Diseña los casos de prueba para cada historia de usuario en gherkin.
2. Crea la coleccion de postman con los endpoints a probar y exportala a tu proyecto. 
3. Crea un proyecto con la estructura del proyecto completa con todos los archivos. 
4. Ejecuta la suite completa y verifica que los tests pasan. 
5. Si algún test falla por comportamiento inesperado de la API, repórtalo como bug en el `README.md` de tu entrega. 
---
### El `README.md` de tu entrega debe incluir

- Descripción breve del proyecto
- Instrucciones para instalar y ejecutar
- Cómo configurar el token de GitHub
- Lista de tests implementados con su tag
- Bugs encontrados (si aplica)

---
### Entrega
- Sube tu código a tu repositorio personal de GitHub.
- Menciona a tu mentor en un Pull Request para que pueda revisar tu código y darte

---

### 👈 Volver al [Stage 3](../README.md)