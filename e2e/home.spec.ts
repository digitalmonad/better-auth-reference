import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    // Check if the page title is visible
    await expect(page).toHaveTitle(/better-auth/i);
  });

  test("should have navigation", async ({ page }) => {
    await page.goto("/");

    // Check for sign in and sign up buttons
    const signInButton = page.getByRole("link", { name: /sign in/i });
    const signUpButton = page.getByRole("link", { name: /sign up/i });

    await expect(signInButton).toBeVisible();
    await expect(signUpButton).toBeVisible();
  });
});
