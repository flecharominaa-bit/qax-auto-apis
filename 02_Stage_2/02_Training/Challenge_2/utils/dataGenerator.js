import { faker } from "@faker-js/faker";

export function generarUsuarioAleatorio() {
    return {
        // Generamos un nombre de usuario seguro
        userName: faker.internet.username().replace(/[^a-zA-Z0-9]/g, '_'),
        
        // FORZAMOS el cumplimiento de DemoQA:
        // 'QA' (mayúscula/minúscula) + password de 10 letras + '!2026' (símbolo/número)
        password: `QA${faker.internet.password({ length: 10, pattern: /[a-zA-Z]/ })}!2026`
    };
}