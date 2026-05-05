const { test, expect } = require('@playwright/test');
// Importamos la función desde nuestro archivo utils
const { generarUsernameUnico } = require('../utils'); 

test('POST - Crear usuario con nombre dinámico', async ({ request }) => {
    // Creamos el nombre único usando nuestra función
    const nombreDinamico = generarUsernameUnico();
    
    // Realizamos la petición POST a JSONPlaceholder
    const response = await request.post('https://jsonplaceholder.typicode.com/users', {
        data: {
            name: "Romina QA",
            username: nombreDinamico,
            email: "romina@ejemplo.com"
        }
    });

    // Validamos que el status sea 201 (Creado)
    expect(response.status()).toBe(201);

    // Extraemos el cuerpo de la respuesta en formato JSON
    const responseBody = await response.json();
    
    // Mostramos el ID y el nombre en la consola
    console.log('--- RESULTADO DE LA TAREA ---');
    console.log('ID del usuario creado:', responseBody.id);
    console.log('Username enviado:', responseBody.username);
});