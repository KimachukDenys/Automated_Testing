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
            browser = await puppeteer.launch({ headless: false });
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

        await page.waitForSelector(PRODUCT_SELECTOR, { timeout: 50000 });

        const items = await page.$$(PRODUCT_SELECTOR);
        console.log('Товарів знайдено:', items.length);
        expect(items.length).toBeGreaterThan(0);
    }, 30000);
          
    test('Мобільна версія сайту', async () => {
        await page.setViewport(MOBILE_VIEWPORT);
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        const menuButton = await page.$('.mob-btn');
        expect(menuButton).not.toBeNull();
    }, 30000);

    test('Відкриття модального вікна кошика', async () => {
        await page.waitForSelector('a.link-cart');
        await page.click('a.link-cart');
    
        await page.waitForSelector('div#full_cart_content', { visible: true });
    
        const isVisible = await page.$eval('div#full_cart_content', el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });
    
        expect(isVisible).toBe(true);
    }, 30000);
});

describe('Opening product page', () => {
    test('Відкриття сторінки товару', async () => {
        browser = await puppeteer.launch({ headless: false, slowMo: 150 });
        page = await browser.newPage();
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

        await page.type(SEARCH_INPUT_SELECTOR, 'склянка');
        await page.click(SEARCH_BUTTON_SELECTOR);
        
        await page.waitForSelector('.ty-grid-list__image');
        await page.waitForSelector('div.cl-dialog-close-icon')
        await page.click('div.cl-dialog-close-icon');

        const productLinks = await page.$$('.ty-grid-list__image a');
        
        if (productLinks.length > 0) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2' }),
                productLinks[0].click()
            ]);
            
            await page.waitForSelector('h1.ty-product-block-title');
            
            const title = await page.$eval('h1.ty-product-block-title', el => el.textContent.trim());
            expect(title.length).toBeGreaterThan(0);
        } else {
            console.error('Товари не знайдені');
            expect(false).toBe(true);
        }
        await browser.close();
    }, 30000);
});
