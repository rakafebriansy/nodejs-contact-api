import joi from 'joi';

export const createAddressValidation = joi.object({
    street: joi.string().max(255).optional(),
    city: joi.string().max(100).optional(),
    province: joi.string().max(100).optional(),
    country: joi.string().max(100).required(),
    postal_code: joi.string().max(10).required(),
});

export const getAddressValidation = joi.number().min(1).positive().required();