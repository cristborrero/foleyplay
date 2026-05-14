const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Login first if needed
  await page.goto('http://localhost:3000/login');
  // Fill the form or wait
  // Actually, since we want to bypass auth just for testing, maybe we can mock the session?
  
  // Or we can just log in
  try {
    await page.type('input[type="email"]', 'cristborrero@gmail.com');
    await page.type('input[type="password"]', '123456'); // Wait, I don't know the password
  } catch(e) {}
  
  await browser.close();
})();
