import fs from 'fs/promises';
import { launchBrowser, parseSitemap, delay } from '../utils.js';

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

launchBrowser(async ({ page, screenshot }) => {
  for (let i = startIndex; i < max; i++) {
    const url = sitemap.urls[i];
    await page.goto(url);

    await screenshot();


    await fs.writeFile('data/index.txt', i.toString());
    // add random delay to prevent rate limiting or bot detection
    await delay(1000 + (Math.random() * 5000));
  }
}, { headless: true, slowMo: 50 });
