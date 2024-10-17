// @ts-check

import playwright from 'playwright';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs/promises';

/**
 * @typedef {import('playwright').Page} Page
 * @typedef {import('playwright').BrowserContext} Context
 * @typedef {import('playwright').Browser} Browser
 * @param {(args: {
 *   page: Page,
 *   context: Context,
 *   browser: Browser,
  *  screenshot: (filename?: string) => Promise<Buffer>,
 * }) => void} callback
 * @typedef {'chromium' | 'firefox' | 'webkit'} BrowserType
 * @param {import('playwright').LaunchOptions & { browser?: BrowserType }} opts
 */
export async function launchBrowser(callback, { browser: browserType = 'chromium', ...opts} = {}) {
  const browser = await playwright[browserType].launch(opts);
  const context = await browser.newContext();
  const page = await context.newPage();

  page.setDefaultTimeout(15000);

  async function screenshot(filename) {
    const name = filename || `${(await page.title()).replace(/\s/g, '_')}-${new Date().toJSON()}`;
    const path = `screenshots/${name}.png`;
    console.log(`Saving screenshot to ${path}`);
    return page.screenshot({ path: path });
  }

  try {
    await callback({ page, context, browser, screenshot });
  } catch (error) {
    console.error(error);
    console.error('Encountered an error, closing browser');
  } finally {
    // clean up
    await context.close();
    await browser.close();
  }
}

export function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export async function appendToFile(filename, data) {
  const path = `data/${filename}.txt`;
  await fs.appendFile(path, data + '\n');
  console.log('Appended to file:', path);
}

/**
 * Sitemap schema: https://www.sitemaps.org/protocol.html
 * @param {string} sitemapUrl
 */
export async function parseSitemap(sitemapUrl) {
  if (!sitemapUrl) {
    throw new Error('Must pass a URL');
  }

  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${sitemapUrl}`);
  }

  const text = await res.text();
  const parser = new XMLParser();
  const [map, parseError] = goTry(() => parser.parse(text));
  if (parseError) {
    console.error(parseError);
    throw new Error(`Failed to parse XML: ${parseError}`);
  }

  if ('sitemapindex' in map) {
    /** @type {string[]} */
    const sitemapUrls = map.sitemapindex.sitemap.map((sitemap) => sitemap.loc);
    return {
      sitemapUrls,
      urls: /** @type {string[]} */ ([]),
    };
  }

  if ('urlset' in map) {
    /** @type {string[]} */
    const urls = map.urlset.url.map((url) => url.loc);
    return { urls };
  }

  throw new Error(`Invalid sitemap format`);
}

/**
 * @function
 * @template T
 * @param {() => T} cb
 * @returns {[T, null] | [null, unknown]}
 */
function goTry(cb) {
  try {
    return [cb(), null];
  } catch (error) {
    return [null, error];
  }
}
