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
