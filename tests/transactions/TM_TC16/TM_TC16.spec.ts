import { test, expect } from "@playwright/test";
import { config } from "@src/config";
import { tags } from "@tests/utils/test-tags";

/** TM_TC16 — example API check; replace URL/assertions with your API. */
test(`${tags.api} TM_TC16 sample API returns 200`, async ({ request }) => {
  const response = await request.get(`${config.apiBaseUrl}/posts`);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
});
