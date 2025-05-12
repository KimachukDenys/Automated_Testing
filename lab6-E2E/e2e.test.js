import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

describe('Tabletki.ua E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 50,   args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080',
  ],});
    page = await browser.newPage();
    await page.goto('https://tabletki.ua/', { waitUntil: 'networkidle2' });
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  async function isVisible(page, selector) {
    try {
      return await page.$eval(selector, el => {
        const style = window.getComputedStyle(el);
        return style && style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0' &&
               el.offsetHeight > 0 && el.offsetWidth > 0;
      });
    } catch {
      return false;
    }
  }

  test('Пошук ліків', async () => {
    // Шукаємо, який інпут пошуку доступний  
    if (await isVisible(page, 'input#homePageSearch')) {
      await page.click('input#homePageSearch');
      await page.type('input#homePageSearch', 'Нурофен');
    } else if (await isVisible(page, 'input#inpHeaderSearch')) {
      await page.click('input#inpHeaderSearch');
      await page.type('input#inpHeaderSearch', 'Нурофен');
    } else if (await isVisible(page, 'input#headerSearchSmall')) {
      await page.click('input#headerSearchSmall');
      await page.type('input#headerSearchSmall', 'Нурофен');
    } else {
      throw new Error('Поле пошуку не знайдено!');
    }

    await page.keyboard.press('Enter');

    // Дочекайтеся, поки з'явиться елемент з класом catalog-groups
    await page.waitForSelector('div.catalog-groups', { timeout: 10000 });

    // Перевірка, що результати пошуку з'явилися
    const results = await page.$$('.catalog-groups .card');
    console.log('Товарів знайдено:', results.length);
    expect(results.length).toBeGreaterThan(0);
  }, 30000);
  
  test('Пошук Ібупрофену, відкриття товару, пошук в аптеках, бронювання та перевірка корзини', async () => {  
    
    // Шукаємо, який інпут пошуку доступний  
    if (await isVisible(page, 'input#homePageSearch')) {
      await page.click('input#homePageSearch');
      await page.type('input#homePageSearch', 'Ібупрофен');
    } else if (await isVisible(page, 'input#inpHeaderSearch')){
      await page.click('input#inpHeaderSearch');
      await page.type('input#inpHeaderSearch', 'Ібупрофен');
    } else if (await isVisible(page, 'input#headerSearchSmall')) {
      await page.click('input#headerSearchSmall');
      await page.type('input#headerSearchSmall', 'Ібупрофен');
    } else {
      throw new Error('Поле пошуку не знайдено!');
    }
    await page.keyboard.press('Enter');
  
    // Дочекатися результатів пошуку
    await page.waitForSelector('.catalog-groups .card', { timeout: 10000 });
  
    // Клік по першому товару
    const productLinks = await page.$$('.catalog-groups .card a[href]');
    expect(productLinks.length).toBeGreaterThan(0);
    await productLinks[0].click();
  
    // Дочекатися сторінки товару
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
    // Натискання на "Знайти в аптеках"
    await page.waitForSelector('a#findProduct', { timeout: 10000 });
    await page.click('a#findProduct');


    // Дочекатися списку аптек з кнопками "Забронювати"
    await page.waitForSelector('button.btn-reserve', { timeout: 10000 });
    
    // Натискання на першу кнопку "Забронювати"
    const reserveButtons = await page.$$('button.btn-reserve');
    expect(reserveButtons.length).toBeGreaterThan(0);
    await reserveButtons[0].click();


    if(await isVisible(page, 'button#reserveClosedPharmacyAccept')){
      // Натискання на першу кнопку "Забронювати"
      await page.waitForSelector('button#reserveClosedPharmacyAccept', { timeout: 10000 });
      await page.click('button#reserveClosedPharmacyAccept');
    }
    

    // Натискання на кнопку "Перейти в кошик"
    await page.waitForSelector('a#quantityAddToCard', { timeout: 10000 });
    await page.click('a#quantityAddToCard');

    // Перевірка, що товар успішно додано в кошик
    const basketIndicator = await page.$$('div#shoppingCartReservesCont .address-card');
    expect(basketIndicator.length).toBeGreaterThan(0);
  }, 40000);  

  test('Пошук аптеки подорожник в місті Богородчани', async () => {
    await page.goto('https://tabletki.ua');
    await page.waitForSelector('button.header__button-services', { timeout: 10000 });
    await page.click('button.header__button-services');
  
    // Очікуємо відкриття модального вікна
    await page.waitForSelector('a[title="Показати найближчі аптеки"]', { timeout: 10000 });
    await page.click('div.menu__container-list a[title="Показати найближчі аптеки"]');

    /* Чекаємо, поки з'явиться елемент з id filterOpenAddressPanel, 
    для зміни адреси*/
    await page.waitForSelector('div#filterOpenAddressPanel', { timeout: 10000 });
    await page.click('div#filterOpenAddressPanel');
    /* Чекаємо, поки з'явиться елемент з id filterOpenAddressPanel, 
    для зміни міста*/
    await page.waitForSelector('button#sidepanelAddressCity', { timeout: 10000 });
    await page.click('button#sidepanelAddressCity');
    await page.type('input#sidepanelCitySearch', 'Богородчани');
    
    /* Чекаємо, поки з'явиться елемент з класом sidepanelCitySearch,
    для вибору першого міста в списку*/
    await page.waitForSelector('ul.sidepanelCitySearch', { timeout: 10000 });
    const cityOptions = await page.$$('ul.sidepanelCitySearch li');
    expect(cityOptions.length).toBeGreaterThan(0);
    await cityOptions[0].click();
    
    /* Чекаємо, поки з'явиться елементи article.address-card,
    це картки аптек*/
    await page.waitForSelector('article.address-card', { timeout: 10000 });
    const spans = await page.$$('article.address-card span');
    let found = false;
    // Перевіряємо, чи є серед аптек "Аптека Подорожник"
    for (const span of spans) {
      const text = await page.evaluate(el => el.textContent, span);
      if (text && text.trim() === 'Аптека Подорожник') {
        found = true;
        break;
      }
    }
    // Перевіряємо, що "Аптека Подорожник" знайдена
    expect(found).toBe(true);
  }, 30000);
});
