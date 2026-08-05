import { test, expect } from '@playwright/test';
import { generarUsuario } from '../utils/dataGenerator';

// .serial obliga a ejecutar los tests en orden. Si falla el registro, no intenta hacer login.
test.describe.serial('Flujo End-to-End: Perfil y Cambio de Contraseña', () => {
    
    // 1. Variables compartidas para todo el flujo
    let tokenAuth;
    let usuarioDinamico;
    let nuevaPassword = 'NewPassword123!';

    // Antes de todos los tests, generamos la data
    test.beforeAll(() => {
        usuarioDinamico = generarUsuario();
    });

    test('Paso 1: Preparación - Registrar y Loguear usuario', async ({ request }) => {
        // Registro
        const resRegistro = await request.post('users/register', {
            data: {
                name: usuarioDinamico.name,
                email: usuarioDinamico.email,
                password: usuarioDinamico.password
            }
        });
        expect(resRegistro.status()).toBe(201);

        // Login inmediato para obtener el token
        const resLogin = await request.post('users/login', {
            data: {
                email: usuarioDinamico.email,
                password: usuarioDinamico.password
            }
        });
        expect(resLogin.status()).toBe(200);

        const bodyLogin = await resLogin.json();
        // ¡Atrapamos el token! y lo guardamos en la variable compartida
        tokenAuth = bodyLogin.data.token;
        console.log('Token obtenido con éxito!');
    });

    test('Paso 2: Consultar Perfil con el Token (GET)', async ({ request }) => {
        const response = await request.get('users/profile', {
            headers: {
                // Inyectamos el token en el header usando la clave exigida por la API
                'x-auth-token': tokenAuth 
            }
        });

        expect(response.status()).toBe(200);
        
        const body = await response.json();
        // Validamos que el perfil devuelto sea exactamente el del usuario que creamos
        expect(body.data.email).toBe(usuarioDinamico.email);
        expect(body.data.name).toBe(usuarioDinamico.name);
    });

    test('Paso 3: Cambiar Contraseña usando el Token (POST)', async ({ request }) => {
        const response = await request.post('users/change-password', {
            headers: {
                'x-auth-token': tokenAuth
            },
            data: {
                currentPassword: usuarioDinamico.password,
                newPassword: nuevaPassword
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe('The password was successfully updated');
    });

});