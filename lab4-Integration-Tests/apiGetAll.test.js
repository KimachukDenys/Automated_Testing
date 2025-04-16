import axios from 'axios';


describe('GET all', () => {
    test('повинні отримати 200 posts',() => {
        return axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(function(response){
                expect(response.status).toBe(200);
            });
    });

    test('повинні отримати 200 users', async() => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users')
        expect(response.status).toBe(200);
    });

    test('повинні отримати 404', async() => {
        try {
            await axios.get('https://jsonplaceholder.typicode.com/documents');
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('повинні отримати пости користувача з id: 1', async()=>{
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts',
            {params:{userId: 1}}
        )
        expect(response.status).toBe(200);
        response.data.forEach(post => {
            expect(post.userId).toBe(1);
        });
    });

    test('відповідь не пуста', async()=>{
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
        expect(response['data'].length > 0).toBe(true);
        response.data.forEach(post => {
            expect(post).toBeInstanceOf(Object);
            expect(Object.keys(post).length).toBeGreaterThan(0);
        });
    });

    test('кожен пост має правильну структуру', async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        expect(response.status).toBe(200);
    
        response.data.forEach(post => {
            expect(post).toHaveProperty('userId');
            expect(post).toHaveProperty('id');
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('body');
        });
    });

    test('заголовок відповіді містить правильний content-type', async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        expect(response.headers['content-type']).toContain('application/json');
    });

    test('некоректний userId повертає порожній масив', async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
            params: { userId: 'abc' }
        });
        expect(response.status).toBe(200);
        expect(response.data).toEqual([]);
    });

    test('таймаут викликає помилку', async () => {
        try {
            await axios.get('https://jsonplaceholder.typicode.com/posts', { timeout: 1 });
        } catch (error) {
            expect(error.code).toBe('ECONNABORTED');
        }
    });
});