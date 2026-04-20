import { test } from "@playwright/test";
import { config } from "@src/config";
import { loginToSalesforce } from "@tests/utils/salesforce-login";

test.describe("TM_TC15", () => {
  test("TM_TC15: implement per test plan", async ({ page }) => {
    await loginToSalesforce(page);
    await page.goto(config.baseUrl);
  });
});
