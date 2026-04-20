import { test } from "@playwright/test";
import { config } from "@src/config";
import { loginToSalesforce } from "@tests/utils/salesforce-login";

test.describe("TM_TC11", () => {
  test("TM_TC11: implement per test plan", async ({ page }) => {
    await loginToSalesforce(page);
    await page.goto(config.baseUrl);
  });
});
