import { test } from "@playwright/test";
import { config } from "@src/config";
import { loginToSalesforce } from "@tests/utils/salesforce-login";

/** TM_TC05 — transaction-related scenario (adjust describe/steps). */
test.describe("TM_TC05", () => {
  test("TM_TC05: implement (e.g. create / list transaction)", async ({ page }) => {
    await loginToSalesforce(page);
    await page.goto(config.baseUrl);
  });
});
