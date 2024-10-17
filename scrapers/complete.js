import { appendToFile, delay, launchBrowser, parseSitemap } from '../utils.js';

const sitemapIndexUrl = 'https://www.change.org/sitemap.xml';
const index = await parseSitemap(sitemapIndexUrl);

const sitemapUrl = index.sitemapUrls[1];
const sitemap = await parseSitemap(sitemapUrl);
// const decisionMakers = await parseSitemap('https://www.change.org/sitemap-decision_makers.xml');
// console.log(decisionMakers.urls);

launchBrowser(async ({ page, screenshot }) => {
  for (const [index, url] of sitemap.urls.slice(8, 100).entries()) {
    console.log(index, url);
    await page.goto(url);
    await screenshot();

    const description = await page.locator('[data-qa="description-content"]').first().textContent();
    const matches = /[^\w](we\s.*?)[\.,!\n]/gi.exec(description);
    if (matches) {
      const lines = matches.slice(1).map((line) => line.trim());
      console.log(lines);
      await appendToFile('statements', `${lines}`);
    }

    await delay(1000 + (Math.random() * 5000));
  }
}, { headless: true, slowMo: 50 });
