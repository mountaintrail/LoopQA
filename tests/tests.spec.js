// noinspection UnreachableCodeJS

import { test, expect } from '@playwright/test';
test.use({ browserName: 'chromium' });
// import testData from './data.json' assert { type: 'json' };

// Environment variables with defaults for flexibility
const APP_URL = process.env.APP_URL || 'https://animated-gingersnap-8cf7f2.netlify.app/';
const USERNAME = process.env.TEST_USERNAME || 'admin';
const PASSWORD = process.env.TEST_PASSWORD || 'password123';
const CLEAR_COOKIES = (process.env.CLEAR_COOKIES || 'false') === 'true';

// Warn if using default credentials
if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
  console.warn('Default login credentials are being used. Please configure TEST_USERNAME and TEST_PASSWORD for secure login.');
}

// Test data in JSON format to drive the test scenarios
const testData = [
  {
    description: "Verify 'Implement user authentication' task",
    section: "Web Application",
    column: "To Do",
    taskName: "Implement user authentication",
    tags: ["Feature", "High Priority"],
  },
  {
    description: "Verify 'Fix navigation bug' task",
    section: "Web Application",
    column: "To Do",
    taskName: "Fix navigation bug",
    tags: ["Bug"],
  },
  {
    description: "Verify 'Design system updates' task",
    section: "Web Application",
    column: "In Progress",
    taskName: "Design system updates",
    tags: ["Design"],
  },
  {
    description: "Verify 'Push notification system' task",
    section: "Mobile Application",
    column: "To Do",
    taskName: "Push notification system",
    tags: ["Feature"],
  },
  {
    description: "Verify 'Offline mode' task",
    section: "Mobile Application",
    column: "In Progress",
    taskName: "Offline mode",
    tags: ["Feature", "High Priority"],
  },
  {
    description: "Verify 'App icon design' task",
    section: "Mobile Application",
    column: "Done",
    taskName: "App icon design",
    tags: ["Design"],
  },
];

// Clear cookies and local storage after each test if CLEAR_COOKIES is set
test.afterEach(async ({ page }) => {
  if (CLEAR_COOKIES) {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  }
      });

// Dynamically create test cases inside a test.describe block
test.describe('Data-Driven Tests for Demo App', () => {
  testData.forEach(({ description, section, column, taskName, tags }) => {
    test(description, async ({ page }) => {
      // Navigate to the target section
      await page.goto(APP_URL);

      // Fill in the username
      await page.getByRole('textbox', { name: 'Username' }).fill(USERNAME);



      // Fill in the password
      await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);

      // Click the submit button
      await page.getByRole('button', { name: 'Sign in' }).click();

      /// Wait for navigation after successful login

// Interact with the 'Web Application' section header (as per locator behavior)
      const sectionHeading = page.getByRole('banner').getByRole('heading', { name: section });
      await sectionHeading.click();

      // Verify task exists in the correct column
      const taskSelector = `div.column-header:has-text("${column}") ~ div.task-list div.task:has-text("${taskName}")`;
      // Helper function to validate task visibility
      const verifyTaskVisibility = async (page, taskName) => {
        const task = page.getByRole('heading', { name: taskName });
        await expect(task).toBeVisible();
      };
// Test suite for dynamic task validation

    }); // End of outer test block
  }); // End of outer test block
  }); // End of test.describe block