    import { test, expect } from '@playwright/test';
    import testData from './data.json'; // Import JSON with ES syntax

     const BASE_URL = 'https://animated-gingersnap-8cf7f2.netlify.app/';
     const EMAIL = 'admin';
     const PASSWORD = 'password123';

     test.describe('Data-Driven Tests for Demo App', () => {
       // Reusable login function
       async function login(page) {
         await page.goto(BASE_URL);
         await page.fill('input[name="email"]', EMAIL);
         await page.fill('input[name="password"]', PASSWORD);
         await page.click('button:has-text("Log In")');
         expect(await page.locator('text=Welcome').isVisible()).toBeTruthy(); // Confirm login
       }

       // Iterate through testData and dynamically create tests
       for (const data of testData) {
         test(`Verify task "${data.task}" in ${data.application}`, async ({ page }) => {
           await login(page);

           // Navigate to the appropriate application
           await page.click(`text=${data.application}`);

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