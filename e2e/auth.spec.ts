import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.describe("Sign Up", () => {
    test("should navigate to sign up page", async ({ page }) => {
      await page.goto("/");

      // Click sign up button
      await page.getByRole("link", { name: /sign up/i }).click();

      // Should be on sign up page
      await expect(page).toHaveURL("/sign-up");
      await expect(
        page.getByRole("heading", { name: /create account/i }),
      ).toBeVisible();
    });

    test("should show sign up form", async ({ page }) => {
      await page.goto("/sign-up");

      // Check form fields
      await expect(page.getByLabel(/^name$/i)).toBeVisible();
      await expect(page.getByLabel(/^email$/i)).toBeVisible();
      await expect(page.getByLabel(/^password$/i)).toBeVisible();
      await expect(page.getByLabel(/^confirmpassword$/i)).toBeVisible();

      // Check submit button (inside form, type="submit")
      await expect(page.getByTestId("sign-up-submit")).toBeVisible();
      await page.getByTestId("sign-up-submit").click();
    });

    test("should show validation errors for empty form", async ({ page }) => {
      await page.goto("/sign-up");

      // Try to submit empty form - use exact match for submit button

      await page.getByTestId("sign-up-submit").click();

      // Should show validation errors
      // Note: Adjust selectors based on your actual error display
      await expect(page.locator("text=required").first()).toBeVisible({
        timeout: 3000,
      });
    });
  });

  test.describe("Sign In", () => {
    test("should navigate to sign in page", async ({ page }) => {
      await page.goto("/");

      // Click sign in button
      await page.getByRole("link", { name: /sign in/i }).click();

      // Should be on sign in page
      await expect(page).toHaveURL("/sign-in");
      await expect(
        page.getByRole("heading", { name: /sign in/i }),
      ).toBeVisible();
    });

    test("should show sign in form", async ({ page }) => {
      await page.goto("/sign-in");

      // Check form fields
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();

      // Check submit button
      await expect(page.getByTestId("sign-in-submit")).toBeVisible();
      await page.getByTestId("sign-in-submit").click();

      // Check forgot password link
      await expect(
        page.getByRole("link", { name: /forgot password/i }),
      ).toBeVisible();
    });

    test("should show validation errors for empty form", async ({ page }) => {
      await page.goto("/sign-in");

      // Try to submit empty form
      await page.getByRole("button", { name: /sign in/i }).click();

      // Should show validation errors
      await expect(page.locator("text=required").first()).toBeVisible({
        timeout: 3000,
      });
    });
  });

  test.describe("Password Reset", () => {
    test("should navigate to forgot password page", async ({ page }) => {
      await page.goto("/sign-in");

      // Click forgot password link
      await page.getByRole("link", { name: /forgot password/i }).click();

      // Should be on forgot password page
      await expect(page).toHaveURL("/forgot-password");
      await expect(
        page.getByRole("heading", { name: /forgot password/i }),
      ).toBeVisible();
    });

    test("should show email input", async ({ page }) => {
      await page.goto("/forgot-password");

      // Check email field
      await expect(page.getByLabel(/email/i)).toBeVisible();

      // Check submit button
      await expect(
        page.getByRole("button", { name: /send|reset/i }),
      ).toBeVisible();
    });
  });
});
