# Exercise #1 | Validando mi entorno local

Antes de escribir una sola línea de código, necesitamos preparar nuestro espacio de trabajo. En esta parte del entrenamiento aprenderás a configurar tu IDE (Entorno de Desarrollo Integrado) con las extensiones esenciales que te harán la vida más fácil como automatizador.

Exploraremos cómo usarlas para escribir código más rápido, detectar errores antes de ejecutar, y navegar por tus proyectos con fluidez.


## Goal
* Optimizar la productividad al crear pruebas automatizadas con accesos directos y fragmentos de código listos para usar
* Ejecutar y depurar pruebas fácilmente desde el propio editor, sin necesidad de usar la terminal manualmente
* Visualizar resultados de ejecución y reportes dentro del entorno, facilitando el análisis y corrección de errores.
* Aprovechar el autocompletado y resaltado de sintaxis, mejorando la legibilidad y reduciendo errores de escritura en los scripts.
* Integrar la experiencia completa de Playwright, desde la configuración hasta la ejecución, dentro de un solo entorno de desarrollo.


---

### Instalación de extensiones


1. Abre VS Code → Extensiones (⌘⇧X / Ctrl+Shift+X).

    * Busca e instala:

    * “Playwright for VS Code” (Microsoft).

    * “Playwright Test Snippets” (Mark Skelton).

> Reinicia VS Code si te lo solicita.

>Alternativa: Cmd/Ctrl+Shift+P → “Extensions: Install Extensions” y escribe los nombres tal cual.

### Configuracion Playwright for VS Code

1. Abre Settings (⌘, / Ctrl+,) y ajusta:

    Playwright: Enable Test Explorer → ✅

    Playwright: Reuse Browser → ✅ (más velocidad)

    Playwright: Trace → on-first-retry o on (según tu CI/flujo)


### Uso diario — Playwright for VS Code

- Explorador de Tests (barra lateral): corre todos o por archivo/suite/caso con un clic.

- Gutter Icons (iconos junto a test()/it()): Run / Debug por prueba.

- Depurar: coloca breakpoints y usa Debug Test para inspeccionar variables, pasos y selectores.

- Trazas (Trace Viewer): al fallar, abre la traza directamente en VS Code (timeline, consola, red, snapshots).

- Codegen / Grabación: Cmd/Ctrl+Shift+P → “Playwright: Record new test” para generar pasos y selectores.

- Selectores: Cmd/Ctrl+Shift+P → “Playwright: Pick locator” y apunta en el navegador para copiar el locator ideal.

[![Playwright Test Explorer](../../Assets/02_Stage_2/02_Training/01_Exercise_1/pw.png)

### Flujo recomendado:

- Escribe o pega un test → Run individual desde el gutter.

- Si falla → Open Trace y corrige.

- Debug Test si necesitas inspección paso a paso.

- Repite hasta verde ✅.


---

### Playwright Test Snippets

Los snippets son fragmentos de código predefinidos que te ayudan a escribir pruebas más rápido sin tener que recordar toda la sintaxis.
Cuando instalas la extensión Playwright Test Snippets en VS Code, puedes escribir atajos como pwt-test, pwt-describe o pwt-expect y el editor completará automáticamente la estructura del test.

**Por ejemplo**

- `pw-test` crea una plantilla básica:

- `pw-describe` genera un bloque de pruebas agrupadas, ideal para organizar tus suites.

**Ventajas para el día a día:**

- Ahorra tiempo al escribir código repetitivo.

- Te guía con la estructura correcta de un test.

- Reduce errores de sintaxis.

- Mejora la consistencia de tus scripts.


---

### 👈 Volver al [Training](./README.md)