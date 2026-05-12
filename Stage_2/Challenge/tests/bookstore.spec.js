import { test, expect } from '@playwright/test';
import { generarUsuarioAleatorio } from '../utils/dataGenerator';

// Usamos .serial para que si el paso 1 falla, no intente los demás.
test.describe.serial('Challenge 2: Automatización Book Store API', () => {
    
    // Variables para guardar datos entre un test y otro
    let userId;
    let userName;
    let password;
    let token;
    let isbn;

    // Antes de empezar, generamos las credenciales únicas con nuestra utilidad
    test.beforeAll(() => {
        const usuario = generarUsuarioAleatorio();
        userName = usuario.userName;
        password = usuario.password;
    });

    test('Paso 1: POST /Account/v1/User - Crear usuario', async ({ request }) => {
        const response = await request.post('/Account/v1/User', {
            data: { userName, password }
        });
        
        expect(response.status()).toBe(201); // Verificamos creación exitosa
        const body = await response.json();
        userId = body.userID; 
        console.log(`✅ Usuario creado: ${userName}`);
    });

    test('Paso 2: POST /Account/v1/GenerateToken - Obtener Token', async ({ request }) => {
        const response = await request.post('/Account/v1/GenerateToken', {
            data: { userName, password }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        token = body.token; // Guardamos el token para los siguientes pasos
        expect(body.status).toBe('Success');
        console.log('✅ Token generado correctamente');
    });

    test('Paso 3: GET /Account/v1/User/{userId} - Verificar registro', async ({ request }) => {
        // Este endpoint requiere el token en el header
        const response = await request.get(`/Account/v1/User/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.username).toBe(userName);
        console.log('✅ Registro verificado en el perfil');
    });

    test('Paso 4: GET /BookStore/v1/Books - Buscar libro y extraer ISBN', async ({ request }) => {
        const response = await request.get('/BookStore/v1/Books');
        
        expect(response.status()).toBe(200);
        const body = await response.json();
        
        // Tomamos el ISBN del primer libro de la lista
        isbn = body.books[0].isbn;
        console.log(`📖 Libro seleccionado: ${body.books[0].title} (ISBN: ${isbn})`);
    });

    test('Paso 5: POST /BookStore/v1/Books - Agregar libro al usuario', async ({ request }) => {
        const response = await request.post('/BookStore/v1/Books', {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                userId: userId,
                collectionOfIsbns: [{ isbn: isbn }] // Formato que pide la API
            }
        });

        expect(response.status()).toBe(201);
        const body = await response.json();
        // Validamos que el ISBN devuelto sea el que enviamos
        expect(body.books[0].isbn).toBe(isbn);
        console.log('🏁 Libro agregado con éxito. ¡Reto completado!');
    });
});