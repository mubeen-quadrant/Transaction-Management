import { expect, Page } from "@playwright/test";
import { config } from "@src/config";

export async function loginToSalesforce(page: Page): Promise<void> {
  if (!config.tmUsername || !config.tmPassword) {
    throw new Error("Missing TM_USERNAME or TM_PASSWORD in env/.env");
  }

  await page.goto(config.loginUrl);
  await expect(page).toHaveURL(/login\.salesforce\.com/i);

  await page.locator("#username, input[name='username']").first().fill(config.tmUsername);
  await page
    .locator("#password, #pw, input[name='pw'], input[name='password']")
    .first()
    .fill(config.tmPassword);

  await Promise.all([
    page.waitForLoadState("domcontentloaded"),
    page.locator("#Login, input[type='submit'][value='Log In'], button:has-text('Log In')").first().click()
  ]);
}
