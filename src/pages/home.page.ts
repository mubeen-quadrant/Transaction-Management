import { expect, Page } from "@playwright/test";

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async assertHeaderVisible(): Promise<void> {
    await expect(this.page).toHaveTitle(/Playwright/i);
    await expect(this.page.getByRole("link", { name: /Get started/i })).toBeVisible();
  }
}
