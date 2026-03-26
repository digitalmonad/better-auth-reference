import { test, expect } from "@playwright/test";
import { generateTestUser, clearMailbox, waitForEmail } from "./helpers";

test.describe("Email Sending", () => {
  test.beforeEach(async () => {
    // Clear mailbox before each test
    await clearMailbox();
  });

  test("should send verification email on sign up", async ({ page }) => {
    const userData = generateTestUser();

    // Navigate to sign up page
    await page.goto("/sign-up");

    // Fill in the form
    await page.getByLabel(/^name$/i).fill(userData.name);
    await page.getByLabel(/^email$/i).fill(userData.email);
    await page.getByLabel(/^password$/i).fill(userData.password);
    await page.getByLabel(/^confirmpassword$/i).fill(userData.password);

    // Submit the form
    await page.getByTestId("sign-up-submit").click();

    // Wait for the email to arrive in Mailpit
    const email = await waitForEmail(
      userData.email,
      "Verify your email address",
      15000, // 15 seconds timeout
    );

    // Verify email properties
    expect(email.Subject).toBe("Verify your email address");
    expect(email.To[0].Address).toBe(userData.email);
    expect(email.Text).toContain("verify your email");
    expect(email.Text).toContain("/api/auth/verify-email?token=");

    // Verify the email contains a valid verification link
    const verificationLinkMatch = email.Text.match(
      /https?:\/\/[^\s]+\/api\/auth\/verify-email\?token=[^\s&]+/,
    );
    expect(verificationLinkMatch).not.toBeNull();
  });

  test("should send password reset email", async ({ page }) => {
    const userData = generateTestUser();

    // First, create a user by signing up
    await page.goto("/sign-up");
    await page.getByLabel(/^name$/i).fill(userData.name);
    await page.getByLabel(/^email$/i).fill(userData.email);
    await page.getByLabel(/^password$/i).fill(userData.password);
    await page.getByLabel(/^confirmpassword$/i).fill(userData.password);
    await page.getByTestId("sign-up-submit").click();

    // Wait for sign up email and clear mailbox
    await waitForEmail(userData.email, "Verify", 15000);
    await clearMailbox();

    // Now request password reset
    await page.goto("/forgot-password");
    await page.getByLabel(/email/i).fill(userData.email);
    await page.getByRole("button", { name: /send|reset/i }).click();

    // Wait for password reset email
    const email = await waitForEmail(
      userData.email,
      "Reset your password",
      15000,
    );

    // Verify email properties
    expect(email.Subject).toBe("Reset your password");
    expect(email.To[0].Address).toBe(userData.email);
    expect(email.Text).toContain("reset your password");
    expect(email.Text).toContain("LINK");
  });

  test("should not send email for non-existent user on password reset", async ({
    page,
  }) => {
    const fakeEmail = "nonexistent@example.com";

    // Request password reset for non-existent user
    await page.goto("/forgot-password");
    await page.getByLabel(/email/i).fill(fakeEmail);
    await page.getByRole("button", { name: /send|reset/i }).click();

    // Wait a bit to ensure no email is sent
    await page.waitForTimeout(3000);

    // Try to get the email - should throw an error
    await expect(async () => {
      await waitForEmail(fakeEmail, "Reset your password", 2000);
    }).rejects.toThrow();
  });
});
