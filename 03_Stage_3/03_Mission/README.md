# 🥷 Mission Final — Proyecto Profesional de API Testing con TypeScript

Llegaste al punto donde ya no estás “aprendiendo herramientas”…  
estás construyendo **proyectos reales como Automation QA**.

En esta misión vas a integrar todo lo que aprendiste:

- TypeScript
- Interfaces
- Service Layer
- Logs
- Buenas prácticas de estructura

>  Básicamente: vas a pasar de “hacer tests” a **construir un framework de automatización profesional** con Typesript.

---

##  Objetivo

Construir un proyecto completo de API Testing usando Playwright + TypeScript  
aplicando arquitectura profesional, tipado, logs y buenas prácticas.

---

## Contexto de la misión

Vas a reutilizar:

- ✅ La **misma API**
- ✅ La **misma historia de usuario**
- ✅ El mismo flujo trabajado en la [misión anterior](../../03_Stage_3/03_Mission/README.md)


 Pero ahora con nivel PRO:
> Tipado + arquitectura + visibilidad (logs)

---

##  Instrucciones

### 1. Crear el proyecto desde cero en TypeScript

- Configurar `tsconfig.json`
- Usar `playwright.config.ts`
- Organizar carpetas (`types`, `services`, `helpers`, `tests`)

---

### 2. Implementar interfaces

- Crear interfaces para:
    - Requests
    - Responses

> Nada de `any`… aquí ya juegas en ligas mayores.

---

### 3. Implementar Service Layer

- Centralizar todos los requests en servicios
- Ejemplo:
    - `AuthService`
    - `ActivityService` o el recurso que estés usando

---

### 4. Implementar logs

Agregar logs en puntos clave:

- Antes del request
- Después del response

Ejemplo:

```ts
console.log('📤 Request:', data);
console.log('📥 Response:', body);
```

### 5. Aplicar buenas prácticas


- No hardcodear datos
- Separar lógica de tests
- Tests legibles
- Uso de `test.step()`

### 6. Crear tests completos

- Flujo funcional (E2E)
- Validaciones claras con `expect`
- Uso del Service Layer

## Entrega
- Sube tu proyecto a una carpeta dedicada en tu repositorio personal de GitHub
- Mencionar al mentor para revisión

## 🚀 Paso final (OBLIGATORIO)
Una vez aprobado por tu mentor:
1. Crear repositorio dedicado
   - Solo para este proyecto
   - Nombre recomendado: `qax-playwright-api-github`

2. Subir a GitHub
    - Con README explicando: 
      - Arquitectura
      - Uso de interfaces
      - Service Layer
      - Logs

3. Publicar en LinkedIn
   Aquí es donde empiezas a verte como profesional 👇

**📢 Post recomendado para LinkedIn**
```
🚀 Este es mi proyecto final de API TestingAcabo de completar mi entrenamiento en APIs dentro del 
programa QA PRO Level y quiero compartir uno de los proyectos más importantes que desarrollé.
En este proyecto trabajé con Playwright + TypeScript aplicando buenas prácticas reales de automatización:
✅ Implementación de arquitectura profesional  
✅ Uso de interfaces para tipado de datos  
✅ Aplicación de Programación Orientada a Objetos (POO)  
✅ Creación de un Service Layer para manejar los endpoints  
✅ Implementación de logs para debugging y trazabilidad  

Este proceso no solo fue aprender herramientas, fue entender cómo construir soluciones escalables como Automation QA.
Aquí pueden ver el proyecto: [TU LINK DE GITHUB]

Gracias a @QAXpert por el acompañamiento en este proceso 
🙌#QA #AutomationTesting #Playwright #TypeScript #APITesting #QAXpert
```

---

### 👈 Volver al [Stage 4](../README.md)