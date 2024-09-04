import supertest from "supertest";
import { createManyTestContacts, createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser } from "./test-util";
import { web } from "../src/app/web";

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });
    it('should can create new contact', async () =>{
        const result = await supertest(web)
        .post('/api/contacts')
        .set('Authorization','test')
        .send({
            first_name: 'test',
            last_name: 'test',
            email: 'test@gmail.com',
            phone: '08123456789'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe('test');
        expect(result.body.data.last_name).toBe('test');
        expect(result.body.data.email).toBe('test@gmail.com');
        expect(result.body.data.phone).toBe('08123456789');
    });
    it('should reject if requests are invalid', async () =>{
        const result = await supertest(web)
        .post('/api/contacts')
        .set('Authorization','test')
        .send({
            first_name: '',
            last_name: '',
            email: 'testinvalid',
            phone: '82395585158851058308510853085305808530'
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });
    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });
    it('should can get contact', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
        .get('/api/contacts/' + testContact.id)
        .set('Authorization','test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe(testContact.first_name);
        expect(result.body.data.last_name).toBe(testContact.last_name);
        expect(result.body.data.email).toBe(testContact.email);
        expect(result.body.data.phone).toBe(testContact.phone);
    });
    it('should return 404 if contact id is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
        .get('/api/contacts/' + (testContact.id +1))
        .set('Authorization','test');

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});


describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });
    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });
    it('should can update existing contact', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id)
        .set('Authorization', 'test')
        .send({
            first_name: 'testUpdated',
            last_name: 'testUpdated',
            email: 'testUpdated@gmail.com',
            phone: '081234567890'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe('testUpdated');
        expect(result.body.data.last_name).toBe('testUpdated');
        expect(result.body.data.email).toBe('testUpdated@gmail.com');
        expect(result.body.data.phone).toBe('081234567890');
    });
    it('should reject if requests are invalid', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id)
        .set('Authorization', 'test')
        .send({
            first_name: '',
            last_name: '',
            email: 'test',
            phone: ''
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
    it('should return 404 if contact id is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
        .put('/api/contacts/' + (testContact.id + 1))
        .set('Authorization', 'test')
        .send({
            first_name: 'test',
            last_name: 'test',
            email: 'test@gmail.com',
            phone: '081234567890'
        });

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });
    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });
    it('should can delete contact', async () => {
        let testContact = await getTestContact();

        const result = await supertest(web)
        .delete('/api/contacts/' + testContact.id)
        .set('Authorization','test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('OK');

        testContact = await getTestContact();
        expect(testContact).toBeNull();
    });
    it('return 404 if contact id is not found', async () => {
        let testContact = await getTestContact();

        const result = await supertest(web)
        .delete('/api/contacts/' + (testContact.id + 1))
        .set('Authorization','test');

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts', () => {
    beforeAll(async () => {
        await createTestUser();
        await createManyTestContacts();
    });
    afterAll(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });
    it('should can search without params', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .set('Authorization','test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_pages).toBe(2);
        expect(result.body.paging.total_items).toBe(15);
    });
    it('should can search specific page by page number', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .query({
            page: 2
        })
        .set('Authorization','test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_pages).toBe(2);
        expect(result.body.paging.total_items).toBe(15);
    });
    it('should can search specific page by name', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .query({
            name: 'test 1'
        })
        .set('Authorization','test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_pages).toBe(1);
        expect(result.body.paging.total_items).toBe(6);
    });
    it('should can search specific page by email', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .query({
            email: 'test1'
        })
        .set('Authorization','test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_pages).toBe(1);
        expect(result.body.paging.total_items).toBe(6);
    });
    it('should can search specific page by phone', async () => {
        const result = await supertest(web)
        .get('/api/contacts')
        .query({
            phone: '08123456781'
        })
        .set('Authorization','test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_pages).toBe(1);
        expect(result.body.paging.total_items).toBe(6);
    });
});