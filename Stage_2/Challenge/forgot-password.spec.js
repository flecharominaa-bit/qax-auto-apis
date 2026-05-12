const { test, expect } = require('@playwright/test');
const { generarUsuario } = require('../utils/dataGenerator');
const { crearCuentaCorreo, obtenerUltimoCorreo } = require('../utils/emailReader');

test.describe('Flujo de Recuperación de Contraseña', () => {
  // Variables para compartir datos entre el registro y el test
  let user;
  let resetToken;
  const baseUrl = 'https://practice.expandtesting.com/notes/api';
  const newPassword = 'NewSecurePassword2026!';

  // --- PASO 1: REGISTRO CON EMAIL REAL ---
  test.beforeAll(async ({ request }) => {
    const datosBase = generarUsuario();
    const nombreLimpio = datosBase.name.replace(/\s/g, '').toLowerCase();
    
    // Creamos la cuenta real para poder recibir el link
    const cuentaReal = await crearCuentaCorreo(nombreLimpio, 'Pass12345!');
    
    user = {
      name: datosBase.name,
      email: cuentaReal.email,      
      tokenMail: cuentaReal.token,  // Guardamos la llave para leer el buzón después
      password: datosBase.password
    };

    const response = await request.post(`${baseUrl}/users/register`, {
      data: { 
        name: user.name, 
        email: user.email, 
        password: user.password 
      }
    });

    expect(response.status()).toBe(201);
    console.log(`Usuario registrado con éxito: ${user.email} ✅`);
  });

  // --- PASO 2: EL TEST E2E ---
  test('Debe completar el flujo: Recuperar -> Verificar -> Resetear -> Login', async ({ request }) => {
    
    // 1. Solicitar recuperación
    const forgotResponse = await request.post(`${baseUrl}/users/forgot-password`, {
      data: { email: user.email }
    });
    expect(forgotResponse.status()).toBe(200);
    console.log('Solicitud enviada, esperando correo...');

    // 2. Leer el correo (Damos 5 segundos para que llegue al servidor de Mail.tm)
    await new Promise(resolve => setTimeout(resolve, 5000)); 
    
    const textoDelCorreo = await obtenerUltimoCorreo(user.tokenMail); 
    console.log('Contenido del correo recibido:', textoDelCorreo);

    // Extraemos el token del enlace usando una expresión regular
// Buscamos el código que viene después de 'reset-password/'
    const match = textoDelCorreo.match(/reset-password\/([a-zA-Z0-9]+)/);
    resetToken = match ? match[1] : null;   
    
    console.log('Token atrapado:', resetToken);
    expect(resetToken, 'No se encontró el token en el email').not.toBeNull();

    // 3. Verificar el Token
    const verifyResponse = await request.post(`${baseUrl}/users/verify-reset-password-token`, {
      data: { token: resetToken }
    });
    expect(verifyResponse.status()).toBe(200);
    console.log('Token verificado ✅');

    // 4. Restablecer la contraseña
    const resetResponse = await request.post(`${baseUrl}/users/reset-password`, {
      data: { 
        token: resetToken, 
        newPassword: newPassword 
      }
    });
    expect(resetResponse.status()).toBe(200);
    console.log('Contraseña cambiada con éxito ✅');

    // 5. Login final para confirmar que la nueva clave funciona
    const loginResponse = await request.post(`${baseUrl}/users/login`, {
      data: { 
        email: user.email, 
        password: newPassword 
      }
    });
    
    const loginBody = await loginResponse.json();
    expect(loginResponse.status()).toBe(200);
    expect(loginBody.success).toBe(true);
    console.log('¡Login exitoso! Flujo E2E completado ');
  });
});