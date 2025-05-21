import puppeteer from 'puppeteer';

/**
 * Усі CSS-селектори в одному місці — змінюйте тут,
 * а не у кожному тесті.
 */
export const SELECTORS = {
  // Глобальні елементи
  logo: 'g#Logo',
  searchInput: 'input[type="search"]',
  banner: '.catalog-menu-tires',
  menuItems: 'div#top-menu a',

  // Сторінка списку товарів
  firstProduct: '.shop_items .item_from-shop',

  // Сторінка товару / кошика
  addToCartBtn: 'div.my-3.items-center button.bg-yellow',
  cartLink: 'a#cart-header',
  cartSection: '.cart-section',
  cartItemContainer: '.cart-section section.my-5',
  qtyInput: 'div.control input[type="text"]',

  // Категорії / сторінки
  mostyLink: 'div.has-link a[href="/categories/mosty"]',
  categoryTitle: 'h1.text-lato-bold',

  // Сторінка «Контакти»
  contactsLink: 'div#top-menu a[href="/page/contacts"]',
  contactsTitle: 'h1.text-lato-bold',

  // Анімації / дрібниці
  dropdownAnim: 'div.dropdown-menu-animation',
};

/**
 * Запускає браузер із типовими налаштуваннями для наших тестів.
 */
export async function launchBrowser() {
  return puppeteer.launch({
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
    // slowMo: 100
  });
}

/**
 * Виконує пошук за ключовим словом і чекає появи результатів.
 */
export async function searchProduct(page, query) {
  await page.waitForSelector(SELECTORS.searchInput);
  await page.type(SELECTORS.searchInput, query);
  await page.keyboard.press('Enter');
  await page.waitForSelector(SELECTORS.firstProduct);
}

/**
 * Відкриває перший знайдений товар у списку.
 */
export async function openFirstProduct(page) {
  const items = await page.$$(SELECTORS.firstProduct);
  if (!items.length) throw new Error('No products found');
  await items[0].click();
}

/**
 * Перевіряє, чи елемент реально видимий (не прихований стилями).
 */
export async function isVisible(page, selector) {
  try {
    return await page.$eval(selector, el => {
      const s = window.getComputedStyle(el);
      return (
        s &&
        s.display !== 'none' &&
        s.visibility !== 'hidden' &&
        s.opacity !== '0' &&
        el.offsetHeight > 0 &&
        el.offsetWidth > 0
      );
    });
  } catch {
    return false;
  }
}
