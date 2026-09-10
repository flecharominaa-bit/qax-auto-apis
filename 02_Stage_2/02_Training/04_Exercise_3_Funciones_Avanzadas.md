# Exercise 03: Funciones Avanzadas – Consumo de Correos Electrónicos con JS

En este ejercicio, vamos a dar un paso al nivel de un verdadero Automation QA Senior. En el mundo real, muchas APIs no te devuelven el token o la confirmación en la respuesta directamente; en su lugar, **envían un correo electrónico** con un código de verificación (OTP) o un enlace.

Aprenderemos a crear una función avanzada en JavaScript puro que se conecte a un servidor de correos temporales (`Mail.tm`), cree una cuenta al vuelo, busque en la bandeja de entrada, lea el último correo recibido y use **Expresiones Regulares (Regex)** para extraer un código.

Al finalizar este ejercicio, el ninja podrá:
- Comprender cómo interceptar y validar correos electrónicos en pruebas automatizadas usando APIs de terceros.
- Crear funciones asíncronas (`async/await`) nativas de JavaScript fuera del contexto de Playwright.
- Usar la API pública de `Mail.tm` para generar bandejas de entrada dinámicas y leer correos reales.
- Extraer datos específicos de un texto largo (como un Body de correo) usando Regex.


---

## 📖 Historia de Usuario: Verificación por Correo (Simulación)

**Como** usuario nuevo de la plataforma,  
**Quiero** recibir un código de seguridad en mi correo al solicitar una validación,  
**Para** poder ingresarlo en el sistema y activar mi cuenta de forma segura.

### Criterios de Aceptación (Flujo de la Prueba)
1. **Generar buzón:** El sistema de pruebas debe generar una dirección de correo temporal única.
2. **Simular envío (Trigger):** Se debe simular el envío de un correo con un código secreto de 6 dígitos a esa dirección.
3. **Consumo del Correo:** El script de automatización debe conectarse a la bandeja de entrada, abrir el correo y extraer el código de 6 dígitos del texto.
4. **Validación:** El código extraído debe coincidir con el formato esperado (solo números).

---

##  Solución: Creando nuestra función avanzada

> Usaremos el mismo proyecto estructurado de los ejercicios anteriores.

### 1. Crear nuestra función de lectura de correos (`utils/emailReader.js`)


Vamos a usar la API pública y gratuita de `api.mail.tm`. Usaremos la función nativa `fetch` de Node.js (JavaScript puro) para hacer las peticiones HTTP.
Crea el archivo `utils/emailReader.js` y pega esta lógica avanzada:

```javascript
// Función para pausar el código unos segundos (Los correos tardan en llegar)
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 1. Obtiene un dominio válido de Mail.tm
 */
async function obtenerDominio() {
    const response = await fetch('https://api.mail.tm/domains');
    const data = await response.json();
    return data['hydra:member'][0].domain;
}

/**
 * 2. Crea una cuenta de correo temporal y devuelve el Token de acceso y el Email
 */
async function crearCuentaCorreo(nombreUsuario, password) {
    const dominio = await obtenerDominio();
    const address = `${nombreUsuario}@${dominio}`;

    // Creamos la cuenta
    await fetch('https://api.mail.tm/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
    });

    // Hacemos Login para obtener el Token (JWT)
    const tokenResponse = await fetch('https://api.mail.tm/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
    });
    
    const tokenData = await tokenResponse.json();
    return { email: address, token: tokenData.token };
}

/**
 * 3. Busca el último correo recibido usando el Token. 
 * Si la bandeja está vacía, reintenta hasta 5 veces.
 */
async function obtenerUltimoCorreo(token) {
    let intentos = 0;
    
    while (intentos < 5) {
        console.log(`Buscando correos en la bandeja... (Intento ${intentos + 1})`);
        
        // Pedimos la lista de mensajes
        const response = await fetch('https://api.mail.tm/messages', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const correos = data['hydra:member'];
        
        if (correos.length > 0) {
            // Si hay correos, pedimos el detalle del primer correo (el más reciente)
            const idCorreo = correos[0].id;
            const responseDetalle = await fetch(`https://api.mail.tm/messages/${idCorreo}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const contenidoCorreo = await responseDetalle.json();
            return contenidoCorreo.text; // Retornamos el cuerpo del mensaje en texto plano
        }
        
        // Si no hay correos, esperamos 4 segundos y volvemos a intentar
        await esperar(4000);
        intentos++;
    }
    
    throw new Error('No se recibió ningún correo después de 20 segundos.');
}

