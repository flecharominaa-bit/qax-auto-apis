/**
 * Interfaces (Contratos) para la API
 * Define la estructura exacta de los datos que enviamos y recibimos.
 */

// Estructura del usuario
export interface User {
  id: string;
  email: string;
  name: string;
}

// Request: Lo que ENVIAMOS al servidor al hacer Login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Response: Lo que RECIBIMOS del servidor tras hacer Login
export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

// Request/Response: Datos flexibles de un producto
export interface ProductData {
  [key: string]: any;
}

// Request: Lo que ENVIAMOS al servidor al crear un Producto
export interface ProductBody {
  name: string;
  data: ProductData;
}

// Response: Lo que RECIBIMOS del servidor (producto completo)
export interface Product {
  id?: string | number;
  name?: string;
  data?: ProductData;
}
