import { test, expect } from '@playwright/test';
// Importing test data from JSON file
import testData from './data.json';

test.use({ browserName: 'chromium' });

const APP_URL = process.env.APP_URL || 'https://animated-gingersnap-8cf7f2.netlify.app/';
const USERNAME = process.env.TEST_USERNAME || 'admin';
const PASSWORD = process.env.TEST_PASSWORD || 'password123';
const CLEAR_COOKIES = (process.env.CLEAR_COOKIES || 'false') === 'true';

// Warn about default credentials usage
if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
  console.warn('Default login credentials are being used. Please configure TEST_USERNAME and TEST_PASSWORD for secure login.');
}

// Clear cookies and local storage between tests if required
test.afterEach(async ({ page }) => {
  if (CLEAR_COOKIES) {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  }
});

// Helper function to dynamically navigate to the correct section and validate task visibility
const verifyTaskVisibility = async (page, taskName, section) => {
  if (section === "Mobile Application") {
    // Step for Mobile Application: Click 'Mobile Application Native' button
    console.log("Navigating to the Mobile Application...");
    const mobileAppNativeButton = page.getByRole('button', { name: 'Mobile Application Native' });
    await mobileAppNativeButton.click();

    // Wait for the banner heading for Mobile Application
    await page.getByRole('banner').getByRole('heading', { name: 'Mobile Application' }).click();
  } else {
    // Navigate directly to the section for other cases (e.g., Web Application)
    console.log(`Navigating to the ${section} section...`);
    await page.getByRole('banner').getByRole('heading', { name: section }).click();
  }

  // Validate visibility of the task by its heading name
  console.log(`Validating visibility of the task: '${taskName}'`);
  const task = page.getByRole('heading', { name: taskName }); // Simplified locator for the task
  await expect(task).toBeVisible(); // Expect the task to be visible
};

// Group tests in a describe block
test.describe('Data-Driven Tests for Demo App', () => {
  // Loop through all test data and dynamically generate test cases
  testData.forEach(({ description, section, column, taskName, tags }) => {
    test(description, async ({ page }) => {
      // Navigate to app
      await page.goto(APP_URL);

      // Login using credentials
      console.log("Logging in...");
      await page.getByRole('textbox', { name: 'Username' }).fill(USERNAME);
      await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Wait for the app to load
      await page.waitForLoadState('domcontentloaded');

      // Verify task dynamically, handling section-specific requirements
      await verifyTaskVisibility(page, taskName, section);

      // (Optional) Log additional information for debugging or reporting
      console.log(`Task '${taskName}' was successfully verified in section '${section}' under the '${column}' column.`);
    });
  });
});