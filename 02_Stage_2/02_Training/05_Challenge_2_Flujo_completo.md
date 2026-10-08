# Challenge 2: Automatizando un flujo completo usando Token

En este reto, vamos a automatizar un flujo completo de interacción con la API de libros: desde buscar un libro, extraer el ISBN del primer libro de la lista, hasta agregarlo a un usuario existente. El objetivo es que aprendas a combinar operaciones GET y POST, manejar respuestas JSON y usar valores dinámicos de un request en otro, todo de manera práctica y reproducible en tus tests de automatización.

---

## Historia de Usuario

- Título: Registro y acceso seguro a la Book Store API

  Como usuario/automatizador de pruebas,
  quiero poder registrar un usuario, obtener un token de autenticación y consumir endpoints protegidos con ese token,
  para verificar que la API maneja correctamente el alta de usuarios, la emisión de tokens y el acceso autorizado a información sensible.

- BaseUrl:https://demoqa.com

## Flujo del usuario para agregar un libro

- POST `/Account/v1/User` → crear usuario con userName y password.

- POST `/Account/v1/GenerateToken` → obtener token JWT con userName y password.

- GET `/Account/v1/User/{userId}` → obtener información del usuario, usando Authorization: Bearer <token>.

- GET `BookStore/v1/Books` Obtener la informacion de los libros

- POST `BookStore/v1/Books` → Agregar un libro al usuario, usando Authorization: Bearer <token>.



## Coleccion Postman

> Descargar e importar la colección: [Api Testing - Book Store - QAX.postman_collection V2](/Assets/02_Stage_2/02_Training/03_Challenge_2/Api%20Testing%20-%20Book%20Store%20-%20QAX%20V2.postman_collection.json)

## Casos de prueba

1. Crear usuario con datos inválidos
```
    Dado: Enviar POST /Account/v1/User con:

    userName vacío o

    password que no cumple reglas.

    Entonces: Verificar que la API responda HTTP 400.

    Resultado esperado: status_code == 400 y el cuerpo contiene información de error.
```
2. Generar token con credenciales inválidas
```
  Dado: Usar credenciales incorrectas.

  Entonces: Verificar que la API responda HTTP 200.

  Resultado esperado: status_code en {200} y mensaje de autenticación fallida.`User authorization failed.`
```
3. Acceso protegido sin token o con token inválido
```
  Dado: Realizar petición sin header Authorization o con Bearer <invalid>.

  Entonces: Verificar que la API responda HTTP 401

  Resultado esperado: status_code en {401} y el cuerpo contiene mensaje de acceso denegado. `User not authorized!` y code `1200`
```
4. Buscar libro y agregarlo a un usuario
```
  Dado: Realizar GET /Books o endpoint equivalente para obtener la lista de libros, Extraer el primer ISBN del primer libro del array de resultados

  Cuando: Realiza la peticion para agregar el libro a un usuario

  Entonces: Usar ese ISBN para enviar POST /BookStore/v1/Book/ y agregar un nuevo libro al usuario.

  Resultado esperado:  Status code 201.   Verificar que la respuesta confirme que el libro fue agregado es correctamente.
```
## Instrucciones

> Crear un nuevo proyecto de automatización en Playwright siguiendo la estructura de carpetas vista en el ejercicio anterior.

1. Escribir los casos de prueba en formato Gherkin (BDD) en un archivo `.md`.
2. Crear un archivo de utilidad en la carpeta `utils` para generar datos dinámicos (nombres de usuario y contraseñas aleatorias) usando la librería `@faker-js/faker`.
3. Construir los casos de prueba automatizados en un archivo `.spec.js` dentro de la carpeta `tests`, siguiendo el flujo definido en la historia de usuario y utilizando los datos generados por las funciones de utilidad.
4. Crear un flujo completo que incluya:
    - Registro de usuario.
    - Generación de token.
    - Consulta de perfil de usuario.
    - Búsqueda de libros y extracción del ISBN.
    - Agregar un libro al usuario usando el token para autenticación.
5. Ejecuta y verifica:
    - Corre tus tests.
    - Asegúrate de que todos los tests pasen y los resultados sean consistentes.
   
## Entrega
1. Sube los cambios a tu repositorio personal en GitHub.
2. Menciona a tu mentor para revisión, en el PR que has creado.


---

### 👈 Volver al [Training](./README.md)
