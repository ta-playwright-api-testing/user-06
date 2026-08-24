import { test, expect, request as playwrightRequest } from '@playwright/test';

import { AuthApi } from '../../src/api/authApi';
import { UserProfileApi } from '../../src/api/userProfileApi';
import { ProfilePage } from '../../src/pages/profilePage';

const API_BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080';

const credentials = {
  email: process.env.USER_EMAIL ?? 'user@example.com',
  password: process.env.USER_PASSWORD ?? 'default_password',
};

test.describe('API + UI: update phone and verify in browser', () => {
  test('should show API-updated phone on the profile page', async ({ page }) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });

    try {
      const authApi = new AuthApi(apiContext);
      const userProfileApi = new UserProfileApi(apiContext);
      const profilePage = new ProfilePage(page);

      const login = await authApi.signIn(credentials);

      const accessToken = login.accessToken;
      const userId = login.id;

      const originalProfile = await userProfileApi.getById(accessToken, userId);

      const originalPhone = originalProfile.phone;

      const newPhoneNumber = `+38067${Date.now().toString().slice(-7)}`;

      try {
        const apiPhone = await userProfileApi.updateUserProfile(accessToken, userId, {
          email: originalProfile.email,
          firstName: originalProfile.firstName,
          lastName: originalProfile.lastName,
          phone: newPhoneNumber,
          roleName: originalProfile.roleName,
          urlLogo: originalProfile.urlLogo,
          status: originalProfile.status,
        });

        await page.addInitScript(
          ({ accessToken, userId, roleName }) => {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('id', String(userId));
            localStorage.setItem('role', roleName);
          },
          {
            accessToken,
            userId,
            roleName: login.roleName,
          },
        );

        await profilePage.open(userId);

        const uiPhone = await profilePage.getPhoneValue();

        expect(uiPhone.replace(/^\+/, '')).toBe(apiPhone.replace(/^\+/, ''));
      } finally {
        const currentProfile = await userProfileApi.getById(accessToken, userId);

        await userProfileApi.updateUserProfile(accessToken, userId, {
          email: currentProfile.email,
          firstName: currentProfile.firstName,
          lastName: currentProfile.lastName,
          phone: originalPhone ?? '',
          roleName: currentProfile.roleName,
          urlLogo: currentProfile.urlLogo,
          status: currentProfile.status,
        });
      }
    } finally {
      await apiContext.dispose();
    }
  });
});
