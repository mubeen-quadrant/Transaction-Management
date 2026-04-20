import { expect, test } from "@playwright/test";
import { config } from "@src/config";
import { loginToSalesforce } from "@tests/utils/salesforce-login";

test.describe("TM_TC01", () => {
  test("TM_TC01: load login and app URLs from env config", async ({ page }) => {
    await loginToSalesforce(page);

    await page.goto(config.baseUrl);
    // Salesforce may redirect from lightning.force.com to my.salesforce.com.
    await expect(page).toHaveURL(/(lightning\.force\.com|my\.salesforce\.com)/i);
    await page.pause();
  
  });
});
