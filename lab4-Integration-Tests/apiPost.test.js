import axios from 'axios';

describe('POST', () => {
    test('створення поста', async() => {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
            userId: 1,
            title: 'test',
            body: 'test post 101'
        });
        expect(response.status).toBe(201);
    });

    test('створення поста із відсутнім полем title', async() => {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
            userId: 1,
            body: 'test post 101'
        });
        expect(response.status).toBe(201);
    });

    test('перевірка валідації типів даних', async() => {
        try {
            await axios.post('https://jsonplaceholder.typicode.com/posts', {   
                userId: 'iduser',
                title: 'test',
                body: 'test post 101'
            });
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('надсилання порожнього тіла', async() => {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {});

        expect(response.status).toBe(201);
    });

    test('Надсилання зайвих полів', async() => {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
            userId: 2,
            title: 'test title',
            body: 'test body',
            date: '10.10.1999'
        })

        expect(response.status).toBe(201);
    });
});