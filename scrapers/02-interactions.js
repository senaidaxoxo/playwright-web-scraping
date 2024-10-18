import { launchBrowser } from '../utils.js';

// what do you want to scrape?
const url = 'https://www.change.org/search';

launchBrowser(async ({ page, screenshot }) => {
  // navigate to url in browser
  await page.goto(url);

  // interaction docs: https://playwright.dev/docs/input

  const searchBox = page.getByRole('searchbox', { name: /Search petitions/i});
  await searchBox.fill('cats');

  await page.getByRole('button', { name: /Search/i }).click();

  const result = page.locator('[data-qa="search-petition-card"]').first();

  // wait for results to load
  await result.waitFor({ timeout: 20000 });

  const navigationPromise = page.waitForNavigation();
  await result.getByRole('link').first().click();

  await navigationPromise;

  // scroll page down a few times to load more content
  await page.keyboard.press('Space');
  await page.keyboard.press('Space');

  const heading = page.getByText(/Reasons for signing/i).first();
  try {
    await heading.scrollIntoViewIfNeeded();
  } catch {
    // sometimes the page renders with an entirely different comment section — possible A/B test?
    return;
  }
  if (await heading.count()) {
    await screenshot();
    await page.getByRole('button', { name: /View all reasons/i }).first().click();

    const reasons = heading.locator('..').getByRole('listitem');
    for (const reason of await reasons.all()) {
      const readMore = reason.getByRole('button', { name: /Read more/i });
      if (await readMore.count() > 0) {
        await readMore.click();
      }
      console.log(await reason.getByRole('link').locator('> div:last-child').innerText());
    }
  }

}, { headless: false, slowMo: 500 });
