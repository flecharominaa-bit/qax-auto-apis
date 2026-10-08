import { test, expect } from '@playwright/test';
import { crearCuentaCorreo, obtenerUltimoCorreo, enviarCorreoPrueba } from '../utils/emailReader';

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
