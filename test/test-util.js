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