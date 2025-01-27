import { test, expect } from '@playwright/test';
import testData from './data.json';

test.use({ browserName: 'chromium' });

const APP_URL = process.env.APP_URL || 'https://animated-gingersnap-8cf7f2.netlify.app/';
const USERNAME = process.env.TEST_USERNAME || 'admin';
const PASSWORD = process.env.TEST_PASSWORD || 'password123';
const CLEAR_COOKIES = (process.env.CLEAR_COOKIES || 'false') === 'true';

if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
  console.warn('Using default credentials: please update TEST_USERNAME and TEST_PASSWORD for security!');
}

// Clears cookies and local storage between tests if needed
test.afterEach(async ({ page }) => {
  if (CLEAR_COOKIES) {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  }
});

/**
 * Verify visibility of a task (heading) and its tags.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} taskName
 * @param {string} section
 * @param {string[]} tags
 */
const verifyTaskVisibility = async (page, taskName, section, tags) => {
  // Navigate to the relevant page section
  if (section === 'Mobile Application') {
    console.log('Navigating to Mobile Application...');
    await page.getByRole('button', { name: 'Mobile Application Native' }).click();
    await page.getByRole('banner').getByRole('heading', { name: 'Mobile Application' }).click();
  } else {
    console.log(`Navigating to ${section} section...`);
    await page.getByRole('banner').getByRole('heading', { name: section }).click();
  }

  console.log(`Checking task: "${taskName}"`);
  // Check the main task heading
  await expect(page.getByRole('heading', { name: taskName })).toBeVisible();

  // Verify each tag using the locator variants provided
  for (const tag of tags) {
    console.log(`Verifying tag: "${tag}"`);

    if (tag === 'Feature') {
      // Variant A: first matching element
      await expect(page.getByText('Feature').first()).toBeVisible();

      // Variant B: nth(1)
      // await expect(page.getByText('Feature').nth(1)).toBeVisible();

      // Variant C: filtering a div with exact text, then locating an inner span
      // await expect(page.locator('div').filter({ hasText: /^Feature$/ }).locator('span')).toBeVisible();

    } else if (tag === 'High Priority') {
      // Variant A: first match
      await expect(page.getByText('High Priority').first()).toBeVisible();

      // Variant B: simple getByText
      // await expect(page.getByText('High Priority')).toBeVisible();

    } else if (tag === 'Bug') {
      // Exact match for "Bug"
      await expect(page.getByText('Bug', { exact: true })).toBeVisible();

    } else if (tag === 'Design') {
      // Exact match for "Design"
      await expect(page.getByText('Design', { exact: true })).toBeVisible();

    } else {
      // Fallback for any other tags, if needed
      await expect(page.getByText(tag)).toBeVisible();
    }
  }
};

test.describe('Data-Driven Tests for Demo App', () => {
  testData.forEach(({ description, section, column, taskName, tags }) => {
    test(description, async ({ page }) => {
      // 1) Navigate to the application
      await page.goto(APP_URL);

      // 2) Log in
      console.log('Logging in...');
      await page.getByRole('textbox', { name: 'Username' }).fill(USERNAME);
      await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // 3) Wait for everything to load
      await page.waitForLoadState('domcontentloaded');

      // 4) Verify the specified task (and its tags) in the given section
      await verifyTaskVisibility(page, taskName, section, tags);

      // 5) Log the result
      console.log(`Task "${taskName}" verified under "${section}" in the "${column}" column.`);
    });
  });
});