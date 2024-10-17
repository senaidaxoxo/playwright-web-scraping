import { launchBrowser } from '../utils.js';

// what do you want to scrape?
const url = '';

launchBrowser(async ({ page, screenshot }) => {
  // navigate to url in browser
  await page.goto(url);
  await screenshot();

  // locate an element on the page
  // docs: https://playwright.dev/docs/locators

}, { headless: false, slowMo: 500 });
