import { launchBrowser, parseSitemap, delay } from '../utils.js';

// Find a sitemap.xml file
const sitemapUrl = '';
const sitemap = await parseSitemap(sitemapUrl);

console.log(sitemap);


// launchBrowser(async ({ page, screenshot }) => {

// }, { headless: false, slowMo: 500 });
