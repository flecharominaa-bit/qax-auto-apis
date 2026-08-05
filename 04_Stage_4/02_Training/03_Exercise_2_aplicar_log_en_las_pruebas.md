# Exercise 02: aplicar logs en las pruebas de Apis

En este ejercicio vas a elevar la calidad aplicando logs en tus pruebas de APIs.

Al finalizar este ejercicio, el ninja podrá:

- Integrar logs en sus pruebas de APIs para mejorar la trazabilidad y el debugging.
- Configurar diferentes niveles de log (info, warning, error) para categorizar la información registrada.
- Personalizar el formato de los logs para incluir información relevante como timestamps, nombres de tests y detalles de las requests/responses.
- Guardar los logs en archivos separados por ejecución para facilitar el análisis histórico y la identificación de patrones en los fallos.

---

## Paso Extra — Agregar Logs en tus tests (Visibilidad total)

Cuando tus tests fallan, el problema no es el error…  
es que **no sabes qué pasó antes del error**.

> Aquí es donde entran los **logs**.

---
**Documentación: https://fakerestapi.azurewebsites.net/index.html**
###  ¿Para qué sirven los logs?

- Ver qué datos estás enviando
- Ver qué responde la API
- Entender rápido por qué falló un test

---

### Regla simple

> “Si no puedes ver lo que enviaste y lo que recibiste… estás debuggeando a ciegas.”

---

### [Proyecto referencia](../../Assets/04_Stage_4/02_Training/02_Exercise_2/qax_apis_playwright_st4_exe2)

---

### Tip QAXpert
```
“Un tester junior mira el error…
un tester pro mira los logs antes del error.”
```
---

### 👈 Volver al [Training](./README.md)
