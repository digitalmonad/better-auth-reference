import type { Page } from "@playwright/test";

/**
 * Helper functions for Playwright tests
 */

/**
 * Generate a random email for testing
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@example.com`;
}

/**
 * Generate a random user data for testing
 */
export function generateTestUser() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);

  return {
    name: `Test User ${random}`,
    email: `test-${timestamp}-${random}@example.com`,
    password: "TestPassword123!",
  };
}

/**
 * Sign in with test credentials
 */
export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

/**
 * Sign up with test credentials
 */
export async function signUp(
  page: Page,
  userData: { name: string; email: string; password: string },
) {
  await page.goto("/sign-up");
  await page.getByLabel(/name/i).fill(userData.name);
  await page.getByLabel(/email/i).fill(userData.email);
  await page.getByLabel(/password/i).fill(userData.password);
  await page.getByRole("button", { name: /sign up/i }).click();
}

/**
 * Sign out
 */
export async function signOut(page: Page) {
  await page.getByRole("button", { name: /sign out/i }).click();
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, url: string) {
  await page.waitForURL(url);
}
