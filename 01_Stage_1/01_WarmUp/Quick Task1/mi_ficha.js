const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

async function main() {
  let nombre = "Romi";
  let edad = 32;
  let estudiaAPI = true;
  let hobbies = ["series", "gym", "viajar"];

  console.log(nombre, edad, estudiaAPI, hobbies);

  // tipos
  console.log(typeof nombre);
  console.log(typeof edad);
  console.log(typeof estudiaAPI);
  console.log(typeof hobbies);

  // agregar hobby
  // prompt() es una función del navegador y no existe en Node.js;
  // usamos el módulo nativo readline/promises para pedir el dato por consola.
  const rl = readline.createInterface({ input, output });
  const nuevoHobby = await rl.question("¿Cuál es tu hobby favorito? ");
  rl.close();
  hobbies.push(nuevoHobby);

  // cantidad
  console.log(hobbies.length);

  // sumar edad
  edad = edad + 1;
  console.log(edad);
}

main();