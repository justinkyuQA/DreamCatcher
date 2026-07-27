import { chromium } from "playwright";
import fs from "fs-extra";

const browser = await chromium.launch({
  headless: false
});

const page = await browser.newPage();

console.log("You have 30 seconds to open ChatGPT and a conversation...");
await page.waitForTimeout(30000);

let messages = [];
let previous = 0;

while (true) {

  const current = await page.$$eval(
    '[data-message-author-role]',
    nodes =>
      nodes.map(n => ({
        role: n.getAttribute("data-message-author-role"),
        text: n.innerText
      }))
  );

  if (current.length > previous) {
    messages = current;
    previous = current.length;
    console.log("Captured:", previous);
  }

  await page.evaluate(() => {
    window.scrollBy(0,1000);
  });

  await page.waitForTimeout(100);

  const done = await page.evaluate(() =>
    window.innerHeight + window.scrollY >=
    document.body.scrollHeight - 10
  );

  if (done) break;
}

await fs.ensureDir("captures");

await fs.writeJson(
  "captures/conversation.json",
  {
    capturedAt: new Date().toISOString(),
    messages
  },
  { spaces: 2 }
);

console.log("Conversation saved.");

await browser.close();
