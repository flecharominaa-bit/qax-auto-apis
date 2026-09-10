# Stage #2: Agudizando la visión del ninja 👀

En esta estación vamos a llevar nuestra automatización de APIs con **Playwright** al siguiente nivel. Imagina que las APIs son como ventanillas de servicio exclusivas: ya sabes cómo llegar con una petición básica (GET, POST), pero ahora necesitas mostrar tu "gafete VIP" (Token de autorización) para que te atiendan.

Usaremos pequeñas y amigables funciones en JavaScript para darle dinamismo a nuestras pruebas, y verás cómo se organiza un proyecto en carpetas bien estructuradas para que tu código no se convierta en un caos. Aprenderás a configurar y enviar un Token a través de los *Headers* (cabeceras) de tus peticiones, tal como lo hacías en la pestaña "Authorization" de Postman.

Además, dominaremos el arte de los **requests dinámicos**: aprenderás a atrapar datos al vuelo (por ejemplo, capturar un ID que la API acaba de crear) para encadenarlo y usarlo automáticamente en tu siguiente petición.

Finalmente, reforzaremos cómo validar a fondo las respuestas en JSON, asegurándote no solo de que la API contesta con un `200 OK`, sino de que la información del negocio es exactamente la correcta.

## 🎯 Goals

- Comprender el uso de funciones sencillas en JavaScript dentro de Playwright para crear pruebas más ordenadas, modulares y fáciles de mantener.

- Conocer la estructura ideal de un proyecto de automatización y entender la importancia de separar las pruebas (tests), las configuraciones y los datos.

- Aprender a inyectar Tokens en los `headers` de las peticiones para autenticar y probar APIs que requieren seguridad.

- Generar flujos (End-to-End) dinámicos, capturando datos de una respuesta (como un ID de usuario o un Token) para encadenarlos en peticiones posteriores.

- Validar respuestas JSON a profundidad, verificando no solo los códigos de estado, sino también tipos de datos y la exactitud de las reglas de negocio.

----

## 📂 Index
- **[Warm Up #2 ](./01_WarmUp/README.md) – Introducción a funciones en JavaScript, variables y estructura de carpetas en Playwright.**
- **[Training #2](./02_Training/README.md) – Peticiones avanzadas: Inyección de Headers, manejo de Tokens y encadenamiento de requests dinámicos.**
- **[Mission #2](./03_Mission/README.md) – Creación de un proyecto y framework de pruebas de API completo desde cero.**

---

### 👈 Volver al [Inicio](../README.md)