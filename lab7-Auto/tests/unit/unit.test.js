import { formatPrice, filterVisibleItems, calculateTotal, validateEmail, capitalizeProductName}
from "../data/functionForUnitTest";

describe('Функції для юніт-тестування', () => {
  test('formatPrice() форматування ціни', async () =>{
    expect(formatPrice(1200)).toBe('1 200 ₴');
  });

  test('Фільтрує приховані товари', () => {
    const items = [
      { name: 'A', hidden: false },
      { name: 'B', hidden: true },
      { name: 'C', hidden: false },
    ];
    expect(filterVisibleItems(items)).toEqual([
      { name: 'A', hidden: false },
      { name: 'C', hidden: false },
    ]);
  });

  test('Обчислює загальну суму товарів у кошику', () => {
    const cart = [
      { price: 1000, quantity: 2 },
      { price: 500, quantity: 1 },
    ];
    expect(calculateTotal(cart)).toBe(2500);
  });

  test('Перевірка валідного email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  test('Перевірка невалідного email', () => {
    expect(validateEmail('wrong-email')).toBe(false);
  });

  test('Форматує назву товару з великої літери', () => {
    expect(capitalizeProductName('стартер')).toBe('Стартер');
    expect(capitalizeProductName('СТАРТЕР')).toBe('Стартер');
  });
});