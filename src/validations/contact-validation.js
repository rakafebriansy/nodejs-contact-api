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

export const searchContactValidation = joi.object({
    page: joi.number().min(1).positive().default(1),
    size: joi.number().positive().max(100).default(10),
    name: joi.string().optional(),
    email: joi.string().optional(),
    phone: joi.string().optional(),
});