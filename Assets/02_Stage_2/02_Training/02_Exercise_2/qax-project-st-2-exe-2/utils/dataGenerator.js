import { faker } from "@faker-js/faker";

function generarUsuario() {
    return {
        name: faker.person.fullName(),
        // Agregamos .toLowerCase() para evitar conflictos con la API
        email: faker.internet.email().toLowerCase(), 
        password: faker.internet.password() + 'A1!' 
    };
}

// Exportamos la función para poder usarla en nuestros tests
module.exports = { generarUsuario };