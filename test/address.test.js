import supertest from "supertest";
import { createTestAddress, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddresses, removeAllTestContacts, removeTestUser } from "./test-util";
import { web } from "../src/app/web";

describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });
    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });
    it('should can create new address', async () =>{
        const testContact = await getTestContact();
        
        const result = await supertest(web)
        .post('/api/contacts/' + testContact.id  + '/addresses')
        .set('Authorization','test')
        .send({
            street: 'Jalan test',
            city: 'Kota test',
            province: 'Provinsi test',
            country: 'Negara test',
            postal_code: '12345'
        });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('Jalan test');
        expect(result.body.data.city).toBe('Kota test');
        expect(result.body.data.province).toBe('Provinsi test');
        expect(result.body.data.country).toBe('Negara test');
        expect(result.body.data.postal_code).toBe('12345');
    });
    it('should reject if requests are invalid', async () =>{
        const testContact = await getTestContact();

        const result = await supertest(web)
        .post('/api/contacts/' + testContact.id  + '/addresses')
        .set('Authorization','test')
        .send({
            street: '',
            city: '',
            province: 'test',
            country: '',
            postal_code:  ''
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
    it('should reject if contact is not found', async () =>{
        const testContact = await getTestContact();

        const result = await supertest(web)
        .post('/api/contacts/' + (testContact.id + 1) + '/addresses')
        .set('Authorization','test')
        .send({
            street: 'Jalan test',
            city: 'Kota test',
            province: 'Provinsi test',
            country: 'Negara test',
            postal_code: '12345'
        });

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });
    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });
    it('should can get address', async () =>{
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();
        
        const result = await supertest(web)
        .get('/api/contacts/' + testContact.id  + '/addresses/' + testAddress.id)
        .set('Authorization','test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('Jalan test');
        expect(result.body.data.city).toBe('Kota test');
        expect(result.body.data.province).toBe('Provinsi test');
        expect(result.body.data.country).toBe('Negara test');
        expect(result.body.data.postal_code).toBe('12345');
    });
    it('should reject if contact is not found', async () =>{
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();
        
        const result = await supertest(web)
        .get('/api/contacts/' + (testContact.id + 1)  + '/addresses/' + testAddress.id)
        .set('Authorization','test');

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
    it('should reject if address is not found', async () =>{
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();
        
        const result = await supertest(web)
        .get('/api/contacts/' + testContact.id  + '/addresses/' + (testAddress.id + 1))
        .set('Authorization','test');

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });
    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });
    it('should can update address', async () =>{
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();
        
        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id  + '/addresses/' + testAddress.id)
        .set('Authorization','test')
        .send({
            street: 'Jalan test update',
            city: 'Kota test update',
            province: 'Provinsi test update',
            country: 'Negara test update',
            postal_code: '54321'
        });
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('Jalan test update');
        expect(result.body.data.city).toBe('Kota test update');
        expect(result.body.data.province).toBe('Provinsi test update');
        expect(result.body.data.country).toBe('Negara test update');
        expect(result.body.data.postal_code).toBe('54321');
    });
    it('should reject if requests are invalid', async () =>{
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();
        
        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id  + '/addresses/' + testAddress.id)
        .set('Authorization','test')
        .send({
            street: '',
            city: '',
            province: '',
            country: '',
            postal_code: '54321'
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
    it('should reject if contact is not found', async () =>{
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();
        
        const result = await supertest(web)
        .put('/api/contacts/' + (testContact.id + 1)  + '/addresses/' + testAddress.id)
        .set('Authorization','test')
        .send({
            street: 'Jalan test update',
            city: 'Kota test update',
            province: 'Provinsi test update',
            country: 'Negara test update',
            postal_code: '54321'
        });

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
    it('should reject if address is not found', async () =>{
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();
        
        const result = await supertest(web)
        .put('/api/contacts/' + testContact.id  + '/addresses/' + (testAddress.id + 1))
        .set('Authorization','test')
        .send({
            street: 'Jalan test update',
            city: 'Kota test update',
            province: 'Provinsi test update',
            country: 'Negara test update',
            postal_code: '54321'
        });

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});
