const request = require('supertest');
const app = require('../src/index');
const { sequelize } = require('../src/config/db');
const { User, Task } = require('../src/models');

// Setup and teardown
beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Authentication API', () => {
    let userToken;

    test('POST /api/auth/register - Register new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'user'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.user.email).toBe('test@example.com');
    });

    test('POST /api/auth/register - Fail with existing email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/login - Login successfully', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        userToken = res.body.data.token;
    });

    test('POST /api/auth/login - Fail with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('GET /api/auth/me - Get current user', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe('test@example.com');
    });
});

describe('Tasks API', () => {
    let authToken;
    let taskId;

    beforeAll(async () => {
        // Create user and login
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Task Tester',
                email: 'task@example.com',
                password: 'password123'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'task@example.com',
                password: 'password123'
            });

        authToken = loginRes.body.data.token;
    });

    test('POST /api/tasks - Create new task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Task',
                description: 'This is a test task',
                status: 'pending'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Test Task');
        taskId = res.body.data.id;
    });

    test('GET /api/tasks - Get all tasks', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.tasks).toBeInstanceOf(Array);
    });

    test('GET /api/tasks/:id - Get single task', async () => {
        const res = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(taskId);
    });

    test('PUT /api/tasks/:id - Update task', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Updated Task',
                status: 'in_progress'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Updated Task');
        expect(res.body.data.status).toBe('in_progress');
    });

    test('DELETE /api/tasks/:id - Delete task', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('GET /api/tasks - Unauthorized without token', async () => {
        const res = await request(app).get('/api/tasks');

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
