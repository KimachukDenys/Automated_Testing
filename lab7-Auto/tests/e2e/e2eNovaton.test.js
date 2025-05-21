import {
  launchBrowser,
  searchProduct,
  openFirstProduct,
  isVisible,
  SELECTORS,
} from '../data/helper.js';

describe('Novaton.ua E2E Tests', () => {
  let browser;
  let page;
  const BASE = 'https://novaton.ua/';

  beforeAll(async () => {
    browser = await launchBrowser();
    page = await browser.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle2' });
  }, 30_000);

  afterAll(() => browser.close());

  /* ---------- tests ---------- */

  test(
    'Пошук "Стартер" і додавання першого товару в кошик',
    async () => {
      await searchProduct(page, 'Стартер');
      await openFirstProduct(page);

      await page.waitForSelector(SELECTORS.addToCartBtn);
      await page.click(SELECTORS.addToCartBtn);

      await page.click(SELECTORS.cartLink);
      await page.waitForSelector(SELECTORS.cartSection, { visible: true });
      expect(await isVisible(page, SELECTORS.cartSection)).toBe(true);
    },
    30_000
  );

  test(
    'Зміна кількості товару в кошику до 2',
    async () => {
      await page.goto(BASE, { waitUntil: 'networkidle2' });
      await searchProduct(page, 'Стартер');
      await openFirstProduct(page);

      await page.waitForSelector(SELECTORS.addToCartBtn);
      await page.click(SELECTORS.addToCartBtn);

      await page.click(SELECTORS.cartLink);
      await page.waitForSelector(SELECTORS.qtyInput);

      await page.click(SELECTORS.qtyInput, { clickCount: 3 });
      await page.type(SELECTORS.qtyInput, '2');
      await page.keyboard.press('Enter');

      const qty = await page.$eval(SELECTORS.qtyInput, el => el.value.replace(/\D/g, ''));
      expect(qty).toBe('2');
    },
    40_000
  );

  test(
    'Перехід на сторінку "Контакти"',
    async () => {
      await page.goto(BASE, { waitUntil: 'networkidle2' });
      await page.waitForSelector(SELECTORS.contactsLink, { visible: true });
      await page.click(SELECTORS.contactsLink);

      await page.waitForSelector(SELECTORS.contactsTitle, { visible: true });
      const h1 = await page.$eval(SELECTORS.contactsTitle, el => el.textContent.toLowerCase());
      expect(h1).toContain('контакт');
    },
    20_000
  );

  test(
    'Відкриття категорії "Мости" з головної',
    async () => {
      await page.goto(BASE, { waitUntil: 'networkidle2' });

      await page.waitForSelector(SELECTORS.dropdownAnim);
      await page.click(SELECTORS.dropdownAnim);

      await page.waitForSelector(SELECTORS.mostyLink, { visible: true });
      await page.click(SELECTORS.mostyLink);

      await page.waitForSelector(SELECTORS.categoryTitle, { visible: true });
      const title = await page.$eval(SELECTORS.categoryTitle, el => el.textContent.trim());
      expect(title).toContain('Мости');
    },
    30_000
  );

  /*  ---- авто‑підбір авто (XPath залишаються незмінними) ----  */

  test(
    'Додавання автомобіля → пошук запчастин по ALFA ROMEO 159',
    async () => {
      await page.goto(BASE, { waitUntil: 'networkidle2' });
      await page.evaluate(() => window.scrollBy(0, 300));

      await page.waitForSelector('button[title="ДОДАТИ АВТОМОБІЛЬ"]', { visible: true });
      await page.click('button[title="ДОДАТИ АВТОМОБІЛЬ"]');

      /* --- brand / model / engine через XPath --- */
      const brand = await page.waitForSelector('::-p-xpath(//*[@id="brand-content"]/div/div[2]/a[10]/span)', { visible: true });
      await page.evaluate(el => el.click(), brand);

      const model = await page.waitForSelector('::-p-xpath(//*[@id="model-content"]/div/div[2]/a[7]/span)', { visible: true });
      await page.evaluate(el => el.click(), model);

      const engine = await page.waitForSelector('::-p-xpath(//*[@id="type-content"]/div/div[2]/a[3]/span)', { visible: true });
      await page.evaluate(el => el.click(), engine);

      const detailsLink = await page.waitForSelector(
        '::-p-xpath(//*[@id="__layout"]/div/section[1]/div[1]/div[5]/div[9]/div[2]/div[3]/a)'
      );
      await page.evaluate(el => el.click(), detailsLink);

      await page.waitForSelector('h1.text-lato-bold');
      const header = await page.$eval('h1.text-lato-bold', el => el.textContent.trim());
      expect(header).toContain('Фільтри для ALFA ROMEO 159 (939) 1.9 JTDM 16V');
    },
    30_000
  );
});
