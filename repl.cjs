const playwright = require("playwright");

(async () => {
  global.browser = await playwright.chromium.launch({ headless: false }); // or 'firefox' or 'webkit'
  global.context = await global.browser.newContext();
  global.page = await global.context.newPage();

  console.log('page is ready');
})();

const cleanup = async () => {
  console.log('Closing browser...');
  await global.context.close();
  await global.browser.close();
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
