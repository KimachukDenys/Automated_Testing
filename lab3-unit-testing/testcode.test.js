import * as ult from './testcode.js';

// Тест для функціх asinh

// 1. Тест на коректність результату
// Перевіряє, що функція `asinh` правильно обчислює значення гіперболічного арксинуса.
describe('Asinh function - Correct', () => {
    test('asinh should return correct value', () => {
        const result = ult.asinh(5);
        expect(result).toBe(Math.asinh(5)); // Перевіряємо, що результат правильний
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
    });
});

// 2. Тест із плаваючою комою
// Перевіряє точність обчислення з використанням `toBeCloseTo`, щоб уникнути помилок через неточність з floating point.
describe('Asinh function - Approximately correct result', () => {
    test('asinh should return approximately correct value', () => {
        const result = ult.asinh(5); // Тест працює навіть із плаваючою комою
        expect(result).toBeCloseTo(Math.asinh(5), 5); 
        expect(result).toBeDefined();
        expect(result).not.toBeFalsy();
    });
});

// 3. Тест для негативного числа
// Тестує поведінку функції для від’ємного аргументу, що є валідним для `asinh`.
describe('Asinh function - Negative number', () => {
    test('asinh should return correct value for negative input', () => {
        const result = ult.asinh(-5); // Перевірка правильного результату для -5
        expect(result).toBe(Math.asinh(-5)); 
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
    });
});

// 4. Тест для нуля
// Перевіряє, що `asinh(0)` повертає 0 — очікуване математичне значення.
describe('Asinh function - Zero', () => {
    test('asinh should return 0 for input of 0', () => {
        const result = ult.asinh(0); // Перевірка, що результат дорівнює 0
        expect(result).toBe(0);
        expect(result).toBeDefined();
        expect(result).toBeFalsy();
    });
});

// 5. Тест для великого числа
// Перевіряє, що функція коректно працює з великими числами і не втрачає точності.
describe('Asinh function - Large number', () => {
    test('asinh should return approximately correct value for large input', () => {
        const result = ult.asinh(1000)
        expect(result).toBeCloseTo(Math.asinh(1000), 5); // Перевірка точності для великого числа
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
        expect(result).not.toBeFalsy();
    });
});


// Тести для функції acosh
describe('Acosh function - General Tests', () => {
    // 1. Повернення коректного значення
    // Перевіряє, що функція `acosh` повертає точне значення для аргументу більше 1.
    test('acosh should return correct value', () => {
        expect(ult.acosh(5)).toBe(Math.acosh(5));
    });

    // 2. Функція повинна повернути 0 при 1
    // Математично `acosh(1)` дорівнює 0 — перевіряємо це.
    test('acosh should return 0 for input of 1', () => {
        expect(ult.acosh(1)).toBe(0);
    });

    // 3. Вихід за мужі функції, повинно повертати NaN для чисел менших за 1
    // `acosh` математично не визначений для аргументів менше 1, функція має повертати `NaN`.
    test('acosh should return NaN for numbers less than 1', () => {
        expect(ult.acosh(0.5)).toBeNaN();
        expect(ult.acosh(-10)).toBeNaN();
    });
});

// Тести для функції atanh
describe('Atanh function - General Tests', () => {
    // 1. Тест на повернення коректного значення
    // Перевіряє точність для допустимого значення в межах (-1, 1).
    test('atanh should return correct value', () => {
        expect(ult.atanh(0.5)).toBe(Math.atanh(0.5));
    });

    // 2. Тест для нуля
    // Перевіряє, що `atanh(0)` повертає 0, як і очікується.
    test('atanh should return 0 for input of 0', () => {
        expect(ult.atanh(0)).toBe(0);
    });

    // 3. Тест на безкінечність при 1
    // Математично 'atanh(1)' → безкінечність — перевіряється повернення 'Infinity'.
    test('atanh should return Infinity for input of 1', () => {
        expect(ult.atanh(1)).toBe(Infinity);
    });

    // 4. Тест на мінус безкінечність при -1
    // `atanh(-1)` → -∞ — функція повинна повернути `-Infinity`.
    test('atanh should return -Infinity for input of -1', () => {
        expect(ult.atanh(-1)).toBe(-Infinity);
    });

    // 5.Тест на повернення Nan при виході за межі -1 та 1
    // Перевіряємо, що функція повертає `NaN` для чисел поза допустимим діапазоном.
    test('atanh should return NaN for numbers outside the range -1 to 1', () => {
        expect(ult.atanh(1.5)).toBeNaN();
        expect(ult.atanh(-1.5)).toBeNaN();
    });
})


// 1. Перевірка коректної обробки чисел та рядків
// Перевіряє, що числа збільшуються на 1, а рядки переводяться у верхній регістр.
describe('arrayProcessor - Test function', () => {
    test('should make changes', () => {
        const input = [11, 'open door'];
        const output = ult.arrayProcessor(input);
        expect(output).toEqual([12, 'OPEN DOOR']);
    });
});

// 2. Перевіряє, що булеві значення, об'єкти та `null` залишаються без змін.
describe('arrayProcessor - General Tests', () => {
    test('should leave other types unchanged', () => {
        const input = [1, 'hello', true, null, { key: 'value' }];
        const output = ult.arrayProcessor(input);
        expect(output).toEqual([2, 'HELLO', true, null, { key: 'value' }]);
    });
});
