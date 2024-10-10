# Intro to Web Scraping

## Setup

1. Clone the repo

```
git clone https://github.com/ericrav/playwright-web-scraping.git
cd playwright-web-scraping
```

2. Install Node and dependencies

You must have Node.js version >= 18 to run Playwright and this repo.
Check your node version with `node -v` in the terminal.
If you don't have the right version, try install [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to install and use the latest version.

Then, install the dependencies:

```
npm install
```

3. Run example scraper

```
npm run scrape
```

You should see a Chromium browser window open and close automatically, a snippet of text printed in your terminal, and an image saved to the `./screenshots` directory. Now you're ready to scrape the web!

## Playwright

### Codegen


```
npx playwright codegen nyu.edu
```
