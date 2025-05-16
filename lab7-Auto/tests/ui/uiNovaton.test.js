import puppeteer from 'puppeteer';

describe('UI тестування сайту novaton.ua', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ 
      headless: true,    
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

  test('Головна сторінка містить логотип, меню, пошук і банер', async () => {
    await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });

    const logo = await page.$('g#Logo');
    expect(logo).not.toBeNull();

    const search = await page.$('input[type="search"]');
    expect(search).not.toBeNull();

    const banner = await page.$('.catalog-menu-tires');
    expect(banner).not.toBeNull();

    const menuItems = await page.$$('div#top-menu a');
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test('Пошук по слову "Стартер" повертає результати', async () => {
    await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });

    await page.type('input[type="search"]', 'Стартер');
    await page.keyboard.press('Enter');

    await page.waitForSelector('.shop_items .item_from-shop');
    const items = await page.$$('.shop_items .item_from-shop');

    expect(items.length).toBeGreaterThan(0);
  });

  test('Перехід у категорію "Мости" відображає список товарів', async () => {
    await page.goto('https://novaton.ua/categories/mosty', { waitUntil: 'networkidle2' });

    const title = await page.$eval('h1.text-lato-bold', el => el.textContent?.toLowerCase());
    expect(title).toContain('мости');

    const products = await page.$$('.shop_items .item_from-shop');
    expect(products.length).toBeGreaterThan(0);
  });

  test('Додавання товару до кошика', async () => {
    await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });

    await page.type('input[type="search"]', 'Стартер');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.shop_items .item_from-shop');

    const firstProduct = await page.$('.shop_items .item_from-shop');
    await firstProduct?.click();

    await page.waitForSelector('div.my-3 button.bg-yellow');
    await page.click('div.my-3 button.bg-yellow');

    await page.click('#cart-header');
    await page.waitForSelector('.cart-section');

    const cartItems = await page.$$('.cart-section section.my-5');
    expect(cartItems.length).toBeGreaterThan(0);
  });

  test('Клік на логотип повертає на головну сторінку', async () => {
    await page.goto('https://novaton.ua/categories/mosty', { waitUntil: 'networkidle2' });

    await page.click('g#Logo');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const currentUrl = page.url();
    expect(currentUrl).toBe('https://novaton.ua/');
  });
});