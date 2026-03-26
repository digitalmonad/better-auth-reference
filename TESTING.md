# Playwright E2E Testing

This project uses [Playwright](https://playwright.dev) for end-to-end testing.

## 🚀 Quick Start

### Install Browsers

```bash
pnpm playwright install chromium
```

### Run Tests

```bash
# Run all tests (headless)
pnpm test:e2e

# Run tests in UI mode (recommended for development)
pnpm test:e2e:ui

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Debug tests
pnpm test:e2e:debug

# View test report
pnpm test:report
```

## 📁 Test Structure

```
e2e/
├── home.spec.ts        # Homepage tests
└── auth.spec.ts        # Authentication flow tests
```

## ✍️ Writing Tests

Example test:

```typescript
import { test, expect } from "@playwright/test";

test("should display homepage", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /better-auth/i }),
  ).toBeVisible();
});
```

## 🔧 Configuration

The Playwright configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000` (configurable via `BASE_URL` env var)
- **Test directory**: `./e2e`
- **Browsers**: Chromium (Firefox and WebKit commented out)
- **Auto-start dev server**: Yes (runs `pnpm dev` before tests)
- **Retries on CI**: 2
- **Screenshots**: On failure
- **Traces**: On first retry

## 🧪 Test Examples

### Current Tests

1. **Homepage Tests** (`e2e/home.spec.ts`)
   - Page loads correctly
   - Navigation buttons are visible

2. **Authentication Tests** (`e2e/auth.spec.ts`)
   - Sign up flow
   - Sign in flow
   - Password reset flow
   - Form validation

3. **Email Tests** (`e2e/email.spec.ts`)
   - Verification email on sign up
   - Password reset email
   - Email content validation

## 📧 Email Testing with Mailpit

This project uses [Mailpit](https://github.com/axllent/mailpit) for testing email functionality.

### Local Development

1. **Start Mailpit**:

   ```bash
   docker compose up -d
   ```

2. **Access Web UI**: http://localhost:8025

3. **Run Email Tests**:
   ```bash
   pnpm test:e2e e2e/email.spec.ts
   ```

### CI/CD

In CI, Mailpit runs automatically as a service container. The tests use the Mailpit API to:

- Wait for emails to arrive
- Verify email content
- Extract verification links
- Clear mailbox between tests

### Email Test Helpers

Available helper functions in `e2e/helpers.ts`:

```typescript
// Clear all emails in Mailpit
await clearMailbox();

// Wait for a specific email to arrive
const email = await waitForEmail(
  "user@example.com",
  "Subject line", // optional
  15000, // timeout in ms
);

// Get all messages
const messages = await getMessages();

// Get a specific message
const message = await getMessage(messageId);
```

### Example Email Test

```typescript
test("should send verification email", async ({ page }) => {
  const userData = generateTestUser();

  // Clear mailbox before test
  await clearMailbox();

  // Trigger email (e.g., sign up)
  await page.goto("/sign-up");
  await page.getByLabel(/email/i).fill(userData.email);
  // ... fill other fields and submit

  // Wait for email and verify
  const email = await waitForEmail(userData.email, "Verify", 15000);
  expect(email.Subject).toBe("Verify your email address");
  expect(email.Text).toContain("verification link");
});
```

## 📊 Reporting

After running tests, view the HTML report:

```bash
pnpm test:report
```

Reports are generated in `playwright-report/`

## 🎯 Best Practices

1. **Use user-facing selectors**: Prefer `getByRole()`, `getByLabel()`, `getByText()` over CSS selectors
2. **Auto-waiting**: Playwright automatically waits for elements
3. **Isolation**: Each test runs in isolation with a fresh browser context
4. **Parallel execution**: Tests run in parallel for speed

## 🔍 Debugging

### UI Mode (Recommended)

```bash
pnpm test:e2e:ui
```

Features:

- Watch mode
- Time travel through test execution
- Visual selector picker
- Step through tests

### Debug Mode

```bash
pnpm test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### VS Code Extension

Install the [Playwright VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for:

- Run tests directly from VS Code
- Set breakpoints
- See test results inline

## 🚦 CI/CD

The configuration automatically adapts for CI environments:

- Runs in headless mode
- Retries failed tests 2 times
- Runs tests sequentially (workers: 1)
- Fails build if `test.only` is found

To run in CI mode locally:

```bash
CI=true pnpm test:e2e
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Locators Guide](https://playwright.dev/docs/locators)
