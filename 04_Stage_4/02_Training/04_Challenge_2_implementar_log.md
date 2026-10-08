# Challenge 02: Implementación de Logs

En el `Exercise_1`construimos un framework estructurado con servicios y modelos para interactuar con la API y validar respuestas. Sin embargo, actualmente las pruebas no registran el detalle de las peticiones.

En este ejercicio, implementaremos un sistema de Logs para capturar la información exacta de lo que se envía al servidor y lo que este responde. Esto es necesario para facilitar la depuración (debugging) e identificar rápidamente la causa de los fallos.

---

## Instrucciones del Reto

 Utilizando el proyecto base del `Exercise_1`, implementar un mecanismo de registro (Logging) para visualizar y almacenar el detalle de cada petición HTTP realizada por los tests.

1. **Validación del entorno:** Abre [el proyecto](../../Assets/04_Stage_4/02_Training/01_Exercise_1/qax_apis_playwright_st4_exe1) en tu editor y asegúrate de que la suite de pruebas se ejecuta sin errores (`npx playwright test`).
2. **Captura de datos (Request & Response):** Modifica la lógica de las llamadas a la API (ya sea en los servicios o implementando un helper centralizado) para que cada petición capture la siguiente información:
    *   URL completa.
    *   Método HTTP (GET, POST, PUT, DELETE).
    *   Body enviado en el request (si aplica).
    *   Código de estado (Status Code) devuelto por el servidor.
    *   Body de la respuesta del servidor.
3. **Registro de la información:**
    *   *Opción Básica:* Imprimir la información capturada en la terminal utilizando `console.log()` con un formato estructurado.
    *   *Opción Avanzada (Recomendada):* Utilizar el método `test.info().attach()` de Playwright para adjuntar estos datos como un archivo (por ejemplo, en formato JSON) directamente en el reporte HTML de la prueba.
4. **Verificación:** Ejecuta una prueba individual (como la creación de un producto) y valida que los logs generados en la consola o en el reporte contengan los datos correctos de esa transacción.

**Nota técnica:** Evalúa la estructura del código para que el mecanismo de logs sea reutilizable y no requiera duplicar líneas de código en cada archivo de prueba.
---

### Entrega
- Sube tu código a tu repositorio personal de GitHub.
- Menciona a tu mentor en un Pull Request para que pueda revisar tu código y darte

---

### 👈 Volver al [Training](./README.md)