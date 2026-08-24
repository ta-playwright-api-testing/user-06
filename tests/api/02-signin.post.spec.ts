import { test, expect } from '@playwright/test';

import { AuthApi } from '../../src/api/authApi';

const credentials = {
  email: process.env.USER_EMAIL ?? 'user@example.com',
  password: process.env.USER_PASSWORD ?? 'default_password',
};

test.describe('POST /api/signin', () => {
  test('should sign in and return accessToken', async ({ request }) => {
    const authApi = new AuthApi(request);

    const response = await request.post('/api/signin', {
      data: credentials,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const login = await authApi.signIn(credentials);

    expect(login.accessToken).toBeTruthy();
    expect(login.id).toEqual(expect.any(Number));
    expect(login.email).toBe(credentials.email);
  });

  test('should reject invalid password', async ({ request }) => {
    const authApi = new AuthApi(request);

    const response = await authApi.signInRaw({
      email: credentials.email,
      password: `${credentials.password}_invalid`,
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
