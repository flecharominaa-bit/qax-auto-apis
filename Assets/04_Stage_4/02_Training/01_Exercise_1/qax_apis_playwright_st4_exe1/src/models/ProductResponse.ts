import { Product, ProductData } from '../types/api.types';

/**
 * Modelo para procesar la respuesta de Productos.
 * Mapea la respuesta sucia de la API a nuestra interfaz limpia.
 */
export class ProductResponseModel implements Product {
  id?: string | number;
  name?: string;
  data?: ProductData;

  constructor(raw: any) {
    // La API a veces devuelve diferentes formatos, extraemos el correcto
    this.id = raw && (raw.id ?? raw._id ?? raw.key);
    this.name = raw && (raw.name ?? raw.title);
    this.data = raw && raw.data;
  }
}
