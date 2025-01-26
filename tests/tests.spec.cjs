import testData from './data.json';
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://animated-gingersnap-8cf7f2.netlify.app/';
const USERNAME = process.env.TEST_USERNAME || 'admin';
const PASSWORD = process.env.TEST_PASSWORD || 'password123';

test.use({ browserName: 'chromium', channel: 'chrome' });

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);

  // Username field
  const usernameField = page.locator('input[name="Username"]'); // More explicit selector
  await urnameField.fill(USERNAME);

  // Password field
  const passwordField = page.locator('input[name="Password"]'); // More explicit selector
  await passwordField.fill(PASSWORD);

  // Sign-in button
  const signInButton = page.locator('button:has-text("Sign in")'); // Handled dynamic text
  await signInButton.click();

  // Confirm successful login
  const banner = page.getByRole('banner');
  await banner.waitFor({ state: 'visible', timeout: 60000 }); // Wait for banner to ensure login is complete
  await expect(banner.getByRole('heading', { name: 'Web Application' })).toBeVisible();
});

// Perform cleanup after all tests in the suite
test.afterAll(async ({ page }) => {
  // Example: Log out or clear session if needed
  const logoutButton = page.locator('button:has-text("Logout")'); // Replace with the actual selector for your logout button
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  }

  // Example: Clear cookies and local storage for the session
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
});

test.describe('Data-Driven Tests for Demo App', () => {
  for (const data of testData) {
    test(`Verify task "${data.task}" in ${data.application}`, async ({ page }) => {
      // Navigate
      await page.click(`text=${data.application}`);
      await expect(page.locator('.task-list')).toBeVisible(); // Wait for the task section

      // Verify task and status
      const taskLocator = page.locator(`.task:has-text("${data.task}")`);
      await taskLocator.waitFor({ state: 'visible' });
      await expect(taskLocator).toHaveAttribute('data-status', data.status);

      // Verify tags
      for (const tag of data.tags) {
        await expect(taskLocator.locator(`.tag:has-text("${tag}")`)).toBeVisible();
      }
    });
  }
});