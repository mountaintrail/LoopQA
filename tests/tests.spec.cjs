import testData from './data.json';
import { test, expect, chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://animated-gingersnap-8cf7f2.netlify.app/';
const USERNAME = process.env.TEST_USERNAME || 'admin';
const PASSWORD = process.env.TEST_PASSWORD || 'password123';

// Declare browser, context, and page for shared use
let browser;
let context;
let page;

// Setup browser and context before tests
test.beforeAll(async () => {
  browser = await chromium.launch(); // Launch the Chromium browser
  context = await browser.newContext(); // Create a shared browser context
  page = await context.newPage(); // Use a shared page
});

// Clean up browser and context after all tests
test.afterAll(async () => {
  // Cleanup: Close the browser and context
  await context.close();
  await browser.close();
});

// Login before each test
test.beforeEach(async () => {
  await page.goto(BASE_URL);

  // Fill Username field
  const usernameField = page.getByRole('textbox', { name: 'Username' }); // More explicit selector
  await usernameField.fill(USERNAME);

  // Fill Password field
  const passwordField = page.getByRole('textbox', { name: 'Password' }); // More explicit selector
  await passwordField.fill(PASSWORD);

  // Click Sign-in button
  const signInButton = page.locator('button:has-text("Sign in")'); // Handled dynamic text
  await signInButton.click();
  // await page.pause();   // Break
  // Confirm successful login
  const banner = page.getByRole('banner').getByRole('heading', { name: 'Web Application' }); // Adjust as per your app structure
  await banner.waitFor({ state: 'visible', timeout: 60000 });
  await expect(page.getByRole('heading', { name: 'Web Application' })).toBeVisible();
});
test.afterEach(async () => {
  await context.clearCookies();
  await page.evaluate(() => localStorage.clear());
});

test.describe('Data-Driven Tests for Demo App', () => {
  for (const data of testData) {
    test(`Verify task "${data.task}" in ${data.application}`, async () => {
      // Navigate to the application
      await page.click(`text=${data.application}`);
      await expect(page.locator('.task-list')).toBeVisible(); // Verify the task section is shown

      // Verify task and status
      const taskLocator = page.locator(`.task:has-text("${data.task}")`);
      await expect(taskLocator).toBeVisible();
      await expect(taskLocator).toHaveAttribute('data-status', data.status);

      // Verify tags
      for (const tag of data.tags) {
        await expect(taskLocator.locator(`.tag:has-text("${tag}")`)).toBeVisible();
      }
    });
  }
});