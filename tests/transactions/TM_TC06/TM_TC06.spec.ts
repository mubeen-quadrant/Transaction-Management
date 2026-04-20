import { test } from "@playwright/test";
import { config } from "@src/config";
import { loginToSalesforce } from "@tests/utils/salesforce-login";

test.describe("TM_TC06", () => {
  test("TM_TC06: implement per test plan", async ({ page }) => {
    await loginToSalesforce(page);
    await page.goto(config.baseUrl);
  });
});
