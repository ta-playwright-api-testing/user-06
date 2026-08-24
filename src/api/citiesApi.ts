import { type APIRequestContext, type APIResponse } from '@playwright/test';

import { type City } from '../types/api';

export class CitiesApi {
  constructor(private readonly request: APIRequestContext) {}

  /** GET /api/cities — повернути масив міст. */
  async getAll(): Promise<City[]> {
    const response = await this.request.get('/api/cities');

    if (!response.ok()) {
      throw new Error(`GET /api/cities failed: ${response.status()} ${response.statusText()}`);
    }

    return response.json() as Promise<City[]>;
  }

  /** GET /api/city/{id} — одне місто. */
  async getById(id: number): Promise<City> {
    const response = await this.request.get(`/api/city/${id}`);

    if (!response.ok()) {
      throw new Error(`GET /api/city/${id} failed: ${response.status()} ${response.statusText()}`);
    }

    return response.json() as Promise<City>;
  }

  /** Сирий response, якщо потрібен статус / headers. */
  async getAllRaw(): Promise<APIResponse> {
    return this.request.get('/api/cities');
  }
}
