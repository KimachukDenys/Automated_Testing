import puppeteer from "puppeteer";

/* для запуску тестів використовуйте команду: npm test для запуску всіх тестів,
або npm run puppeteer, для запуску puppeteer.test.js*/

describe('UI тестування сайту novaton.ua', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ 
      headless: false,    
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--lang=uk-UA,uk',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36',
      ],
      defaultViewport: null,
    });
    page = await browser.newPage();
    await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

	test('Перевірка наявності кнопки ДОДАТИ АВТОМОБІЛЬ', async () => {
		await page.waitForSelector('button[title="ДОДАТИ АВТОМОБІЛЬ"]', { visible: true });
		const addButton = await page.$('button[title="ДОДАТИ АВТОМОБІЛЬ"]');
		expect(addButton).not.toBeNull();

		const isVisible = await addButton.evaluate(el => el.offsetWidth > 0 && el.offsetHeight > 0);
		expect(isVisible).toBe(true);
	});

  test('Клік на логотип повертає на головну сторінку', async () => {
    await page.goto('https://novaton.ua/categories/mosty', { waitUntil: 'networkidle2' });

    await page.click('g#Logo');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const currentUrl = page.url();
    expect(currentUrl).toBe('https://novaton.ua/');
  });
	
	test('Пошук фільтра', async() => {

		const searchInput = await page.waitForSelector('input[type="search"]', { visible: true });
		expect(searchInput).not.toBeNull();

    await page.type('input[type="search"]', 'Фільтр');
    await page.keyboard.press('Enter');

		await page.waitForSelector('.shop_items .item_from-shop', { visible: true });
		const products = await page.$$('.shop_items .item_from-shop');
		expect(products.length).toBeGreaterThan(0);
	});
});