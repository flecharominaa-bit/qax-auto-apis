# Exercise 01: Construyendo un proyecto profesional desde cero con TypeScript

En este ejercicio vas a dar el salto de escribir tests funcionales…  
a construir una **arquitectura profesional tipada con TypeScript**.

Vas a reemplazar los modelos en JavaScript por **interfaces**,  
organizar tu proyecto por módulos reales, y empezar a trabajar como lo harías en un equipo profesional.

Además, vas a introducir conceptos clave como:

- Tipado fuerte con TypeScript
- Separación por capas (tests, services, types, helpers)
- Generación de datos dinámicos
- Preparación para Data Driven Testing

El resultado será un proyecto más **robusto, escalable y mantenible**.

---

## 🎯 Al finalizar este ejercicio, el ninja podrá:

- Crear un proyecto Playwright usando TypeScript desde cero.
- Configurar `tsconfig.json` correctamente.
- Definir interfaces para tipar requests y responses.
- Implementar un `AuthService` tipado.
- Generar datos dinámicos usando helpers.
- Organizar tests por módulos funcionales.
- Preparar el proyecto para pruebas Data Driven.

---

## 🛒 Historia de Usuario — Gestión de inventario

**Como** gestor de inventario,  
**Quiero** consultar y crear productos en el catálogo  
**Para** verificar que la API gestiona correctamente los recursos

- **Base URL:** `https://api.restful-api.dev`
- **Endpoints:** `GET /objects/{id}` y `POST /objects`
- **Documentación:** [API Docs](https://restful-api.dev/)
- **Colección Postman de ejemplo:* [Inventory Management.postman_collection.json](/Assets/03_Stage_3/02_Training/01_Exercise_1/Api%20Testing%20-%20Restfull-Api%20%20QAX.postman_collection.json)

> Es importante tener el Api key, y se logran creando una cuenta free: https://restful-api.dev/sign-in/

---

### Inicializar el proyecto

```bash
mkdir qax_apis_playwright_st4_exe1
cd qax_apis_playwright_st4_exe1

npm init -y
npm install -D @playwright/test typescript ts-node @types/node
npm install dotenv @faker-js/faker
```
### Inicializar TypeScript

```
npx tsc --init
```

### Estructura del proyecto
Crear la siguiente estructura de carpetas y archivos:
```bash
mkdir -p src/{types,services,helpers} tests/{auth,books} && touch src/types/modelos.ts src/services/AuthService.ts src/helpers/dataBuilder.ts tests/auth/generateToken.spec.ts tests/products/productTest.spec.ts .env .gitignore package.json playwright.config.ts
```

```bash
auto_api_testing_stage4/
├── src/
│   ├── types/
│   │   └── modelos.ts
│   ├── services/
│   │   └── AuthService.ts
│   └── helpers/
│       └── dataBuilder.ts
│
├── tests/
│   ├── auth/
│   │   └── generateToken.spec.ts
│   └── products/
│       └── productTest.spec.ts
├── .env
├── .gitignore
├── tsconfig.json
├── package.json
└── playwright.config.ts
```

##  Configurar `tsconfig.json` y `.env`

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "types": ["node", "@playwright/test"]
  }
}

```
```bash
# .env
BASE_URL=https://api.restful-api.dev
```

## [Proyecto de referencia](../../Assets/04_Stage_4/02_Training/01_Exercise_1/qax_apis_playwright_st4_exe1)

---

### 👈 Volver al [Training](./README.md)


