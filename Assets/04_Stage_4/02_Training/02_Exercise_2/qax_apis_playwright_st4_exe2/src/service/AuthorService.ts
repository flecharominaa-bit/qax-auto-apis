import { APIRequestContext } from '@playwright/test';
import { Author } from '../types/author';
import { ApiHelper } from '../helpers/apiHelper';
import * as dotenv from 'dotenv';

dotenv.config();

export class AuthorService {
  private baseURL: string;
  private api: ApiHelper;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.baseURL = baseURL || process.env.API_BASE_URL || 'https://fakerestapi.azurewebsites.net';
    this.api = new ApiHelper(request);
  }

  async createAuthor(data: Author) {
    const endpoint = `${this.baseURL}/api/v1/Authors`;
    return await this.api.post(endpoint, data);
  }

  async getAuthors() {
    const endpoint = `${this.baseURL}/api/v1/Authors`;
    return await this.api.get(endpoint);
  }

  async updateAuthor(id: number, data: Author) {
    const endpoint = `${this.baseURL}/api/v1/Authors/${id}`;
    return await this.api.put(endpoint, data);
  }
}
