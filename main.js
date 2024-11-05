import playwright from 'playwright';
import { delay } from './utils.js';

(async () => {
  const browser = await playwright.chromium.launch(); // or 'firefox' or 'webkit'
  const context = await browser.newContext();
  const page = await context.newPage();

  // Array to store the image data
  const imagesArray = [];

  // Define the URL
  const url = 'https://www.aiscribbles.com/img/random/';
  await page.goto(url);

  // Extract image src from the specified div
  const imageSrc = await page.$eval(
    'div.col-12.col-md-7.col-lg-8.col-xl-9 img',
    img => img.getAttribute('src')
  );

  const h1Text = await page.$eval(
    'div.mt-3 h1.fs-4',
    h1 => h1.textContent
  );
  const cleanedTitle = h1Text ? h1Text.replace('— Free Stock Image', '').trim() : 'Untitled';

  // Add the image and title as an object to the array
  imagesArray.push({ src: imageSrc, title: cleanedTitle });

  // Print the array
  console.log(imagesArray);

  // Clean up
  await context.close();
  await browser.close();
  await delay(1000);
})();
