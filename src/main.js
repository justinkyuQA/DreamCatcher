const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto('https://chatgpt.com');

  console.log('DreamCatcher ready.');
  console.log('Please log in if necessary.');
  console.log('Press Ctrl+C when finished.');

  await page.waitForTimeout(600000);
})();
