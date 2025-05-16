const axios = require('axios');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Referer': 'https://novaton.ua/',
};

describe('API тестування сайту novaton.ua', () => {
  test('Головна сторінка доступна (200 OK)', async () => {
    const response = await axios.get('https://novaton.ua/', { headers });
    expect(response.status).toBe(200);
    expect(response.data).toMatch(/Ваші автомобілі/i);
  });

  test('Пошук "Стартер" повертає результати', async () => {
    const response = await axios.get('https://novaton.ua/search/name?product_name=Стартер', { headers });
    expect(response.status).toBe(200);
    expect(response.data).toMatch(/Стартер/i);
  });

  test('Пошук "Кардан" повертає HTML-відповідь', async () => {
    const response = await axios.get('https://novaton.ua/search/name?product_name=Кардан', { headers });
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.data).toMatch(/Кардан/i);
  });

    test('Пошук неіснуючого товару повертає 404', async () => {
    try {
      await axios.get('https://novaton.ua/search/name?product_name=Телевізор', { headers });
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('Запит до неіснуючої сторінки повертає 404', async () => {
    try {
      await axios.get('https://novaton.ua/non-existent-page', { headers });
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('Надсилання не існуючих даних при авторизації', async () => {
    try {
      await axios.post('https://novaton.ua/auth/login', { headers }, {
        auth: {
          username: 'nonexistent_user',
          password: 'wrong_password'
        }
      });
    } catch (error) {
      const status = error.response?.status;
      expect(403).toContain(status);
    }
  });
});