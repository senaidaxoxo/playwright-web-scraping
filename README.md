# Intro to Web Scraping

## Setup

**System requirements**
- Node.js 18+
- Windows 10+, Windows Server 2016+ or Windows Subsystem for Linux (WSL).
- macOS 13 Ventura, or macOS 14 Sonoma.
- Debian 11, Debian 12, Ubuntu 20.04 or Ubuntu 22.04, Ubuntu 24.04, on x86-64 and arm64 architecture.



1. Clone the repo

```
git clone https://github.com/ericrav/playwright-web-scraping.git
cd playwright-web-scraping
```

2. Install Node and dependencies

You must have Node.js version >= 18 to run Playwright and this repo.
Check your node version with `node -v` in the terminal.
If you don't have the right version, try installing [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to install and use the latest version.

Then, install the dependencies:

```
npm install
```

Then, install browser binaries used by Playwright with:
```
npx playwright install --with-deps
```

More info: https://playwright.dev/docs/browsers


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
