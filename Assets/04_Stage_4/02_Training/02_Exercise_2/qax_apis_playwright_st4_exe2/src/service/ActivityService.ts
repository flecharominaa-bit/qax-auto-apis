import { APIRequestContext } from '@playwright/test';
import { Activity } from '../types/activity';
import { ApiHelper } from '../helpers/apiHelper';
import * as dotenv from 'dotenv';

dotenv.config();

export class ActivityService {
  private baseURL: string;
  private api: ApiHelper;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.baseURL = baseURL || process.env.API_BASE_URL || 'https://fakerestapi.azurewebsites.net';
    this.api = new ApiHelper(request);
  }

  async createActivity(data: Activity) {
    const endpoint = `${this.baseURL}/api/v1/Activities`;
    return await this.api.post(endpoint, data);
  }
}