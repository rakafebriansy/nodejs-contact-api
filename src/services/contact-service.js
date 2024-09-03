import { prismaClient } from "../app/database";
import { createContactValidation } from "../validations/contact-validation"
import { validate } from "../validations/validation"

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

export default {
    create
}