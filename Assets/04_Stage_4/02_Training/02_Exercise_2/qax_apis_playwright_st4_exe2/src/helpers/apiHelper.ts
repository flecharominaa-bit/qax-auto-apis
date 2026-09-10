import type { APIRequestContext } from '@playwright/test';
import { Logger } from './logger.js';

export class ApiHelper {
  constructor(private request: APIRequestContext) { }

  async post(url: string, data: any, headers?: any) {
    return await Logger.step(`POST ${url}`, async () => {
      Logger.request('POST', url, data);

      const response = await this.request.post(url, {
        data,
        headers: {
          'Content-Type': 'application/json; v=1.0',
          'Accept': 'text/plain; v=1.0',
          ...headers
        }
      });

      const body = await response.json().catch(() => ({}));
      Logger.response(response.status(), body);

      return { status: response.status(), body };
    });
  }

  async get(url: string, headers?: any) {
    return await Logger.step(`GET ${url}`, async () => {
      Logger.request('GET', url);

      const response = await this.request.get(url, {
        headers: {
          'Accept': 'text/plain; v=1.0',
          ...headers
        }
      });

      const body = await response.json().catch(() => ({}));
      Logger.response(response.status(), body);

      return { status: response.status(), body };
    });
  }

  async put(url: string, data: any, headers?: any) {
    return await Logger.step(`PUT ${url}`, async () => {
      Logger.request('PUT', url, data);

      const response = await this.request.put(url, {
        data,
        headers: {
          'Content-Type': 'application/json; v=1.0',
          'Accept': 'text/plain; v=1.0',
          ...headers
        }
      });

      const body = await response.json().catch(() => ({}));
      Logger.response(response.status(), body);

      return { status: response.status(), body };
    });
  }

  async delete(url: string, headers?: any) {
    return await Logger.step(`DELETE ${url}`, async () => {
      Logger.request('DELETE', url);

      const response = await this.request.delete(url, {
        headers: {
          'Accept': 'text/plain; v=1.0',
          ...headers
        }
      });

      const status = response.status();
      Logger.response(status, { message: 'Resource deleted' });

      return { status };
    });
  }
}
