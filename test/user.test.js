import supertest from 'supertest';
import { web } from '../src/app/web.js';
import { logger } from '../src/app/logging.js';
import { createTestUser, removeTestUser } from './test-util.js';

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
        const result = await supertest(web).post('/api/users/login').send({
            username: 'test',
            password: 'test123'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.token).not.toBe('test');
    });

    it('should reject login if requests are invalid', async () => {
        const result = await supertest(web).post('/api/users/login').send({
            username: '',
            password: ''
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if password is wrong', async () => {
        const result = await supertest(web).post('/api/users/login').send({
            username: 'test',
            password: 'testwrong'
        });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});