import { test as base } from "@playwright/test";

/**
 * Extend base test with custom fixtures
 * Example: authenticated user fixture, database helpers, etc.
 */

type Fixtures = {
  // Add custom fixtures here
  // Example:
  // authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  // Define fixtures here
  // Example authenticated user fixture:
  // authenticatedPage: async ({ page }, use) => {
  //   // Setup: Log in the user
  //   await page.goto('/sign-in');
  //   await page.getByLabel(/email/i).fill('test@example.com');
  //   await page.getByLabel(/password/i).fill('password123');
  //   await page.getByRole('button', { name: /sign in/i }).click();
  //   await page.waitForURL('/');
  //
  //   // Use the authenticated page in tests
  //   await use(page);
  //
  //   // Teardown: Clean up if needed
  // },
});

export { expect } from "@playwright/test";
