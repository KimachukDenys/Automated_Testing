/**
 * UI-тести для novaton.ua.
 * Усі селектори й повторювані дії винесені в helper.js.
 */

import {
  launchBrowser,
  searchProduct,
  openFirstProduct,
  SELECTORS,
} from '../data/helper.js';

describe('UI тестування сайту novaton.ua', () => {
  let browser;
  let page;

  /* ---------- налаштування ---------- */

  beforeAll(async () => {
    browser = await launchBrowser();              // Запускаємо Puppeteer з одним конфігом
    page = await browser.newPage();
    await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });
  }, 30_000);

  afterAll(() => browser.close());

  /* ---------- перевірки UI ---------- */

  test('Головна сторінка містить логотип, меню, пошук і банер', async () => {
    // ✔ Якщо якусь з цих частин прибрати у верстці — тест упаде
    expect(await page.$(SELECTORS.logo)).not.toBeNull();
    expect(await page.$(SELECTORS.searchInput)).not.toBeNull();
    expect(await page.$(SELECTORS.banner)).not.toBeNull();

    const menuItems = await page.$$(SELECTORS.menuItems);
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test('Пошук по слову "Стартер" повертає результати', async () => {
    await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });

    await searchProduct(page, 'Стартер');                    
    const items = await page.$$(SELECTORS.firstProduct);

    expect(items.length).toBeGreaterThan(0);
  });

  test('Перехід у категорію "Мости" відображає список товарів', async () => {
    await page.goto('https://novaton.ua/categories/mosty', { waitUntil: 'networkidle2' });

    const title = await page.$eval(SELECTORS.categoryTitle, el => el.textContent.toLowerCase());
    expect(title).toContain('мости');

    const products = await page.$$(SELECTORS.firstProduct);
    expect(products.length).toBeGreaterThan(0);
  });

  test('Додавання товару до кошика', async () => {
    await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });

    await searchProduct(page, 'Стартер');
    await openFirstProduct(page);

    await page.waitForSelector(SELECTORS.addToCartBtn);
    await page.click(SELECTORS.addToCartBtn);

    await page.click(SELECTORS.cartLink);
    await page.waitForSelector(SELECTORS.cartSection);

    const cartItems = await page.$$(SELECTORS.cartItemContainer);
    expect(cartItems.length).toBeGreaterThan(0);
  });

  test('Клік на логотип повертає на головну сторінку', async () => {
    await page.goto('https://novaton.ua/categories/mosty', { waitUntil: 'networkidle2' });

    await page.click(SELECTORS.logo);
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    expect(page.url()).toBe('https://novaton.ua/');
  });
});
