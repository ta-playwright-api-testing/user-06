import { test, expect } from '@playwright/test';

import { AuthApi } from '../../src/api/authApi';
import { UserProfileApi } from '../../src/api/userProfileApi';

const credentials = {
  email: process.env.USER_EMAIL ?? 'user@example.com',
  password: process.env.USER_PASSWORD ?? 'default_password',
};

test.describe('PUT /api/user/{id}', () => {
  let accessToken = '';
  let userId = 0;

  test.beforeEach(async ({ request }) => {
    const authApi = new AuthApi(request);

    const login = await authApi.signIn(credentials);

    accessToken = login.accessToken;
    userId = login.id;
  });

  test('should update phone via PUT and verify via GET', async ({ request }) => {
    const userProfileApi = new UserProfileApi(request);

    const originalProfile = await userProfileApi.getById(accessToken, userId);

    const originalPhone = originalProfile.phone;

    const newPhoneNumber = `+38067${Date.now().toString().slice(-7)}`;

    try {
      const updatedProfile = {
        email: originalProfile.email,
        firstName: originalProfile.firstName,
        lastName: originalProfile.lastName,
        phone: newPhoneNumber,
        roleName: originalProfile.roleName,
        urlLogo: originalProfile.urlLogo,
        status: originalProfile.status,
      };

      const returnedPhone = await userProfileApi.updateUserProfile(
        accessToken,
        userId,
        updatedProfile,
      );

      expect(returnedPhone).toBe(newPhoneNumber);

      const profileAfterUpdate = await userProfileApi.getById(accessToken, userId);

      expect(profileAfterUpdate.phone).toBe(returnedPhone);
    } finally {
      const restoreProfile = await userProfileApi.getById(accessToken, userId);

      await userProfileApi.updateUserProfile(accessToken, userId, {
        email: restoreProfile.email,
        firstName: restoreProfile.firstName,
        lastName: restoreProfile.lastName,
        phone: originalPhone ?? '',
        roleName: restoreProfile.roleName,
        urlLogo: restoreProfile.urlLogo,
        status: restoreProfile.status,
      });
    }
  });
});
