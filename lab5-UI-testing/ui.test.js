import puppeteer from 'puppeteer';

const BASE_URL = 'https://avrora.ua/';
const SEARCH_INPUT_SELECTOR = 'input.ty-search-block__input';
const SEARCH_BUTTON_SELECTOR = 'button.ty-search-magnifier';
const POPULAR_BLOCK_SELECTOR = '.best-price__header';
const PRODUCT_SELECTOR = '.ty-grid-list__item';
const MOBILE_VIEWPORT = { width: 390, height: 884 };

let browser;
let page;

describe('Basic UI Test', () => {

    beforeAll(async () => {
        try {
            browser = await puppeteer.launch({ headless: true });
            page = await browser.newPage();
            await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        } catch (error) {
            console.error('Error during beforeAll:', error);
        }
    }, 30000);

    afterAll(async () => {
        await browser.close();
    });

    test('Check page title', async () => {
        const title = await page.title();
        expect(title).toBe("Мультимаркет Аврора ➤ Доступні товари для всієї сім'ї | Мультимаркет Аврора");
    });

    test('Перевірка чи існує популярний блок "Cуперціни"', async () => {
        await page.waitForSelector(POPULAR_BLOCK_SELECTOR);
        const popularBlock = await page.$(POPULAR_BLOCK_SELECTOR);
        expect(popularBlock).not.toBeNull();
    });
    
    
    test('Перевірка пошуку склянок', async () => {
        await page.type(SEARCH_INPUT_SELECTOR, 'склянка');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click(SEARCH_BUTTON_SELECTOR)
        ]);
        // Зачекайте, поки з'явиться елементи товару
        await page.waitForSelector(PRODUCT_SELECTOR, { timeout: 50000 });
        // Перевірка, чи елементи товару відображаються
        const items = await page.$$(PRODUCT_SELECTOR);
        console.log('Товарів знайдено:', items.length);
        expect(items.length).toBeGreaterThan(0);
    }, 30000);
          
    test('Мобільна версія сайту', async () => {
        // Встановлення мобільного режиму
        await page.setViewport(MOBILE_VIEWPORT);
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        // Перевірка наявності елемента меню на мобільній версії
        const menuButton = await page.$('.mob-btn');
        expect(menuButton).not.toBeNull();
    }, 30000);

    test('Відкриття модального вікна кошика', async () => {
        // відкриття модального вікна кошика
        await page.waitForSelector('a.link-cart');
        await page.click('a.link-cart');
        // Зачекайте, поки модальне вікно з'явиться
        await page.waitForSelector('div#full_cart_content', { visible: true });
        // Перевірка, чи модальне вікно відображається
        const isVisible = await page.$eval('div#full_cart_content', el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });
    
        expect(isVisible).toBe(true);
    }, 30000);

    test('Відкриття сторінки товару', async () => {
        await page.goto(`${BASE_URL}top-tovari/`, { waitUntil: 'networkidle2' });

        await page.waitForSelector('.ty-grid-list__image');

        // Чекаємо, поки з'явиться модальне вікно і закриваємо його

        // Cтворення масиву з усіх силок на товари
        const productLinks = await page.$$('.ty-grid-list__image a');
        
        // Перевірка, чи масив не пустий
        if (productLinks.length > 0) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2' }),
                productLinks[0].click()
            ]);
            
            await page.waitForSelector('h1.ty-product-block-title');
            // Перевірка, чи заголовок сторінки товару не пустий
            const title = await page.$eval('h1.ty-product-block-title', el => el.textContent.trim());
            expect(title.length).toBeGreaterThan(0);
        } else {
            console.error('Товари не знайдені');
            expect(false).toBe(true);
        }
        await browser.close();
    }, 30000);
});
