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

/**
 * Mailpit API types
 */
interface MailpitMessage {
  ID: string;
  From: { Address: string; Name: string };
  To: Array<{ Address: string; Name: string }>;
  Subject: string;
  Date: string;
  Size: number;
  Snippet: string;
}

interface MailpitMessagesResponse {
  total: number;
  unread: number;
  count: number;
  messages: MailpitMessage[];
}

interface MailpitMessageDetail {
  ID: string;
  From: { Address: string; Name: string };
  To: Array<{ Address: string; Name: string }>;
  Subject: string;
  Text: string;
  HTML: string;
  Date: string;
}

/**
 * Get Mailpit API base URL
 */
function getMailpitUrl(): string {
  return process.env.MAILPIT_URL || "http://localhost:8025";
}

/**
 * Delete all emails in Mailpit
 */
export async function clearMailbox(): Promise<void> {
  const url = `${getMailpitUrl()}/api/v1/messages`;
  await fetch(url, { method: "DELETE" });
}

/**
 * Get all messages from Mailpit
 */
export async function getMessages(): Promise<MailpitMessage[]> {
  const url = `${getMailpitUrl()}/api/v1/messages`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }

  const data: MailpitMessagesResponse = await response.json();
  return data.messages || [];
}

/**
 * Get a specific message by ID
 */
export async function getMessage(id: string): Promise<MailpitMessageDetail> {
  const url = `${getMailpitUrl()}/api/v1/message/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch message: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Wait for an email to arrive in Mailpit
 * @param recipientEmail - Email address to check
 * @param subject - Optional subject to match
 * @param timeoutMs - Timeout in milliseconds (default: 10000)
 * @returns The message detail
 */
export async function waitForEmail(
  recipientEmail: string,
  subject?: string,
  timeoutMs = 10000,
): Promise<MailpitMessageDetail> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const messages = await getMessages();
    const foundMessage = messages.find((msg) => {
      const toMatch = msg.To.some((to) => to.Address === recipientEmail);
      const subjectMatch = subject ? msg.Subject.includes(subject) : true;
      return toMatch && subjectMatch;
    });

    if (foundMessage) {
      return await getMessage(foundMessage.ID);
    }

    // Wait 500ms before checking again
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(
    `Email not found for ${recipientEmail}${subject ? ` with subject "${subject}"` : ""} within ${timeoutMs}ms`,
  );
}
