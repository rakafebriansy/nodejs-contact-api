import { prismaClient } from "../app/database"
import { logger } from "../app/logging";
import { ResponseError } from "../errors/response-error";
import { createAddressValidation, getAddressValidation, updateAddressValidation } from "../validations/address-validation";
import { getContactValidation } from "../validations/contact-validation"
import { validate } from "../validations/validation"

const checkContactMustExists = async (user, contactId) => {
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

    return contactId;
}

const create = async (user, contactId, request) => {
    contactId = await checkContactMustExists(user, contactId);

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

const get  = async (user, contactId, addressId) => {
    contactId = await checkContactMustExists(user, contactId);
    addressId = validate(getAddressValidation, addressId);

    const address = await prismaClient.address.findFirst({
        where: {
            contact_id: contactId,
            id: addressId
        },
        select: {
            id: true,
            street: true,
            province: true,
            city: true,
            country: true,
            postal_code: true,
        }
    });

    if(!address) {
        throw new ResponseError(404, 'Address is not found');
    }

    return address;
}

const update = async (user, contactId, request) => {
    contactId = await checkContactMustExists(user, contactId);

    const addressRequest = validate(updateAddressValidation, request);

    const totalAddressInDatabase = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: addressRequest.id
        },
    });

    if(totalAddressInDatabase !== 1) {
        throw new ResponseError(404, 'Address is not found');
    }

    const address = await prismaClient.address.update({
        where: {
            id: addressRequest.id
        },
        data: {
            street: addressRequest.street,
            city: addressRequest.city,
            province: addressRequest.province,
            country: addressRequest.country,
            postal_code: addressRequest.postal_code,
        },
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

const remove = async (user, contactId, addressId) => {
    contactId = await checkContactMustExists(user, contactId);

    addressId = validate(getAddressValidation, addressId);

    const totalAddressInDatabase = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: addressId
        },
    });

    if(totalAddressInDatabase !== 1) {
        throw new ResponseError(404, 'Address is not found');
    }

    const result = await prismaClient.address.delete({
        where: {
            id: addressId
        }
    });

    return result;
}

export default {
    create,
    get,
    update,
    remove
}