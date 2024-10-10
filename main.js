import playwright from 'playwright';
import { delay } from './utils.js';

{
  const browser = await playwright.chromium.launch(); // or 'firefox' or 'webkit'
  const context = await browser.newContext();
  const page = await context.newPage();

  const url = 'https://en.wikipedia.org/wiki/World_Wide_Web';
  await page.goto(url);

  const firstGraf = await page.$('#mw-content-text p:not(.mw-empty-elt)');
  console.log(await firstGraf.textContent());

  await page.screenshot({ path: `screenshots/example.png` });
  console.log(`Saved screenshot to screenshots/example.png`);

  // clean up
  await context.close();
  await browser.close();
  await delay(1000);
}

{
  const browser = await playwright.chromium.launch({ headless: false }); // or 'firefox' or 'webkit'
  const context = await browser.newContext();
  const page = await context.newPage();

  const youDidIt = 'https://media1.tenor.com/m/9ItR8nSuxE0AAAAC/thumbs-up-computer.gif';
  await page.goto(youDidIt);
  await delay(6000);

  // clean up
  await context.close();
  await browser.close();
}
