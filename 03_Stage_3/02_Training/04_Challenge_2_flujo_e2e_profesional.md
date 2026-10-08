# Challenge 02: Flujo E2E profesional con toda la arquitectura

En este reto vas a construir un flujo **end-to-end completo** que integra
todo lo aprendido en el Stage 3: modelos, service layer, variables de entorno
y anotaciones. No hay código de ejemplo para los tests — tú decides cómo
estructurarlos. Lo que sí tienes son los criterios de aceptación y las reglas
de calidad que debe cumplir tu entrega.

Este es el reto del ninja que ya construyó las herramientas y ahora las usa
para resolver un problema real de principio a fin.

---

## 🎯 Enfoque

- Diseñar un flujo E2E que cubra: `POST` → `GET` → `PUT` → `PATCH` → `GET` final.
- Aplicar toda la arquitectura: modelos, service layer, variables de entorno y anotaciones.
- Validar que cada operación produce el resultado correcto en el estado del recurso.
- Organizar el código con criterio profesional: qué merece un `step`, qué merece un tag, qué va en `fixme`.

---

## 🛒 Historia de Usuario — Ciclo de vida completo de un producto

**Como** analista QA de QAXpert,  
**Quiero** automatizar el ciclo de vida completo de un producto en el catálogo  
**Para** garantizar que la API gestiona correctamente creación, consulta, reemplazo y actualización parcial

- **Base URL:** `https://api.restful-api.dev`
- **Endpoints:** `POST /objects`, `GET /objects/{id}`, `PUT /objects/{id}`, `PATCH /objects/{id}`

---

## 📋 Criterios de Aceptación

### 1. `POST /objects` — Crear
- Retorna `200` con un `id` generado y no vacío.
- El `name` en el response coincide con el enviado.
- Si se envía `data.price`, debe ser mayor a `0` en el response.

### 2. `GET /objects/{id}` — Consultar tras creación
- Retorna `200`.
- El `id` coincide con el obtenido en el POST.
- El `name` y `data` coinciden con lo creado.

### 3. `PUT /objects/{id}` — Reemplazar completamente
- Retorna `200`.
- El response refleja **exactamente** el nuevo payload enviado.
- El `name` del response es el nuevo nombre, no el original.

### 4. `GET /objects/{id}` — Verificar reemplazo
- El objeto retornado corresponde al payload del PUT, no al del POST.
- El `name` es el nuevo nombre.

### 5. `PATCH /objects/{id}` — Actualizar parcialmente
- Retorna `200`.
- Solo el campo enviado cambia en el response.
- El `name` original (del PUT) se conserva si no fue parte del PATCH.

### 6. `GET /objects/{id}` — Verificar actualización parcial
- El campo parcheado tiene el nuevo valor.
- Los campos no parcheados conservan el valor del PUT.

---

## 🔧 Reglas de calidad del código

Tu entrega debe cumplir estas reglas para considerarse profesional:

| Regla | Descripción |
|---|---|
| Sin hardcoding | Ninguna URL, token o dato de ambiente escrito directamente en el código |
| Modelos siempre | Todo request usa `ProductRequest.toJSON()`, todo response usa `ProductResponse` |
| Service Layer | Los tests nunca llaman a `request.get/post/put/patch` directamente |
| Anotaciones con criterio | `describe` agrupa, `step` documenta flujos de más de 3 validaciones, tags aplicados |
| ID encadenado | El `id` del POST se reutiliza en todos los pasos siguientes — nunca hardcodeado |
| Snapshot before/after | Guardar el estado antes del PATCH para comparar después |

---

## 📂 Instrucciones

### Paso 1 — Crear el archivo de tests

Crea un nuevo archivo:

```
tests/product_lifecycle.spec.js
```

### Paso 2 — Implementar el flujo completo

El flujo debe estar contenido en un único `test` con `test.step` para cada operación,
dentro de un `test.describe` apropiado. El `id` del producto debe fluir entre todos los pasos
como una variable local del test — no como constante hardcodeada.

Estructura sugerida (sin código):

```
test.describe('Product Lifecycle E2E @regression')
  └── test('ciclo de vida completo de un producto @regression')
        ├── step: POST - Crear el producto inicial
        ├── step: GET - Verificar la creación
        ├── step: PUT - Reemplazar el producto completo
        ├── step: GET - Verificar el reemplazo total
        ├── step: PATCH - Actualizar parcialmente el precio
        └── step: GET - Verificar que solo el precio cambió
```

### Paso 3 — Agregar un test negativo

Agrega al menos un test negativo dentro del mismo `describe`:

```
test('debe retornar error al hacer PUT con body vacío @regression')
```

> Pista: ¿qué status devuelve la API si envías un `PUT` sin body o con body inválido?
> Investígalo primero en Postman o en el navegador, luego automatízalo.

### Paso 4 — Marcar lo que no aplica

Identifica al menos un escenario que no puedas probar con esta API pública
(por ejemplo: autenticación, eliminación real, o validación de campos obligatorios)
y márcalo con `test.skip` o `test.fixme` con un comentario que explique el motivo.

### Paso 5 — Ejecutar en ambos ambientes

```bash
# Dev
npx playwright test tests/product_lifecycle.spec.js

# Staging
ENV=staging npx playwright test tests/product_lifecycle.spec.js

# Solo regression
npx playwright test --grep @regression
```
---

### Entrega
- Sube tu código a tu repositorio personal de GitHub.
- Menciona a tu mentor en un Pull Request para que pueda revisar tu código y darte


---

## 💡 Tip ninja for testing

El flujo E2E no es solo una cadena de requests. Es la historia de un recurso:
nace en el POST, es verificado en el GET, es reemplazado en el PUT y es ajustado en el PATCH.
Si en algún punto del flujo el estado no coincide con lo esperado, el test te lo dice exactamente dónde.

Eso es lo que hace diferente a un tester automatizador: no solo ejecuta pruebas, cuenta historias con código.

---

### 👈 Volver al [Training](./README.md)