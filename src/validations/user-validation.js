import joi from 'joi';

export const registerUserValidation = joi.object({
    username: joi.string().max(100).required(),
    password: joi.string().max(100).required(),
    name: joi.string().max(100).required(),
});

export const loginUserValidation = joi.object({
    username: joi.string().max(100).required(),
    password: joi.string().max(100).required()
});

export const getUserValidation = joi.string().max(100).required();

export const updateUserValidation = joi.object({
    username: joi.string().max(100).required(),
    password: joi.string().max(100).optional(),
    name: joi.string().max(100).optional()
});