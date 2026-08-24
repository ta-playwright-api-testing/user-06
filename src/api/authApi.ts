import { type APIRequestContext, type APIResponse } from '@playwright/test';

import { type SuccessLogin, type UserLogin } from '../types/api';

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  /** POST /api/signin — успішний логін, повернути SuccessLogin. */
  async signIn(credentials: UserLogin): Promise<SuccessLogin> {
    const response = await this.request.post('/api/signin', {
      data: credentials,
    });

    if (!response.ok()) {
      throw new Error(`POST /api/signin failed: ${response.status()} ${response.statusText()}`);
    }

    return response.json() as Promise<SuccessLogin>;
  }

  /** POST /api/signin — сирий response (для негативних кейсів). */
  async signInRaw(credentials: UserLogin): Promise<APIResponse> {
    return this.request.post('/api/signin', {
      data: credentials,
    });
  }
}
