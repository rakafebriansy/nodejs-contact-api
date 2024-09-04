import { prismaClient } from "../app/database"
import { logger } from "../app/logging";
import { ResponseError } from "../errors/response-error";
import { createAddressValidation } from "../validations/address-validation";
import { getContactValidation } from "../validations/contact-validation"
import { validate } from "../validations/validation"

const create = async (user, contactId, request) => {
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

    const addressRequest = validate(createAddressValidation, request);
    addressRequest.contact_id = contactId;

    const address = await prismaClient.address.create({
        data: addressRequest,
        select: {
            id: true,
            street: true,
            province: true,
            city: true,
            country: true,
            postal_code: true,
        }
    });

    return address;
}

export default {
    create
}