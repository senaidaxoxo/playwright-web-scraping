import { launchBrowser } from '../utils.js';

// what do you want to scrape?
const url = '';

launchBrowser(async ({ page, screenshot }) => {
  // navigate to url in browser
  await page.goto(url);
  await screenshot();

  // interaction docs: https://playwright.dev/docs/input

}, { headless: false, slowMo: 500 });
