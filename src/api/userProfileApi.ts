import { type APIRequestContext } from '@playwright/test';

import { type UserResponse, type UserUpdateProfile } from '../types/api';

export class UserProfileApi {
  constructor(private readonly request: APIRequestContext) {}

  /** GET /api/user/{id} з Authorization: Bearer . */
  async getById(accessToken: string, userId: number): Promise<UserResponse> {
    const response = await this.request.get(`/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `GET /api/user/${userId} failed: ${response.status()} ${response.statusText()}`,
      );
    }

    return response.json() as Promise<UserResponse>;
  }

  /**
   * PUT /api/user/{id}
   * У Swagger обов'язкові поля: email, phone, roleName.
   * Повертає новий номер телефону.
   */
  async updateUserProfile(
    accessToken: string,
    userId: number,
    profile: UserUpdateProfile,
  ): Promise<string> {
    const response = await this.request.put(`/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: profile,
    });

    if (!response.ok()) {
      throw new Error(
        `PUT /api/user/${userId} failed: ${response.status()} ${response.statusText()}`,
      );
    }

    return profile.phone;
  }
}
