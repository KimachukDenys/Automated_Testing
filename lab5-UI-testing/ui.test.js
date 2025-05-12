import puppeteer from 'puppeteer';

let browser;
let page;
describe('Basic UI Test', () => {

    beforeAll(async () => {
        try {
            browser = await puppeteer.launch({ headless: false});
            page = await browser.newPage();
            await page.goto('https://avrora.ua/', { waitUntil: 'networkidle2' });
        } catch (error) {
            console.error('Error during beforeAll:', error);
        }
    }, 30000);

    afterAll(async () => {
        await browser.close();
    });

    // Перевірка заголовка сторінки
    test('Перевірка наявності заголовок сторінки', async () => {
        const title = await page.title();
        expect(title).toBe("Мультимаркет Аврора ➤ Доступні товари для всієї сім'ї | Мультимаркет Аврора");
    });
    
    test('Перевірка чи існує популярний блок "Cуперціни"', async () => {
        await page.waitForSelector('.best-price__header');
        const popularBlock = await page.$('.best-price__header');
        expect(popularBlock).not.toBeNull();
    });
    
    test('Перевірка пошуку склянок', async () => {
        // Чекаємо на появу пошуку, вводимо запит у поле пошуку
        await page.waitForSelector('input.ty-search-block__input');
        await page.type('input.ty-search-block__input', 'склянка');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('button.ty-search-magnifier')
        ]);
    
        // Чекаємо появи результатів пошуку
        await page.waitForSelector('.ty-grid-list__item', { timeout: 50000});
        
        // Перевіряємо, що результати пошуку відображаються
        const items = await page.$$('.ty-grid-list__item');
        console.log('Товарів знайдено:', items.length);
        expect(items.length).toBeGreaterThan(0); // Очікуємо хоча б 1 товар
    }, 30000);
          
    test('Мобільна версія сайту', async () => {
        await page.setViewport({ width: 390, height: 884 }); // iPhone 12 Pro
        await page.goto('https://avrora.ua/', { waitUntil: 'networkidle2' });
        const menuButton = await page.$('.mob-btn'); // перевірити чи існує бургер-меню
        expect(menuButton).not.toBeNull();
    }, 30000);

    test('Відкриття модального вікна кошика', async () => {
        // Чекаємо на появу кнопки "Кошик" та клікаємо на неї
        await page.waitForSelector('a#opener_page_cart');
        await page.click('a#opener_page_cart');
    
        // Чекаємо на появу модального вікна (елемент із id="page_cart")
        await page.waitForSelector('#page_cart', { visible: true });
    
        const isVisible = await page.$eval('#page_cart', el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });
    
        expect(isVisible).toBe(true); // Перевіряємо, що модальне вікно відкрилось
    }, 30000); 
});

describe('Opening product page', () => {
    test('Відкриття сторінки товару', async () => {
        // Запускаємо браузер та відкриваємо сторінку
        browser = await puppeteer.launch({ headless: false, slowMo: 150 });
        page = await browser.newPage();
        await page.goto('https://avrora.ua/', { waitUntil: 'networkidle2' });
        // Чекаємо на появу поля пошуку, вводимо запит у поле пошуку
        await page.type('input.ty-search-block__input', 'склянка');
        await page.click('button.ty-search-magnifier');
        
        // Чекаємо на появу товарів
        await page.waitForSelector('.ty-grid-list__image');

        
        // Переходимо на сторінку першого товару
        const productLinks = await page.$$('.ty-grid-list__image a');
        
        if (productLinks.length > 0) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2' }),
                productLinks[0].click()
            ]);
            
            // Чекаємо заголовка товару
            await page.waitForSelector('h1.ty-product-block-title');
            // Перевіряємо, що заголовок товару відображається
            const title = await page.$eval('h1.ty-product-block-title', el => el.textContent.trim());
            expect(title.length).toBeGreaterThan(0);
        } else {
            console.error('Товари не знайдені');
            expect(false).toBe(true); // Завершуємо тест із помилкою, якщо товарів немає
        }
        await browser.close();
    }, 30000);
});    