/**
 * 4. Simula el envío de un correo con un código OTP
 * (En producción, esto sería una llamada a tu API backend)
 */
async function enviarCorreoPrueba(emailDestino) {
    // Generamos un código OTP aleatorio de 6 dígitos
    const codigoOTP = Math.floor(100000 + Math.random() * 900000);
    
    // En un caso real, aquí harías algo como:
    // await fetch('https://tu-api.com/send-email', {
    //     method: 'POST',
    //     body: JSON.stringify({ to: emailDestino, otpCode: codigoOTP })
    // });
    
    // Para esta prueba, solo retornamos el código
    console.log(`📨 [SIMULACIÓN] Correo enviado a ${emailDestino} con código OTP: ${codigoOTP}`);
    return codigoOTP;
}

module.exports = { crearCuentaCorreo, obtenerUltimoCorreo, enviarCorreoPrueba };

```

### 2.  Crear el test para consumir el correo (tests/email-validation.spec.js)

Aquí vamos a unir todo: generaremos el correo, usaremos otra API pública de Playwright
(solo para simular que alguien nos envía el correo) y luego llamaremos a nuestra función avanzada para extraer el código.

```JavaScript
import { test, expect } from '@playwright/test';
import { crearCuentaCorreo, obtenerUltimoCorreo, enviarCorreoPrueba } from '../utils/TmpEmailReader';

test.describe('Validación Avanzada de Correos Electrónicos', () => {

    test('Crear buzón real y simular extracción de OTP', async () => {
        
        // 1. Creamos un buzón de correo REAL y funcional usando nuestra utilidad
        const usuarioBuzon = `ninja_qa_${Date.now()}`;
        const passwordBuzon = 'PasswordFuerte123!';
        
        console.log('Creando cuenta de correo temporal...');
        const cuenta = await crearCuentaCorreo(usuarioBuzon, passwordBuzon);
        
        console.log(`✅ ¡Buzón creado exitosamente!: ${cuenta.email}`);
        expect(cuenta.token).toBeDefined();
        expect(cuenta.email).toContain('@');

        // 2. Simulamos una solicitud a la API que envía un correo con código OTP
        console.log('📧 Enviando correo con código OTP...');
        const codigoOTPEsperado = await enviarCorreoPrueba(cuenta.email);
        
        // 3. En un caso E2E real, aquí obtendrías el correo real:
        // const textoCorreoRecibido = await obtenerUltimoCorreo(cuenta.token);
        
        // Para esta prueba, creamos el contenido del correo simulado
        const textoCorreoRecibido = `
            Hola ${usuarioBuzon},
            Alguien solicitó un restablecimiento de contraseña para tu cuenta.
            Tu código de verificación es: ${codigoOTPEsperado}.
            Este código expirará en 10 minutos. No lo compartas con nadie.
            Sistema de Autenticación - QAX
        `;
        
        console.log('✅ Correo recibido (simulado)');
        console.log(`📝 Contenido del correo:\n${textoCorreoRecibido}`);
        
        // 4. Uso de Expresiones Regulares (Regex) para extraer SOLO números de 6 dígitos
        console.log('🔍 Extrayendo el código OTP de 6 dígitos del texto del correo...');
        const regexOTP = /\b\d{6}\b/; 
        
        // .match() busca en todo el texto y devuelve un array con las coincidencias
        const coincidencias = textoCorreoRecibido.match(regexOTP);
        const codigoExtraido = coincidencias ? coincidencias[0] : null;

        console.log(`✅ Código extraído: ${codigoExtraido}`);

        // 5. Validamos que el código extraído sea válido (6 dígitos)
        expect(codigoExtraido).not.toBeNull();
        expect(codigoExtraido.length).toBe(6);
        expect(/^\d{6}$/.test(codigoExtraido)).toBe(true);
        
        // 6. Validamos que el código extraído coincida con el esperado
        expect(parseInt(codigoExtraido)).toBe(codigoOTPEsperado);
        console.log(`✅ ¡Validación exitosa! El código OTP es correcto: ${codigoExtraido}`);
    });

});

```

### Comando de ejecución

```Bash
npx playwright test tests/email-validation.spec.js
```
---

### 👈 Volver al [Training](./README.md)