import { launchBrowser } from '../utils.js';

// what do you want to scrape?
const url = 'https://www.change.org/p/united-states-fish-wildlife-service-manatees-are-dying-at-record-speed-they-need-endangered-species-act-protections-now';

launchBrowser(async ({ page, screenshot }) => {
  // navigate to url in browser
  await page.goto(url);
  await screenshot();

  // locate an element on the page
  // docs: https://playwright.dev/docs/locators

  const heading = page.getByRole('heading').first();
  console.log(await heading.textContent());

  const decisionMaker = page.getByRole('heading', { name: /Decision Makers/i })
    .locator('..')
    .getByRole('listitem')
    .getByRole('link')
    .first();

  // or since there happens to be a test-id:
  // const decisionMaker = page.getByTestId('dm-link');

  const decisionMakerName = await decisionMaker.textContent();
  const decisionMakerUrl = await decisionMaker.evaluate(e => e.href);
  console.log(`Decision Maker: ${decisionMakerName} (${decisionMakerUrl})`);




  // CSS selectors
  const description = page.locator('[data-qa="description-content"]').first();
  const boldStatements = description.locator('strong');
  for (const statement of await boldStatements.all()) {
    console.log(await statement.textContent());
  }




  // more locators: https://playwright.dev/docs/other-locators
  const signaturesBox = page.getByText('Signatures', { exact: true }).first().locator('../..');
  const signatures = await signaturesBox.locator('div').nth(0).textContent();
  const goal = await signaturesBox.locator('div').nth(1).textContent();
  console.log(`Signatures: ${signatures} / ${goal}`);

}, { headless: false, slowMo: 500 });
