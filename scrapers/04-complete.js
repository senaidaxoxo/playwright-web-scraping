import fs from 'fs/promises';
import { launchBrowser, parseSitemap, delay, appendToFile } from '../utils.js';

const sitemapIndexUrl = 'https://www.change.org/sitemap.xml';
const index = await parseSitemap(sitemapIndexUrl);

const sitemapUrl = index.sitemapUrls[1];
const sitemap = await parseSitemap(sitemapUrl);

const startIndex = await (async () => {
  try {
    const data = await fs.readFile('data/index.txt', 'utf-8');
    return parseInt(data, 10);
  } catch {
    return 0;
  }
})();

const max = startIndex + 25;

launchBrowser(
  async ({ page, screenshot }) => {
    for (let i = startIndex; i < max; i++) {
      const url = sitemap.urls[i];
      await page.goto(url);
      await screenshot();

      // scroll page down a few times to load more content
      await page.keyboard.press('Space');
      await page.keyboard.press('Space');

      const description = await page
        .locator('[data-qa="description-content"]')
        .first()
        .textContent();
      const matches = /[^\w](we\s.*?)[\.,!\n]/gi.exec(description);
      if (matches) {
        const lines = matches.slice(1).map((line) => line.trim());
        console.log(lines);
        await appendToFile('statements', `${lines}`);
      }

      const heading = page.getByText(/Reasons for signing/i).first();
      try {
        await heading.scrollIntoViewIfNeeded({ timeout: 3000});
      } catch {
        // sometimes the page renders with an entirely different comment section — possible A/B test?
        continue;
      }
      if (await heading.count()) {
        await screenshot();

        try {
          await page
            .getByRole('button', { name: /View all reasons/i })
            .first()
            .click({ timeout: 3000 });
        } catch {

        }

        const reasons = heading.locator('..').getByRole('listitem');
        for (const reason of await reasons.all()) {
          const readMore = reason.getByRole('button', { name: /Read more/i });
          if ((await readMore.count()) > 0) {
            await readMore.click();
          }
          const reasonText = await reason
            .getByRole('link')
            .locator('> div:last-child')
            .innerText();

          const matches = /[^\w](we\s.*?)[\.,!\n]/gi.exec(reasonText);
          if (matches) {
            const lines = matches.slice(1).map((line) => line.trim());
            console.log(lines);
            await appendToFile('statements', `${lines}`);
          }
        }
      }

      await fs.writeFile('data/index.txt', i.toString());
      // add random delay to prevent rate limiting or bot detection
      await delay(1000 + Math.random() * 5000);
    }
  },
  { headless: true, slowMo: 50 }
);
