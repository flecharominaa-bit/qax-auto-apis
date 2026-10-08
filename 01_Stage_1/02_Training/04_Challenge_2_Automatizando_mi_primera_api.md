# Challenge 2: Mi primera Automatización de APIs en Playwright

En este reto, tomarás los casos de prueba que creaste en Postman para la API de ExpandTesting (Notes API) en el Challenge 1 y los automatizarás usando Playwright.

El objetivo es que comprendas cómo convertir pruebas manuales (donde tú copias y pegas tokens visualmente) 
en tests automatizados e independientes, estructurando un proyecto desde cero y validando tanto códigos de estado 
como el contenido exacto de las respuestas JSON.

---

## ⚠️ Mensaje de tu Mentor (¡Lee esto antes de empezar!)
>Este reto es mucho más desafiante que el Challenge 1.

Te vas a enfrentar a temas que NO vimos paso a paso en el training, como por ejemplo: 
- ¿Cómo le paso un Token de autorización a mi código para poder ver el perfil? 
- ¿Cómo guardo un dato del Paso 1 para usarlo en el Paso 2?
>Esto está diseñado a propósito. Es una manera de retarte a buscar en la documentación de Playwright y pensar como un Automation QA. 

Haz tu mejor intento, equivócate, rompe el código; eso es parte del aprendizaje.
##### NO ESTÁS SOLO. Si te sientes atascado o la frustración te gana:

- Escribe en nuestro grupo de estudio.
- Manda un correo a tu mentor.
- Sube tu código roto a GitHub, haz un Pull Request y déjanos un comentario ahí mismo.

>O trae tus dudas a nuestra mentoría de seguimiento todos los sábados. ¡Estamos aquí para respaldarte!

---

## Instrucciones

1. Inicia tu proyecto desde cero:

   - Crea una carpeta nueva en tu computadora.
   - Abre la terminal en esa carpeta y ejecuta el comando de instalación de Playwright (npm init playwright@latest).
   - Limpia los archivos de ejemplo que trae por defecto.

2. Escribe los Test Cases:

   - Crea un archivo llamado perfil-seguridad.spec.js.
   - Automatiza los 5 endpoints del Challenge 1 (Perfil, Cambiar Password, Forgot Password, Verificar Token, Reset Password).

>Tip Ninja: Recuerda que tendrás que hacer un Login silencioso al principio de tu prueba para obtener un Token válido.

3. Ejecuta y verifica:

   - Corre tus tests desde la terminal.
   - Lee los errores en la consola si algo falla (¡serán tus mejores maestros!).
   - Asegúrate de que todos los tests pasen (✅) y los resultados en el reporte HTML sean consistentes.

4. Sube tu trabajo:

   - Sube todo el código a la carpeta correspondiente en tu repositorio personal de GitHub.
   - Menciona a tu mentor en un Pull Request para que pueda revisar tu código y darte feedback.

---

**Mensaje para el aprendiz:**

- Usa el archivo `README.md `de tu proyecto para detallar tu entrega. 
- Nunca subas las carpetas pesadas de configuración o reportes locales. Asegúrate de que tu archivo `.gitignore` incluya estas carpetas antes de hacer commit:

  - `node_modules/`
  - `playwright-report/`
  - `test-results/`

---

### 👈 Volver al [Training](./README.md)
