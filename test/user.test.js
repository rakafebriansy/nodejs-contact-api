import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { web } from '../src/app/web.js';
import { logger } from '../src/app/logging.js';
import { createTestUser, getTestUser, removeTestUser } from './test-util.js';

describe('POST /api/users', () => {
    afterEach(async () => {
        await removeTestUser();
    });

    it('should can register new user', async () => {
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username: 'test',
            password: 'test123',
            name: 'test'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if requests are invalid', async () => {
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username: '',
            password: '',
            name: ''
        });

        logger.error(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
    
    it('should reject if username is already exists', async () => {
        let result = await supertest(web)
        .post('/api/users')
        .send({
            username: 'test',
            password: 'test123',
            name: 'test'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
        .post('/api/users')
        .send({
            username: 'test',
            password: 'test123',
            name: 'test'
        });

        logger.error(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: 'test',
            password: 'test123'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.token).not.toBe('test');
    });

    it('should reject login if requests are invalid', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: '',
            password: ''
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if password is wrong', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: 'test',
            password: 'testwrong'
        });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get current user', async () => {
        const result = await supertest(web)
        .get('/api/users/current')
        .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
        .get('/api/users/current')
        .set('Authorization', 'wrong');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update user', async () => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization','test')
        .send({
            name: 'Raka',
            password: 'raka123'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('Raka');

        const user = await getTestUser();
        expect(await bcrypt.compare('raka123',user.password)).toBe(true);
    });

    it('should can update user\'s name', async () => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization','test')
        .send({
            name: 'Raka'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('Raka');
    });

    it('should can update user\'s password', async () => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization','test')
        .send({
            password: 'raka123'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');

        const user = await getTestUser();
        expect(await bcrypt.compare('raka123',user.password)).toBe(true);
    });

    it('should reject if requests are invalid', async () => {
        const result = await supertest(web)
        .patch('/api/users/current')
        .set('Authorization','wrong')
        .send({});

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});