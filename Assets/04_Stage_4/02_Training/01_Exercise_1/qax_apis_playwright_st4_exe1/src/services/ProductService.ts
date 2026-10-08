import { APIRequestContext } from '@playwright/test';
import { ProductBody } from '../types/api.types';
import { ProductResponseModel } from '../models/ProductResponse';

/**
 * Servicio para conectarse al API de productos.
 */
export class ProductService {
  private request: APIRequestContext;
  private endpoint = '/objects';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Obtiene la información de un producto específico.
   */
  async getProduct(id: string): Promise<{ status: number; body: ProductResponseModel | any }> {
    const response = await this.request.get(`${this.endpoint}/${id}`);

    let body;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    return {
      status: response.status(),
      body: new ProductResponseModel(body),
    };
  }

  /**
   * Crea un nuevo producto.
   */
  async createProduct(productData: ProductBody): Promise<{ status: number; body: ProductResponseModel | any }> {
    const response = await this.request.post(this.endpoint, {
      data: productData,
    });

    let body: any;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    return {
      status: response.status(),
      body: new ProductResponseModel(body),
    };
  }
}
