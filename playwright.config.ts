import { defineConfig, devices } from "@playwright/test";
import { config } from "@src/config";

export default defineConfig({
  testDir: "./tests/transactions",
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: config.isCI,
  retries: config.isCI ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }]
  ],
  use: {
    baseURL: config.baseUrl,
    headless: config.headless,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
