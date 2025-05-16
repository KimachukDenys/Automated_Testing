import { Selector } from 'testcafe';

fixture`Сторінка Novaton`.page`https://novaton.ua/`;

/* для запуску тестів використовуйте команду: npm test для запуску всіх тестів,
або npm run testcafe, для запуску testcafe.test.js*/

test('Перевірка наявності кнопки ДОДАТИ АВТОМОБІЛЬ', async t => {
  const addButton = Selector('button').withAttribute('title', 'ДОДАТИ АВТОМОБІЛЬ');
        
  await t
  .expect(addButton.exists).ok()
  .expect(addButton.visible).ok();
});

test('Клік на логотип повертає на головну сторінку', async t => {
  const logo = Selector('g#Logo');

  await t
    .click(logo)
    .expect(Selector('body').exists).ok() // Переконуємося, що сторінка завантажена
    .expect(t.eval(() => window.location.href))
    .eql('https://novaton.ua/');
});

test('Пошук фільтра', async t => {
  const searchInput = Selector('input[type="search"]');
  const resultItems = Selector('.shop_items .item_from-shop');

  await t
    .expect(searchInput.exists).ok()
    .typeText(searchInput, 'Фільтр')
    .pressKey('enter')
    .expect(resultItems.count).gt(0);
});