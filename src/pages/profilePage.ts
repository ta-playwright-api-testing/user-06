import { type Page } from '@playwright/test';

export class ProfilePage {
  constructor(private readonly page: Page) {}

  async open(userId: number): Promise<void> {
    await this.page.goto(`/user/${userId}/page`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async getPhoneValue(): Promise<string> {
    const phone = this.page.locator('.user-phone-data');

    await phone.waitFor({ state: 'visible' });

    return phone.innerText();
  }
}
