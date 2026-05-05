// utils.js
function generarUsernameUnico() {
    // Usamos Date.now() para que el número sea siempre diferente basado en el tiempo exacto
    const timestamp = Date.now(); 
    return `romina_ninja_${timestamp}`;
}

// Exportamos la función para que el test la pueda "importar"
module.exports = { generarUsernameUnico };