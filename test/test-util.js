import { prismaClient } from "../src/app/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'test'
        }
    });
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: 'test',
            password: await bcrypt.hash('test123',10),
            name: 'test',
            token: 'test'
        }
    });
}

export const getTestUser = async () =>  {
    return prismaClient.user.findUnique({
        where: {
            username: 'test'
        }
    });
}

export const removeAllTestContacts = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: 'test'
        }
    });
}

export const createTestContact = async () => {
    await prismaClient.contact.create({
        data: {
            username: 'test',
            first_name: 'test',
            last_name: 'test',
            email: 'test@gmail.com',
            phone: '08123456789',
        }
    });
}

export const getTestContact = async () => {
    const result = await prismaClient.contact.findFirst({
        where: {
            username: 'test'
        }
    });

    return result;
}

export const createManyTestContacts = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: `test`,
                first_name: `test ${i}`,
                last_name: `test ${i}`,
                email: `test${i}@gmail.com`,
                phone: `0812345678${i}`,
            }
        });
    }
}

export const removeAllTestAddresses = async () =>{
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: 'test'
            } 
        }
    });
}

export const createTestAddress = async () => {
    const contact = await getTestContact();
    await prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: 'Jalan test',
            city: 'Kota test',
            province: 'Provinsi test',
            country: 'Negara test',
            postal_code: '12345'
        }
    });
}

export const getTestAddress = async () => {
    const result = await prismaClient.address.findFirst({
        where: {
            contact: {
                username: 'test'
            }
        }
    });

    return result;
}