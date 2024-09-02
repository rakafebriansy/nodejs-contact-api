import supertest from 'supertest';
import { web } from '../src/app/web.js';
import { prismaClient } from '../src/app/database.js';
import { logger } from '../src/app/logging.js';

describe('POST /api/users', () => {
    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: 'raka'
            }
        });
    });

    it('should can register new user', async () => {
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username: 'raka',
            password: 'raka123',
            name: 'Raka Febrian'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('raka');
        expect(result.body.data.name).toBe('Raka Febrian');
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
            username: 'raka',
            password: 'raka123',
            name: 'Raka Febrian'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('raka');
        expect(result.body.data.name).toBe('Raka Febrian');
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
        .post('/api/users')
        .send({
            username: 'raka',
            password: 'raka123',
            name: 'Raka Febrian'
        });

        logger.error(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});