import axios from "axios";

describe('DELETE', () => {
    test('видалення поста з id 2', async() => {
        const response = await axios.delete('https://jsonplaceholder.typicode.com/posts/2');

        expect(response.status).toBe(200);
    });

    test('видалення користувача з некоректним id', async() => {
        try {
            await axios.delete('https://jsonplaceholder.typicode.com/users/128');
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('перевірка що response.data після видалення є порожнім', async() => {
        const response = await axios.delete('https://jsonplaceholder.typicode.com/comments/11');
        
        expect(response.status).toBe(200);
        expect(response.data).toEqual({});
    });

    test('перевірка що запис дійсно видалився', async() => {
        const response = await axios.delete('https://jsonplaceholder.typicode.com/photos/11');

        expect(response.status).toBe(200);
        try {
            await axios.delete('https://jsonplaceholder.typicode.com/photos/11');
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('перевірка видалення без id', async() => {
        try {
            await axios.delete('https://jsonplaceholder.typicode.com/users/');
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });
});