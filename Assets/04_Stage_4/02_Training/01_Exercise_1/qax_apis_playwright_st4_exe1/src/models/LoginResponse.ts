import { LoginResponse, User } from '../types/api.types';

/**
 * Modelo para procesar la respuesta de Login.
 * Funciona como un parseador/mapeador: recibe el JSON de la API
 * y asegura que tenga la estructura de nuestra interfaz.
 */
export class LoginResponseModel implements LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;

  constructor(raw: any) {
    this.token = raw?.token || '';
    this.tokenType = raw?.tokenType || 'Bearer';
    this.expiresIn = raw?.expiresIn || 0;
    this.user = raw?.user || { id: '', email: '', name: '' };
  }
}
