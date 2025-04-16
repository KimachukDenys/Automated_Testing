import axios from "axios";

describe('PUT', () => {
    test('оновлення поста з id 1 із відсутнім полем body', async() => {
        const response = await axios.put('https://jsonplaceholder.typicode.com/posts/1', {
            userId: 2,
            title: 'put test'
        });

        expect(response.status).toBe(200);
    });

    test('спроба оновлення неіснуючого поста', async() => {
        try {
            await axios.put('https://jsonplaceholder.typicode.com/posts/785', {
                userId: 1,
                title: 'none',
                body: 'test body'
            });
        } catch (error) {
            expect(error.response.status).toBe(500);
        }
    });

    test('оновлення поста з id 11 із зайвим полем та неправильним типол поля title', async() => {
        const response = await axios.put('https://jsonplaceholder.typicode.com/posts/11', {
            userId: 2,
            title: {},
            body: 'test body',
            views: 101
        });

        expect(response.status).toBe(200);
    });

    test('оновлення поста з id 21 із неправильним типом даних для поля userId', async() => {
        const response = await axios.put('https://jsonplaceholder.typicode.com/posts/21', {
            userId: 'text',
            title: 'put test',
            body: 'test body'
        });

        expect(response.status).toBe(200);
    });

    test('оновлення поста з id 90 перевірка чи не ламається при довгому рядку', async() => {
        const response = await axios.put('https://jsonplaceholder.typicode.com/posts/90', {
            userId: 'text',
            title: 'a'.repeat(10000),
            body: 'test body'
        });

        expect(response.status).toBe(200);
    });
});

describe('PATCH', () => {
    test('оновлення тілький title для поста із id 1', async() => {
        const response = await axios.patch('https://jsonplaceholder.typicode.com/posts/21', {
            title: 'new title for post 21'
        });

        expect(response.status).toBe(200);
    });

    test('оновлення даних для неіснуючого post', async() => {
        try {
            await axios.patch('https://jsonplaceholder.typicode.com/posts/10000', {
                userId: 10,
                title: 'put test',
                body: 'test body'
            });
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('оновлення з порожнім тілом', async() => {
        const response = await axios.patch('https://jsonplaceholder.typicode.com/posts/77', {});

        expect(response.status).toBe(200);
    });

    test('оновлення неіснуючого поля', async() => {
        const response = await axios.patch('https://jsonplaceholder.typicode.com/users/7', {
            views: 101
        });

        expect(response.status).toBe(200);
    });
});