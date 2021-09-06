const puppeteer = require('puppeteer');

const checkin = async () => {
  const username = process.env.HAIDAN_USERNAME;
  const password = process.env.HAIDAN_PASSWORD;
  if (!username || !password) {
    throw new Error('Please specify username and password');
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.haidan.video/index.php');
  await page.type('input[name="username"]', username); // Types instantly
  await page.type('input[name="password"]', password); // Types instantly
  await page.click('input[type="submit"]');

  await page.waitForTimeout(5000);
  await page.waitForSelector('#modalBtn', { timeout: 5000 });
  const modalBtn = await page.$('#modalBtn');
  const modalButtonText = await page.evaluate((el: Node) => {
    return (el as HTMLInputElement).value;
  }, modalBtn);

  if (modalButtonText === '已经打卡') {
    console.log('Already checked In.');
  } else {
    await page.click('#modalBtn');
  }
  await browser.close();
};

(async () => {
  try {
    await checkin();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();

module.exports = {};
