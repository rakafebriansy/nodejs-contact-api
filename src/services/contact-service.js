import { request } from "express";
import { prismaClient } from "../app/database";
import { createContactValidation, getContactValidation } from "../validations/contact-validation"
import { validate } from "../validations/validation"
import { ResponseError } from "../errors/response-error";

const create = async (user, request) => {
    const contact = validate(createContactValidation, request);
    contact.username = user.username;

    const result = prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        }
    });

    return result;
}

const get = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const contact = await prismaClient.contact.findFirst({
        where: {
            username: user.username,
            id: contactId
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        }
    });

    if(!contact) {
        throw new ResponseError(404, 'Contact is not found');
    }

    return contact;
}

export default {
    create,
    get
}