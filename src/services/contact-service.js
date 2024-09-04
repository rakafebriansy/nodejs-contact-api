import { request } from "express";
import { prismaClient } from "../app/database";
import { createContactValidation, getContactValidation, searchContactValidation, updateContactValidation } from "../validations/contact-validation"
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

const update = async (user, request) => {
    const contact = validate(updateContactValidation, request);

    const totalContactInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contact.id
        }
    });

    if(totalContactInDatabase !== 1) {
        throw new ResponseError(404, 'Contact is not found');
    }

    const result = await prismaClient.contact.update({
        where: {
            id: contact.id
        },
        data: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
        },
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

const remove = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const totalContactInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId
        }
    });

    if(totalContactInDatabase !== 1) {
        throw new ResponseError(404, 'Contact is not found');
    }

    const result = await prismaClient.contact.delete({
        where: {
            id: contactId
        }
    });

    return result;
}

const search = async (user, request) => {
    request = validate(searchContactValidation, request);

    const skip = (request.page - 1) * request.size;
    
    const filters = [];

    filters.push({
        username: user.username
    });

    if(request.name) {
        filters.push(
        {
            OR: [
                {
                    first_name: {
                        contains: request.name,
                    },
                },
                {
                    last_name: {
                        contains: request.name
                    }
                }
            ]
        });
    }

    if(request.email) {
        filters.push(                
        {
            email: {
                contains: request.email
            }
        });
    }

    if(request.phone) {
        filters.push(                
        {
            phone: {
                contains: request.phone
            }
        });
    }

    const contacts = await prismaClient.contact.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    });

    const totalItems = await prismaClient.contact.count({
        where: {
            AND: filters
        }
    });

    const result = {
        data: contacts,
        paging: {
            page: request.page,
            total_items: totalItems,
            total_pages: Math.ceil(totalItems/request.size)
        }
    };

    return result;
}

export default {
    create,
    get,
    update,
    remove,
    search
}