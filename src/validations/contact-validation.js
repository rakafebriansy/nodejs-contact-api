import joi from "joi";

export const createContactValidation = joi.object({
    first_name: joi.string().max(100).required(),
    last_name: joi.string().max(100).required(),
    email: joi.string().max(200).email().required(),
    phone: joi.string().max(20).required(),
});

export const getContactValidation = joi.number().positive().required();

export const updateContactValidation = joi.object({
    id: joi.number().positive().required(),
    first_name: joi.string().max(100).required(),
    last_name: joi.string().max(100).required(),
    email: joi.string().max(200).email().required(),
    phone: joi.string().max(20).required(),
});