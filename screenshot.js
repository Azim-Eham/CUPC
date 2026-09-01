const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a desktop size
  await page.setViewport({ width: 1280, height: 800 });
  
  // Navigate to localhost
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Take screenshot
  await page.screenshot({ path: 'preview.png', fullPage: true });
  
  await browser.close();
  console.log('preview.png created');
})();
