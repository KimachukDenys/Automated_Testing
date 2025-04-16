import axios from 'axios';

describe('GET one', () => {
    test('отримання одного запиту, код 200', async() =>{
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('userId', 1);
    });

    test('перевірка полів', async() => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/comments/35');
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('postId');
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('name');
        expect(response.data).toHaveProperty('email');
        expect(response.data).toHaveProperty('body');
    });

    test('неіснуючий id повертає 404', async () => {
        try {
            await axios.get('https://jsonplaceholder.typicode.com/users/11');
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });    

    test('некоректний id, 404', async() => {
        try {
            await axios.get('https://jsonplaceholder.typicode.com/users/abc');
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('повернення лише 1 запису', async() => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/21');
        expect(response).toBeInstanceOf(Object);
        expect(Array.isArray(response.data)).toBe(false);
    });

    test('заголовок відповіді містить правильний Content-type', async() => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/photos/155');

        expect(response.headers['content-type']).toContain('application/json');
    });

    test('граничне значення', async() => {
        try {
            await axios.get('https://jsonplaceholder.typicode.com/users/0');
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });
});