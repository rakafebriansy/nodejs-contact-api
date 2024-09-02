import { request } from "express";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { getUserValidation, loginUserValidation, registerUserValidation } from "../validations/user-validation.js";
import { validate } from "../validations/validation.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, 'Username is already exists');
    }

    user.password = await bcrypt.hash(user.password, 10);

    const result = await prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });

    return result;
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    });

    if(!user) {
        throw new ResponseError(401, 'Username or password is wrong');
    }
    
    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    
    if(!isPasswordValid) {
        throw new ResponseError(401, 'Username or password is wrong');
    }

    const token = uuid().toString();
    const result = await prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });

    return result;
}

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    });

    if(!user) {
        throw new ResponseError(404, 'User is not found');
    }

    return user;
}

export default {
    register,
    login,
    get
}