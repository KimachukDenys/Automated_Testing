import puppeteer from 'puppeteer';

describe('Novaton.ua E2E Tests (Puppeteer)', () => {
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
  }, 30_000);

  afterAll(async () => {
    await browser.close();
  });

  async function isVisible(page, selector) {
    try {
      return await page.$eval(selector, el => {
        const style = window.getComputedStyle(el);
        return (
          style &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          el.offsetHeight > 0 &&
          el.offsetWidth > 0
        );
      });
    } catch {
      return false;
    }
  }

  test('Пошук товару "Стартер", відкриття першої сторінки товару, додавання в кошик', async () => {
      // Очікуємо поле пошуку, вводимо "Стартер" і натискаємо Enter
      await page.waitForSelector('input[type="search"]');
      await page.type('input[type="search"]', 'Стартер');
      await page.keyboard.press('Enter');

      // Чекаємо, поки з'являться результати пошуку
      await page.waitForSelector('.shop_items .item_from-shop');
      
      // Перевіряємо, що результати пошуку відображаються, та кілаємо перший товар
      const firstItem = await page.$$('.shop_items .item_from-shop');
      expect(firstItem.length).toBeGreaterThan(0);
      await firstItem[0].click();
      
      // Чекаємо, поки з'явиться кнопка "Додати в кошик", та додаємо товар
      await page.waitForSelector('.my-3');
      await page.click('div.my-3 button.bg-yellow');
      
      // Натискаємо на кнопку "Перейти до кошика"
      await page.click('a#cart-header');
      
      // Перевіряємо, що товар успішно додано в кошик
      await page.waitForSelector('.cart-section', { visible: true });
      expect(await isVisible(page, 'section.my-5')).toBe(true);
    },
    30_000,
  );

  test('Зміна кількості товару в кошику', async () => {
      await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });

      // Пошук і додавання товару
      await page.waitForSelector('input[type="search"]');
      await page.type('input[type="search"]', 'Стартер');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.shop_items .item_from-shop', { visible: true });
      const items = await page.$$('.shop_items .item_from-shop');
      expect(items.length).toBeGreaterThan(0);
      await items[0].click();

      await page.waitForSelector('div.my-3 button.bg-yellow', { visible: true });
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.click('div.my-3 button.bg-yellow');

      // Перейти до кошика
      await page.click('a#cart-header');
      await page.waitForSelector('.cart-section', { visible: true });

      // Знайти інпут кількості товару
      await page.waitForSelector('div.control input[type="text"]', { visible: true });
      const qtyInputSelector = 'div.control input[type="text"]';

      await page.click(qtyInputSelector, { clickCount: 3 });
      await page.type(qtyInputSelector, '2');
      await page.keyboard.press('Enter');

      // Перевірити, що інпут має значення 2
      const quantity = await page.$eval(qtyInputSelector, el => el.value);
      expect(quantity).toBe('2');
    },
    40_000,
  );

  test('Перевірка сторінки "Контакти"', async () => {
      await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });

      // Клік на посилання "Контакти" в футері
      await page.waitForSelector('div#top-menu a[href="/page/contacts"]', { visible: true });
      await page.click('div#top-menu a[href="/page/contacts"]');

      // Перевірка наявності заголовка або контактної інформації
      await page.waitForSelector('h1.text-lato-bold', { visible: true });
      const heading = await page.$eval('h1.text-lato-bold', el => el.textContent);
      expect(heading.toLowerCase()).toContain('контакт');
    },
    20_000,
  );

  test('Відкриття категорії "Мости" через головну', async () => {
    await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });

    // Знайти посилання на категорію (може знадобитися оновити селектор)
    await page.waitForSelector('div.dropdown-menu-animation')
    await page.click('div.dropdown-menu-animation');
    await page.waitForSelector('div.has-link a[href="/categories/mosty"]', { visible: true });
    await page.click('div.has-link a[href="/categories/mosty"]');

    await page.waitForSelector('h1.text-lato-bold', { visible: true });
    // Перевірка заголовку категорії
    const categoryTitle = await page.$eval('h1.text-lato-bold', el => el.textContent?.trim());
    expect(categoryTitle).toContain('Мости');
  }, 30000);

  test('Додавання автомобіля, пошук по автомобілю', async () => {
    await page.goto('https://novaton.ua/', { waitUntil: 'networkidle2' });
    await page.evaluate(() => window.scrollBy(0, 300));

    // Клік по кнопці "Додати автомобіль"
    await page.waitForSelector('button[title="ДОДАТИ АВТОМОБІЛЬ"]', { visible: true });
    await page.click('button[title="ДОДАТИ АВТОМОБІЛЬ"]');

    await page.waitForSelector('a#brand-label', { visible: true });

    // Клік по бренду
    // Знайти елемент ALFA ROMEO
    let alfaRomeo = await page.waitForSelector(
      '::-p-xpath(//*[@id="brand-content"]/div/div[2]/a[10]/span)',
      { visible: true }
    );    
    if (!alfaRomeo) throw new Error('ALFA ROMEO not found');

    // Клік по елементу
    await page.evaluate(el => el.click(), alfaRomeo);

    // Клік по моделі
    await page.waitForSelector('div#model-content a span');
    let afModel = await page.waitForSelector(
      '::-p-xpath(//*[@id="model-content"]/div/div[2]/a[7]/span)',
      { visible: true }
    );   
    await page.evaluate(el => el.click(), afModel);
    
    // Клік по типу мотора
    await page.waitForSelector('div#type-content a span');
    let engineType = await page.waitForSelector(
      '::-p-xpath(//*[@id="type-content"]/div/div[2]/a[3]/span)',
      { visible: true }
    );   
    await page.evaluate(el => el.click(), engineType);

    // Клік сторінкці із філтрами для ALFA ROMEO 159
    const engDetails = await page.waitForSelector('::-p-xpath(//*[@id="__layout"]/div/section[1]/div[1]/div[5]/div[9]/div[2]/div[3]/a)');
    await page.evaluate(el => el.click(), engDetails);
    
    // Перевірка заголовку сторінки
    await page.waitForSelector('h1.text-lato-bold');
    const engTitle = await page.$eval('h1.text-lato-bold', el => el.textContent?.trim());
    expect(engTitle).toContain('Фільтри для ALFA ROMEO 159 (939) 1.9 JTDM 16V');
  }, 30000);
});
