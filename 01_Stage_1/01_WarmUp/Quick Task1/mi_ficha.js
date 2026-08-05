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
let nuevoHobby = prompt("¿Cuál es tu hobby favorito?");hobbies.push(nuevoHobby);

// cantidad
console.log(hobbies.length);

// sumar edad
edad = edad + 1;
console.log(edad);