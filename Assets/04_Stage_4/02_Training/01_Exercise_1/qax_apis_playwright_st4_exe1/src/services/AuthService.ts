import { APIRequestContext } from '@playwright/test';
import { LoginCredentials } from '../types/api.types';
import { LoginResponseModel } from '../models/LoginResponse';

/**
 * Servicio para conectarse al API de autenticación.
 */
export class AuthService {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Autentica un usuario y devuelve el status y el cuerpo de la respuesta.
   */
  async login(credentials: LoginCredentials): Promise<{ status: number; body: LoginResponseModel | any }> {
    // Usamos la ruta relativa '/login' en vez de hardcodear toda la URL
    const response = await this.request.post('/login', {
      data: credentials,
    });

    let body: any;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    return {
      status: response.status(),
      body: new LoginResponseModel(body),
    };
  }
}